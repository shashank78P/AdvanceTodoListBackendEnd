const jwtDecode = require("jwt-decode")
const { default: mongoose } = require("mongoose")


const { userModel } = require("../backendConn")

const sendResponse = require("../globalFunctions/sendResponse")

const checkForlogIn = async (req,res,next)=>{
    try {
        if(req.headers?.authorization){
            let data = jwtDecode(await req.headers.authorization)
            console.log(data)
            let userData =  await userModel.find({_id : new mongoose.Types.ObjectId(data.id)},{password : 0})
            if(userData.length > 0){
                next()
                return
            }
        }
        sendResponse(res,"","Please Login First!!!",401)
    } catch (err) {
        sendResponse(res,"","Please Login First!!!",0)
    }
}

module.exports = checkForlogIn