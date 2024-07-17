import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
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
    appointment_date:{
        type: String,
        required:true
    },
    department : {
        type: String,
        required:true
    },
    doctor : {
        firstName :{
            type: String,
            required:true
        },
        lastName : {
            type: String,
            required:true
        }
    },
    hasVisited : {
        type: Boolean,
        required : false
    },
    doctorId : {
        type: mongoose.Schema.ObjectId,
        required : true
    },
    patientId : {
        type: mongoose.Schema.ObjectId,
        required : true
    },
    address:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Pending","Accepted","Rejected"],
        default: "Pending"
    }
});

export const Appointment = mongoose.model("Appointmnet",appointmentSchema);