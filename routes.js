const express = require("express")
const app = require("./config/config.js")
const hbs = require("express-handlebars")
const path = require("path");
const User = require("./models/User.js");
const getIP = require("./funcs/ ip.js");
const formatName = require("./funcs/name.js");
const date = require("./date/config.js");
const { marked } = require("marked");
const connect = require("./mysql/config.js");
const multer = require("multer");
const { diskStorage } = require("multer");


app.engine('hbs', hbs.engine({ extname: ".hbs" }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname + "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "images")));



const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const fileExtension = file.originalname.split(".")[1]

        const newFileName = require('crypto')
            .randomBytes(64)
            .toString('hex');

        cb(null, `${newFileName}.${fileExtension}`);
    }
})

const upload = multer({ storage })

app.get("/", async(req, res)=>{
    const ip = await getIP()
    const user = await User.findOne({
        where: {
            address: ip
        }
    })
    if(!user || user === null){
        const menu = `
            <button class="btn btn-sm" style="margin-right: 3px;" onclick="location.href='/register'"><strong>Register</strong></button>
            <button class="btn btn-sm" onclick="location.href='/login'"><strong>Login</strong></button>
        `
        return res.status(404).render("login", {
            menu
        })
    }else{
        const menu = `
            <button class="btn btn-sm text-decoration-underline" style="margin-right: 3px;" onclick="location.href='/@${user.username}'"><strong>${user.username}</strong></button>
            <button class="btn btn-sm text-danger text-decoration-underline" onclick="location.href='/logout'"><strong>Logout</strong></button>
        `
        return res.status(200).render("home", {
            menu,
            user
        })
    }
})

app.get("/login", async(req, res)=>{
    const ip = await getIP()
    const user = await User.findOne({
        where: {
            address: ip
        }
    })
    if(!user || user === null){
        const menu = `
            <button class="btn btn-sm" style="margin-right: 3px;" onclick="location.href='/register'"><strong>Register</strong></button>
            <button class="btn btn-sm" onclick="location.href='/login'"><strong>Login</strong></button>
        `
        return res.status(404).render("login", {
            menu
        })
    }else{
        return res.status(200).redirect("/")
    }
})

app.post("/login", async(req, res)=>{
    const { username, password } = req.body;
    const ip = await getIP()
    const user = await User.findOne({
        where: {
            address: ip
        }
    })

    if(!user || user === null){
        if(!username || !password){
            return res.status(400).render("login", {
                message: `
                <div class="alert alert-danger" role="alert">
                    Por favor, preencha todos os campos corretamente.
                </div>
                `
            })
        }
        const userLogin = await User.findOne({
            where: {
                username: formatName(username),
                password
            }
        })
        if(!userLogin || userLogin === null){
            return res.status(401).render("login", {
                message: `
                <div class="alert alert-danger" role="alert">
                    Usuário ou senha incorretos.
                </div>
                `
            })
        }else{
            const update = await User.update({
                address: ip
            }, {
                where: {
                    id: userLogin.id
                }
            })
            return res.status(200).redirect("/")
        }
    }
    else{
        return res.redirect("/")
    }
})

app.get("/register", async(req, res)=>{
    const ip = await getIP()
    const user = await User.findOne({
        where: {
            address: ip
        }
    })
    if(!user || user === null){
        const menu = `
            <button class="btn btn-sm" style="margin-right: 3px;" onclick="location.href='/register'"><strong>Register</strong></button>
            <button class="btn btn-sm" onclick="location.href='/login'"><strong>Login</strong></button>
        `
        return res.status(404).render("register", {
            menu
        })
    }else{
        return res.status(200).redirect("/")
    }
})
app.post("/register", async(req, res)=>{
    const { username, password, email } = req.body;
    const ip = await getIP()
    const mysql = await connect()
    const user = await User.findOne({
        where: {
            address: ip
        }
    })
    if(!user || user === null){
        if(!username || !password){
            return res.status(400).render("register", {
                message: `
                <div class="alert alert-danger" role="alert">
                    Por favor, preencha todos os campos.
                </div>
                `
            })
        }
        // const newUser = await User.create({
        //     username: formatName(username),
        //     password,
        //     email,
        //     datetime: date,
        //     biography: marked("- Olá, você pode editar sua biografia clicando no botão 'Editar Perfil'"),
        //     address: ip
        // })
        const newUser = await mysql.query(`INSERT INTO Users (username, password, email, datetime, biography, address, image, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            formatName(username),
            password,
            email,
            date,
            marked("- Olá, você pode editar sua biografia clicando no botão 'Editar Perfil'"),
            ip,
            '',
            new Date(),
            new Date()
        ])
        return res.status(201).redirect("/")
    }else{
        return res.redirect("/")
    }
})

app.get("/change-image", async(req, res)=>{
    const ip = await getIP()
    const mysql = await connect()
    
    const user = await User.findOne({
        where: {
            address: ip
        }
    })
    if(!user || user === null){
        return res.status(404).redirect("/login")
    }else{
        const menu = `
            <button class="btn btn-sm text-decoration-underline" style="margin-right: 3px;" onclick="location.href='/@${user.username}'"><strong>${user.username}</strong></button>
            <button class="btn btn-sm text-danger text-decoration-underline" onclick="location.href='/logout'"><strong>Logout</strong></button>
        `
        const userFind = await mysql.query(`SELECT * FROM Users WHERE address = ?`, [ip])
        return res.status(200).render("change-image", {
            menu,
            user: userFind[0]
        })
    }
})

app.post("/change-image", upload.single("image"), async(req, res)=>{
    
})

app.get("/logout", async(req, res)=>{
    const ip = await getIP()
    const user = await User.findOne({
        where: {
            address: ip
        }
    })
    if(!user || user === null){
        return res.status(404).redirect("/login")
    }else{
        const update = await User.update({
            address: ''
        }, {
            where: {
                id: user.id
            }
        })
        return res.status(200).redirect("/login")
    }
})

app.get("/@:username", async(req, res)=>{
    const mysql = await connect()
   const { username } = req.params;
   const user = await User.findOne({
       where: {
           username: formatName(username)
       }
   })
   if(!user || user === null){
       return res.redirect("/login")
   }else{
         const ip = await getIP()
         const currentUser = await User.findOne({
              where: {
                address: ip
              }
         })


         let menu = "";
         let editProfile = "";
         let changeImage = "";


         if(!currentUser || currentUser === null){
            changeImage = ''
            editProfile = ''
             menu = `
                <button class="btn btn-sm" style="margin-right: 3px;" onclick="location.href='/register'"><strong>Registrar</strong></button>
                <button class="btn btn-sm" onclick="location.href='/login'"><strong>Login</strong></button>
            `
            }else{
            // changeImage = `
            //    <button class="btn btn-sm" style="margin-right: 3px;" onclick="location.href='/change-image'"><strong>Alterar Imagem</strong></button>
            // `
            changeImage = `
                <a href="/change-image">Alterar Imagem</a>
            `
            // editProfile = `
            //    <button class="btn btn-sm" style="margin-right: 3px;" onclick="location.href='/edit-profile'"><strong>Editar Perfil</strong></button>
            // `
            editProfile = `
                <a href="/edit-profile">Editar Perfil</a>
            `
            menu = `
                <button class="btn btn-sm text-decoration-underline" style="margin-right: 3px;" onclick="location.href='/@${currentUser.username}'"><strong>${currentUser.username}</strong></button>
                <button class="btn btn-sm text-danger text-decoration-underline" onclick="location.href='/logout'"><strong>Logout</strong></button>
            `
         }
         const userProfile = await mysql.query(`SELECT * FROM Users WHERE id = ?`, [user.id])
         return res.status(200).render("profile", {
              user: userProfile[0],
              menu,
              editProfile,
              changeImage,
         })
   }
})

app.listen(3000, (err)=>{
    if(err){
        console.log({
            message: "New undefined error"
        })
    }else{
        console.log({
            message: "success",
            host: "https://localhost:3000"
        })
    }
})

