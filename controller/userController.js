import { catchAsyncErrors } from "../Middlewares/catchAsyncErrors.js";
import ErrorHandler from "../Middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";


export const patientRegister = catchAsyncErrors(async (req,res,next)=>{
    const {
    firstName,lastName,email,phone,password,gender,dob
    }= req.body;
    if( !firstName || !lastName || !email || !phone || !password || !gender || !dob)
    {
        return next(new ErrorHandler("Please Fill full form",400));
    }
    let user = await User.findOne({ email });
    if(user)
    {
        return next(new ErrorHandler("User already Registered!",400));
    }
    user = await User.create({
        firstName,lastName,email,phone,password,gender,dob,role: "Patient"
    });
    generateToken(user,"User Registered!",200,res);
    
});

export const login = catchAsyncErrors(async (req,res,next)=>{
    const { email,password,confirmPassword , role} = req.body;
    if(!email || !password || !confirmPassword || !role)
    {
        return next(new ErrorHandler("Please preview all details",400));
    }
    if(password !== confirmPassword)
    {
        return next(new ErrorHandler("Password and confirmPassword do noit match",400));
    }
    const user=await User.findOne({email}).select("+password");
    if(!user)
    {
        return next(new ErrorHandler("Invalid password or email",400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched)
    {
        return next(new ErrorHandler("Invalid password or email",400));
    }
    if(role !== user.role)
    {
        return next(new ErrorHandler("User with role is not found",400));
    }
    generateToken(user,"User Logged in Successfully!",200,res);
});
export const addNewAdmin=catchAsyncErrors(async(req,res,next)=>{
    const { firstName,lastName,email,phone,password,gender,dob }=req.body;
    if( !firstName || !lastName || !email || !phone || !password || !gender || !dob)
        {
            return next(new ErrorHandler("Please Fill full firm",400));
        }
        const isRegistered = await User.findOne({email});
        if(isRegistered){
            return next(new ErrorHandler(`${isRegistered.role} With This Email Already Exists`));
        }
        const admin=await User.create({
            firstName,lastName,email,phone,password,gender,dob,role:"Admin"
        });
        res.status(200).json({
            success:true,
            message:"New Admin Registered",
        });
});

export const logoutAdmin = catchAsyncErrors(async (req,res,next)=>{
    res
    .status(200)
    .cookie("adminToken","",{
        httpOnly:true,
        expires:new Date(Date.now()),
        secure:true,
        sameSite:"None"
    })
    .json({
        success:true,
        message:"Admin Logged Out Successfully!",
    });
});

export const logoutPatient = catchAsyncErrors(async (req,res,next)=>{
    res
    .status(200)
    .cookie("patientToken","",{
        httpOnly:true,
        expires:new Date(Date.now()),
        secure:true,
        sameSite:"None"
    })
    .json({
        success:true,
        message:"Patient Logged Out Successfully!",
    });
});
export const addNewDoctor = catchAsyncErrors( async(req,res,next)=>{
    // if(!req.files || Object.keys(req.files).length === 0)
    // {
    //     return next(new ErrorHandler("Doctor avatar required!",400));
    // }
    // const { docAvatar } = req.files;
    // const allowedFormats = ["image/png","image/jpeg","image/webp"];
    // if(!allowedFormats.includes(docAvatar.minetype))
    // {
    //     return next(new ErrorHandler("File Format Not Suppported",400));
    // }
    const {firstName,lastName,email,phone,password,gender,dob,doctorDepartment}=req.body;
    if(!firstName || !lastName || !email || !phone || !password ||!gender || !dob || !doctorDepartment)
    {
        return next(new ErrorHandler("Please provide full details",400));
    }
    const isRegistered = await User.findOne({ email });
    if(isRegistered)
    {
        return next(
            new ErrorHandler(
                `${isRegistered.role} already registered with this email`,400
            )
        );
    }
    // const cloudinaryResponse = await cloudinary.uploader.uplaod(docAvatar.tempFilePath);
    // if(!cloudinaryResponse || cloudinaryResponse.error)
    // {
    //     console.error(
    //         "cloudinary error:",cloudinaryResponse.error ||
    //         "Unknown cloudinary error"
    //     );
    // }
    const doctor = await User.create({
        firstName,lastName,email,phone,password,gender,dob,doctorDepartment,role:"Doctor"
        // ,
        // docAvatar:{
        //     public_id:cloudinaryResponse.public_id,
        //     url:cloudinaryResponse.secure_url
        // },
    });
    res.status(200).json({
        success:true,
        message:"New Doctor Registered!",
        doctor
    });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
      success: true,
      user
    });
  });

  export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
    const doctors = await User.find({ role: "Doctor" });
    res.status(200).json({
      success: true,
      doctors
    });
  });