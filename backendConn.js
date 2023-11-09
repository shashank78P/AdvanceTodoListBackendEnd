const mongoose = require("mongoose")

mongoose.set('strictQuery', false);

const todoTaskSchema = require("./schema/todoTaskSchema");
const undoTaskSchema = require("./schema/undoSchema");
const userSchema = require("./schema/userSchema")

// mongoose.connect("mongodb://localhost:27017/todoList")
mongoose.connect("mongodb+srv://Shashank:SDdtcv6glZn4BdG0@cluster0.6vqxeta.mongodb.net/?retryWrites=true&w=majority")
.then(res => {
    console.log("connected to database")
})
.catch(err => {
    console.log(err)
})
const undoTaskModel = mongoose.model("undoTask",undoTaskSchema)
const todoTaskModel = mongoose.model("todoTask",todoTaskSchema)
const userModel = mongoose.model("user",userSchema)

module.exports = { todoTaskModel , userModel , undoTaskModel}