const mongoose = require("mongoose")


const UserSchema = mongoose.Schema({
    username: {
        type: String,
        min :3,
        max: 20,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min:10
    },
    email: {
        type: String,
        required: true,
        unique:true
    }


})
module.exports = mongoose.model("User", UserSchema);