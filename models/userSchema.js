import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: [true,"DOB is required!"],
        minLength:[3,"First Name must contain at least 3 characters"]
    },
    lastName:{
        type: String,
        required: [true,"DOB is required!"],
        minLength:[3,"Last Name must contain at least 3 characters"]
    },
    email:{
        type: String,
        required: [true,"DOB is required!"],
        validate: [validator.isEmail, " please provide a valid email"]
    },
    phone:{
        type: String,
        required: [true,"DOB is required!"],
        minLength:[11,"Phone Number Must Contain Exact 11 digits"],
        maxLength:[11,"Phone Number Must Contain Exact 11 digits"]
    },
    dob:{
        type: Date,
        required: [true,"DOB is required!"],
    },
    gender:{
        type: String,
        required: [true,"DOB is required!"],
        enum: ["Male","Female"]
    },
    password:{
        type: String,
        minLength:[8,"Password muust contain atleast 8 characters!"],
        required: [true,"DOB is required!"],
        select: false
    },
    role:{
        type: String,required: [true,"DOB is required!"],
        enum: ["Admin","Patient","Doctor"],
    },
    doctorDepartment:{
        type:String
    },
    docAvatar:{
        public_id:String,
        url:String,
    }
});


userSchema.pre("save",async function (next){
    if(!this.isModified("password")){
        next();
    }
    this.password= await bcrypt.hash(this.password,10);
});
userSchema.methods.comparePassword=async function(enteredPassword)
{
    return await bcrypt.compare(enteredPassword,this.password);
}
userSchema.methods.generateJsonWebToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY, {
        expiresIn:process.env.JWT_EXPIRES,
    });
}



export const User = mongoose.model("User",userSchema);