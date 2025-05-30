const express = require("express")
const app = require("./config/config.js")
const hbs = require("express-handlebars")
const path = require("path");
const User = require("./models/User.js");
const getIP = require("./funcs/ ip.js");


app.engine('hbs', hbs.engine({ extname: ".hbs" }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname + "/views"));

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
            <button class="btn btn-sm btn-dark" onclick="location.href='/@${user.username}'"><strong>Profile</strong></button>
            <button class="btn btn-sm btn-dark" onclick="location.href='/logout'"><strong>Logout</strong></button>
        `
        return res.status(200).render("index", {
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

