import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import {errorMiddleware} from "./Middlewares/errorMiddleware.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";

const app= express();
config({ path:"./config/config.env" });

//app.use(cors());

//  app.use((req, res, next) => {
//      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173','http://localhost:5174'); // Replace with allowed origin
//     res.setHeader('Access-Control-Allow-Credentials', true);
//      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allowed methods
//         res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
//      next();
//    });

//    app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5174','http://localhost:4000'); // Replace with allowed origin
//    res.setHeader('Access-Control-Allow-Credentials', true);
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allowed methods
//        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
//     next();
//   });

app.use(
    cors({

        origin: [process.env.FRONTEND_URI,process.env.DASHBOARD_URI],
        methods: ["GET","POST","PUT","DELETE"],
        credentials:true,
    })
);


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
}));


app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

dbConnection();

app.use(errorMiddleware);
export default app;
