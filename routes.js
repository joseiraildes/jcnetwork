const express = require("express")
const app = require("./config/config.js")
const hbs = require("express-handlebars")
const path = require("path")


app.engine('hbs', hbs.engine({ extname: ".hbs" }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname + "/views"));

app.get("/", async(req, res)=>{
    res.render("home")
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

