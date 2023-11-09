const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName : {
        type : "String",
        require : [true,"%%Username required%%"]
    },
    email: {
        type: "String",
        required: [true, "%%email required%%"],
        unique: [true, "%%user with his email is already exist%%"],
        validate: {
            validator: (email) => {
                return email.match(/^[a-zA-z0-9+_.-]+@[a-zA-Z0-9.-]+$/)
            },
            message: "%%Invalid Email%%"
        }
    },
    password: {
        type: "String",
        required: [true, "%%password required%%"],            
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = userSchema;