const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/fake-whatsapp");
    console.log("MongoDB connected");

    let all_Chats = [
        {
            from: "neha",
            to: "shreya",
            message: "moshi moshi",
            created_at: new Date(),
        },

        {
            from: "kushal",
            to: "karan",
            message: "joining letter",
            created_at: new Date(),
        },

        {
            from: "Poonam",
            to: "Aarya",
            message: "notes bhej de yaar",
            created_at: new Date(),
        }
    ];

    let result = await Chat.insertMany(all_Chats);

    console.log(result);
}

main().catch((err) => {
    console.log(err);
});