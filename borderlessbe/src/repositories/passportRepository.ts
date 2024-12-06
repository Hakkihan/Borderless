import dotenv from "dotenv";
import AWS from "aws-sdk";
import fs from "fs";
import { ExtractData, TextractResponse, S3UploadResponse, UploadedFile, DbResponse } from "../models/passportmodel";
import { query, pool } from "../models/db";

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const textract = new AWS.Textract({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});



/**
 * Upload file to S3 bucket
 * @param {File} file - File object from formidable
 * @returns {Promise<S3UploadResponse>} S3 upload response
 */
export const uploadFileToS3 = async (file: UploadedFile): Promise<S3UploadResponse> => {
  try {
    const fileContent = fs.readFileSync(file.file[0].filepath);

    const params: AWS.S3.Types.PutObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: `uploads/${file.file[0].originalFilename}`,
      Body: fileContent,
      ContentType: file.file[0].mimetype || "application/octet-stream",
    };

    const s3Response = await s3.upload(params).promise();
    console.log("File uploaded successfully:", s3Response);

    return s3Response as S3UploadResponse;
  } catch (error: any) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
};

/**
 * Extract text from an image using AWS Textract
 * @param {S3UploadResponse} uploadResponse - S3 upload response containing bucket and key
 * @returns {Promise<ExtractData>} Extracted text data
 */
export const extractTextFromImage = async (
  uploadResponse: S3UploadResponse
): Promise<ExtractData> => {
  try {
    const params: AWS.Textract.Types.AnalyzeDocumentRequest = {
      Document: {
        S3Object: {
          Bucket: uploadResponse.Bucket,
          Name: uploadResponse.Key,
        },
      },
      FeatureTypes: ["TABLES", "FORMS"],
    };

    const textractResponse = await textract.analyzeDocument(params).promise();

    const blocks = textractResponse.Blocks ?? [];
    const extractedDates = await extractDatesFromTextract({ Blocks: blocks });

    return {
      dates: extractedDates,
      otherFields: {}, // Replace with actual other fields logic if needed
    };
  } catch (error: any) {
    console.error("Error extracting text with Textract:", error);
    throw new Error("Failed to extract text from image");
  }
};

/**
 * Extract dates from Textract response
 * @param {TextractResponse} textractResponse - Response from Textract
 * @returns {string[]} List of extracted dates
 */
const extractDatesFromTextract = async (textractResponse: TextractResponse): Promise<string[]> => {
  const dateRegex = /\b(\d{1,2})\s([A-Za-z]{3,}(?:\/[A-Za-z]{3,})?)\s(\d{2}|\d{4})\b/;

  const blocksWithDates = textractResponse.Blocks.filter((block) =>
    dateRegex.test(block.Text || "")
  );
  return blocksWithDates.map((block) => block.Text || "");
};

export const insertPassportAndExtraction = async (s3UploadData: S3UploadResponse, extractData: ExtractData) => {

  const client = await pool.connect(); // Get a client from the pool
  try {
    // Start the transaction
    await client.query("BEGIN");

    const insertPassportText = `
        INSERT INTO passportUpload (ETag, Location, DateTimeUploaded)
        VALUES ($1, $2, NOW())
        RETURNING *; 
      `;
    const passportResult = await client.query(insertPassportText, [s3UploadData.ETag, s3UploadData.Location]);
    const passportUploadId = passportResult.rows[0].id; // Get the inserted passport upload ID

    const insertExtractionText = `
        INSERT INTO dateextractions (uploadID, DateOfBirth, DateOfIssue, DateOfExpiry)
        VALUES ($1, $2, $3, $4);
      `;
    await client.query(insertExtractionText, [
      passportUploadId, // Use the ID from passportUpload as the f.k
      extractData.dates[0],
      extractData.dates[1],
      extractData.dates[2],
    ]);

    await client.query("COMMIT");
    const dbResponse : DbResponse = { id: passportUploadId, message: "Transaction successful" };
    return dbResponse;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in transaction:", error);
    throw new Error("Transaction failed, rolling back.");
  } finally {
    client.release();
  }

};
