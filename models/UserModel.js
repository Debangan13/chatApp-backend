import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    email:{
        type:String,
        required:[true,'Email is Required'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'password is Required'],
    },
    firstName:{
        type:String,
        required:false
    },
    LastName:{
        type:String,
        required:false
    },
    image:{
        type:String,
        required:false
    },
    color:{
        type:Number,
        required:false
    },
    ProfileSetup:{
        type:Boolean,
        default:false
    },
})

