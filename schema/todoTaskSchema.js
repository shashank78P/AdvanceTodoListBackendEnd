const mongoose = require("mongoose");

const todoTaskSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Types.ObjectId,
        require : [true, "%%userId required%%}"]
    },
    title: {
        type: String,
        require: [true, "%%Todo task title required%%}"],
        validate: {
            validator: (title) => {
                return title.length <= 50;
            },
            message: "%%Title length must be lesser than or equal to 50%%"
        }
    },
    description: {
        type: String,
        require: [true, "%%Todo task description required%%}"],
        validate: {
            validator: (description) => {
                return description.length <= 256;
            },
            message: "%%Description length must be lesser than or equal to 256%%"
        }
    },
    state: {
        type: String,
        require: [true, "%%Todo task state required%%}"],
        enum: {
            values: ["active", "completed"],
            message: "%%entered state is not supported%%"
        }
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = todoTaskSchema