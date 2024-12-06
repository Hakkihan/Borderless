import { ExtractData, S3UploadResponse } from "../models/passportmodel";
import express, { Request, Response } from "express";
import { uploadPassportImage, extractPassportData, createPassportDetailsPG } from "../services/passportService";

const router = express.Router();




router.post("/extractPassportData", async (req: Request, res: Response): Promise<void> => {
  try {
    const uploadResponse: S3UploadResponse = await uploadPassportImage(req);
    const extractData: ExtractData = await extractPassportData(uploadResponse);
    const transactionResponse = await createPassportDetailsPG(uploadResponse, extractData);
    res.status(200).json({
      message: transactionResponse.id,
      extractedData: transactionResponse.message, 
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
});

export default router;
