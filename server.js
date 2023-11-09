const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

const todoTaskRouter = require("./Router/todoTask")
const userRouter = require("./Router/user")
const expressSession = require("express-session")

const todoTaskModel = require("./backendConn")
const checkForlogIn = require("./auth/checkForLogin")

app.use(cors({ credentials: true, origin: "*" }))
app.use(express.json())
app.use(bodyParser.urlencoded({extended : false}))
app.use(cookieParser())
// app.use(expressSession({
//     resave : false,
//     secret : "session",
//     cookie : {
//         max : 1000*60*60,
//         sameSite : "none",
//         secure : false
//     }
// }))

app.use("/todoTask",todoTaskRouter)
app.use("/auth",userRouter)

app.listen(3001,(res,err)=>{
    if(!err){
        console.log("listenning to 3001 port");
    }
})

// jwtDecode(req.headers.authorization)
// nornal font
{/* <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Roboto+Condensed:wght@300&display=swap" rel="stylesheet"></link> */}

// font-family: 'Pacifico', cursive;
// font-family: 'Roboto Condensed', sans-serif;