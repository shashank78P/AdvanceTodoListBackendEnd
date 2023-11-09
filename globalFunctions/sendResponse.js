const sendResponse = (res,data,msg,statusCode)=>{
    try {
        return res.send({
            data,
            msg,
            statusCode,
        })
    } catch (error) {
    }
}

module.exports = sendResponse