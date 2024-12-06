import express from "express";
import dotenv from "dotenv";
import passportController from './controllers/passportcontroller'
import { errorHandler } from "./utils/errorHandler";
import cors from "cors";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/passport", passportController);


// app.use(errorHandler);

export default app;

