import { parseForm } from "../utils/formidable";
import { uploadFileToS3, extractTextFromImage, insertPassportAndExtraction } from "../repositories/passportRepository";
import { ExtractData, UploadedFile, S3UploadResponse, DbResponse } from "../models/passportmodel";


export const uploadPassportImage = async (formData: any): Promise<S3UploadResponse> => {
  try {
    const { files } = await parseForm(formData);

    if (!files || (Array.isArray(files) && files.length === 0)) {
      throw new Error("No file uploaded");
    }

    if (Array.isArray(files) && files.length > 1) {
      throw new Error("Only one file can be uploaded at a time");
    }

    const singleFile: UploadedFile = Array.isArray(files) ? files[0] : files;
    const s3Response = await uploadFileToS3(singleFile);

    return {
      Message: "File uploaded successfully",
      Bucket: s3Response.Bucket,
      Key: s3Response.Key,
      Location: s3Response.Location,
      ETag: s3Response.ETag
    };
  } catch (error: any) {
    console.error("Error handling uploadPassportImage:", error);
    throw new Error(error.message || "Failed to upload image");
  }
};


export const extractPassportData = async (uploadRes: S3UploadResponse ): Promise<ExtractData> => {
  try {
    const extractTextResponse: ExtractData = await extractTextFromImage(uploadRes);
    return extractTextResponse;

  } catch (error: any) {
    console.error("Error handling image extraction: ", error);
    throw new Error(error.message || "Failed to extract data");
  }
};

export const createPassportDetailsPG = async (uploadData : S3UploadResponse, extractData : ExtractData) : Promise<DbResponse> => {
  try{
    const dbResponse = await insertPassportAndExtraction(uploadData, extractData);
    return dbResponse;
  } catch(error: any) {
    console.error("Error handling database commit: ", error);
    throw new Error(error.message || "Failed to extract data");
  }
}
