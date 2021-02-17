//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose= require("mongoose");
const encrypt = require('mongoose-encryption');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB",
 {useNewUrlParser:true,useUnifiedTopology:true});
//defining the user schema
const userSchema= new mongoose.Schema({
    email: String,
    password:String
});
//Passing a long scret as string insted of two keys:check the documentaion of 
//mongoose encryption. (Level2 authentication:Data Encryption)
const secret="Thisismysecret";
userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});
//mongoose model
const User= new mongoose.model("User", userSchema);

app.get("/", function(req,res){
    res.render("home");
});
app.get("/login", function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save(function(err){
        if(!err){
            res.render("secrets");
        }else{
            console.log(err);
        }
    });  
});

app.post("/login",function(req,res){
    const username= req.body.username;
    const password= req.body.password;
User.findOne({email:username},function(err, result){
    if(err){
        console.log(err);
     }else {
         if (result){
             if(result.password===password){
                 res.render("secrets");
             }
         }
    }
});
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});