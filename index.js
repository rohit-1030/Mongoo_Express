const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path") ; 
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError.js");

app.set("views", path.join(__dirname,"views"));
app.set("view engine" , "ejs");
app.use(express.static(path.join(__dirname , "public")));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/fake-whatsapp");
}

//Index 
app.get("/chats" , async(req , res)=>{
    let chats = await Chat.find();
    res.render("index.ejs" , {chats});
})

//new 
app.get("/chats/new" , (req , res)=>{
    // throw new ExpressError(404 , "Page not found");
    res.render("new_chat.ejs");
})

//post
app.post("/chats" , (req , res)=>{
  let {from , to , message}  = req.body ;
  let newChat = new Chat({
    from : from,
    to : to,
    message : message ,
    created_at : new Date(),
  });
  newChat.save().then(res => {console.log("chat was working")}).catch(err =>{console.log(err )})
  console.log(newChat);
  res.redirect("/chats");
})

function asyncWrap(fn){
    return function(req , res , next){
        fn(req , res , next).catch(err => next(err));
    }
};

//new - Show Route
app.get("/chats/:id" , asyncWrap(async(req , res , next)=>{
    let {id} = req.params;
    let chat = await Chat.findById(id);
    if(!chat){
        next(new ExpressError(404 , "Chat not found"));
    }
    res.render("edit.ejs" , {chat});
}));

//edit
app.get("/chats/:id/edit" , asyncWrap(async(req ,res)=>{
    let {id} = req.params;
    let chat = await Chat.findById(id) ;
    res.render("edit.ejs" , {chat});
}))

//update
app.put("/chats/:id" , asyncWrap(async(req ,res)=>{
    let {id} = req.params;
    let {message : newMessage} = req.body;
    let updateChat =await Chat.findByIdAndUpdate(
        id , 
        {message : newMessage} , 
        {runValidators : true}
    ); 
    res.redirect("/chats");
}))

//delete or destroy
app.delete("/chats/:id" , asyncWrap(async(req,res)=>{
     let {id} = req.params;
     let deletedChat = await Chat.findByIdAndDelete(id);
     res.redirect("/chats");
}))

main().catch(err => console.log(err));

app.get("/" , (req ,res)=>{
    res.send("Root is working");z
});


// Error-handling Middleware

app.use((err , req , res , next)=>{
    let {status = 500 , message = "Something went wrong"} = err;
    res.status(status).send(message);
})

app.listen(8000 ,()=>{
    console.log("Server is listening on port 8000");
});