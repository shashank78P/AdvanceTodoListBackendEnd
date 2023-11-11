const express = require("express")
const bcrypt = require("bcryptjs")
const JWT = require("jsonwebtoken")
const { default: mongoose } = require("mongoose")
const jwtDecode = require("jwt-decode")
const autoLogin = require("../auth/autoLogin")

const { userModel } = require("../backendConn")

const sendResponse = require("../globalFunctions/sendResponse")
const checkForlogIn = require("../auth/checkForLogin")

const userRouter = express.Router()

const loginUser = async (req, res) => {
    try {
        //taking only password from Database using email
        const userDetails = await userModel.find({ email: req.body.email }, { email: 1, password: 1, userName: 1 })
        console.log("userDetails=",userDetails)
        //if user exist && password matched
        if (userDetails.length > 0 && await bcrypt.compare(req.body.password, userDetails[0].password)) {
            let token = JWT.sign({ id: userDetails[0]._id }, "todolist webapp",
                {
                    expiresIn: "10d"
                })
            sendResponse(res, {token,_id : userDetails[0]._id, userName: userDetails[0].userName, email: userDetails[0].email }, "log in sucessfull", 200)
        }
        else {
            sendResponse(res, "", "invalid log in", 0)
        }
    }
    catch (err) {
        console.log(err)
        sendResponse(res, "", err?.message.split("%%")[1], 0)
    }
}

const getUserDetails = async (req, res) => {
    try {
        if(req.headers?.authorization){
            let data = jwtDecode(await req.headers.authorization)
            console.log(data)
            let userDetails =  await userModel.find({_id : new mongoose.Types.ObjectId(data.id)},{password : 0})
            if(userDetails.length > 0){
                sendResponse(res, {_id : userDetails[0]._id, userName: userDetails[0].userName, email: userDetails[0].email }, "Authenticated", 200)
                return
            }
            sendResponse(res,"","Please Login / signin First!!!",401)
        }
        sendResponse(res,"","Please Login / signin First!!!",401)
    }
    catch (err) {
        console.log(err)
        sendResponse(res, "", "Please Login / signin First!!!", 0)
    }
}

const signIn = async (req, res, next) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password.toString(), 12)
        let result = await userModel?.insertMany(req.body)
        if (result) {
            sendResponse(res, "", "account created sucessfull!!!", 200)
        }
        else {
            sendResponse(res, "", "something went wrong", 0)
        }
    } catch (err) {
        console.log(err)
        let message = err.message
        if (err?.code === 11000) {
            if (err.message.match(/email/)) {
                message = "User with this email already exist!!!"
            }
        }
        else {
            message = message.split("%%")[1]
        }
        sendResponse(res, "", message, 0)
    }
}

function checkForValidPassword(req, res, next) {
    try {
        if (req.body) {
            if (!req.body.password) { sendResponse(res, "", "password is required", 0); return }
            if (!(/[A-Z]/).test(req.body.password)) { sendResponse(res, "", "password must contain atleast one upper case character", 0); return }
            if (!(/[A-Z]/).test(req.body.password)) { sendResponse(res, "", "password must contain atleast one lower case character", 0); return }
            if (req.body.password.trim().length < 6) { sendResponse(res, "", "password must have atleast 6 character", 0); return }
            else {
                next()
            }
        }
    } catch (err) {

    }

}

userRouter.route("/auth-me")
    .get(getUserDetails)
userRouter.route("/logIn")
    .post(loginUser)
userRouter.route("/signIn")
    .post(checkForValidPassword, signIn)

module.exports = userRouter
