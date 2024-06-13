import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: [true, "provide unique  username"]

    },
    email: {
        type: String,
        required: true,
        unique: [true, "provide unique email address"]

    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpeiryDate: Date,
    verifyToken: String,
    verifyTokenExpeiry: Date

}, { timestamps: true })

const User = mongoose.models.users || mongoose.model("users", UserSchema)

export default User