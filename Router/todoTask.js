const express = require("express")
const { default: mongoose } = require("mongoose")
const checkForlogIn = require("../auth/checkForLogin")
const { todoTaskModel, undoTaskModel } = require("../backendConn")
const sendResponse = require("../globalFunctions/sendResponse")

const todoTaskRouter = express.Router()

const getToDoTask = async (req, res, next) => {
    try {
        let userId = req.params?.userId
        let state = req.params?.state
        let skip = req.params?.skip
        let query = ""
        if (["all", "active", "completed"].includes(state.trim())) {
            //by default it will be all => change query if all
            if (state.trim() === "all") query = { state: { $in: ["active", "completed"] } }
            //else trim if any extra spaces are present
            else query = { state: state }
        }
        else {
            let regStr = new RegExp(state)
            query = { title: { $regex: regStr } }
        }
        let todoTaskList = await todoTaskModel.find({ userId: new mongoose.Types.ObjectId(userId), ...query }).skip(skip).limit(10)
        if (todoTaskList.length > 0) {
            sendResponse(res, todoTaskList, "", 200)
            return
        }
        sendResponse(res, "", "No record found", 0)
    } catch (err) {
        sendResponse(res, "", "No record found", 0)
    }
}

const addToDoTask = async (req, res, next) => {
    try {
        req.body["userId"] = req.body._id
        delete req.body?._id
        const result = await todoTaskModel.insertMany(req.body)
        if (result) {
            sendResponse(res, result, "todo task added sucessfully", 201)
            return
        }
        sendResponse(res, "", "something went wrong", 0)
    } catch (err) {
        sendResponse(res, "", err.message, 0)
    }
}

const updateTask = async (req, res, next) => {
    try {
        let query = {}
        let userID = {}
        if (req.body?.type === "toggleState") {
            query = { state: req.body.state }
            // .update({_id: ObjectId("63daeb4b586fff96e40566e4")},{$set : })
        }
        userID = { _id: new mongoose.Types.ObjectId(req.body.userID) }
        const result = await todoTaskModel.updateOne({ ...userID }, { $set: query })
        result && sendResponse(res, "", "updated sucessfully", 200)
    } catch (err) {
        sendResponse(res, "", "un-sucessfull!!!", 0)
    }

}

const deleteCompleted = async (req, res, next) => {
    try {
        let fromDataBase = ""
        let toDataBase = ""
        if (req.params.what === "delete") { fromDataBase = todoTaskModel; toDataBase = undoTaskModel }
        if (req.params.what === "undo") { toDataBase = todoTaskModel; fromDataBase = undoTaskModel }
        const completedTask = await fromDataBase.find({ userId: new mongoose.Types.ObjectId(req.params._id), state: "completed" })
        if (completedTask.length > 0) {
            const transformedTask = await toDataBase.insertMany(completedTask)
            if (transformedTask.length > 0) {
                const deletedTask = await fromDataBase.deleteMany({ userId: new mongoose.Types.ObjectId(req.params._id), state: "completed" })
                if (deletedTask.deletedCount > 0) {
                    sendResponse(res, deletedTask, `task ${req.params.what} sucessfull`, 200)
                    return
                } else {
                    const deletedTask = await toDataBase.deleteMany({ userId: new mongoose.Types.ObjectId(req.params._id), state: "completed" })
                    return
                }
            }
            sendResponse(res, "transformedTask", "here the message", 200)
            return
        }
        sendResponse(res, "", `${req.params.what} un-sucessfull`, 0)
    } catch (err) {
        sendResponse(res, "", `un-sucessfull ${req.params.what} `, 0)
    }
}

async function getSingleTodo(req, res, next) {
    try {
        if (req.params._id) {
            const result = await todoTaskModel.find({ _id: new mongoose.Types.ObjectId(req.params._id) })
            if (result.length > 0) {
                sendResponse(res, result, "", 200)
                return
            }
            sendResponse(res, "", "NO record Found!!!", 0)
        }
    } catch (error) {
        sendResponse(res, "", "No Todo task found", 0)
    }
}

async function deleteSingleTask(req, res, next) {
    try {
        if (req.params._id) {
            const result = await todoTaskModel.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(req.params._id) })
            sendResponse(res, "", "deleted sucessfully", 200)
        }
    } catch (error) {
        sendResponse(res, "", "no todo task found", 0)
    }
}

async function updateTodoTask(req, res, next) {
    try {
        if (req.body) {
            let query1 = { userId: new mongoose.Types.ObjectId(req.body._id), _id: new mongoose.Types.ObjectId(req.body.taskId) }
            delete req.body._id
            let query2 = req.body
            const result = await todoTaskModel.updateOne(query1, { $set: query2 })
            if (result?.modifiedCount > 0) {
                sendResponse(res, "", "updated sucessfuly", 200)
                return
            }
            sendResponse(res, "", "not updated sucessfuly", 0)
        }
    } catch (error) {
        sendResponse(res, "", "Not updated!!!", 0)
    }
}

todoTaskRouter.route("/getToDoTask/:userId/:state/:skip")
    .get(getToDoTask)
// .get(checkForlogIn, getToDoTask)
todoTaskRouter.route("/getSingleToDoTask/:_id")
    .get(checkForlogIn, getSingleTodo)
todoTaskRouter.route("/")
    .post(checkForlogIn, addToDoTask)
todoTaskRouter.route("/update")
    .post(checkForlogIn, updateTask)
todoTaskRouter.route("/updateTodoTask")
    .post(checkForlogIn, updateTodoTask)
todoTaskRouter.route("/deleteCompleted/:_id/:what")
    .post(checkForlogIn, deleteCompleted)
todoTaskRouter.route("/deleteTodoTask/:_id/")
    .post(checkForlogIn, deleteSingleTask)

module.exports = todoTaskRouter