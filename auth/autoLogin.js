const jwtDecode = require("jwt-decode")
const mongoose = require("mongoose")

const { userModel } = require("../backendConn")

const sendResponse = require("../globalFunctions/sendResponse")

const autoLogin = async (req,res,next)=>{
    try {
        if(req.headers.authorization){
            let data = jwtDecode(req.headers.authorization)
            let userData =  await userModel.find({_id : mongoose.Types.ObjectId(data.id)},{password:0})
            if(userData.length > 0){
                sendResponse(res,userData,"Auto logIn Sucessfull!!!",201)
                return
            }
        }else{
            next()
            return
        }
    } catch (err) {
        sendResponse(res,"","Auto login failed",0)
    }
}

module.exports = autoLogin