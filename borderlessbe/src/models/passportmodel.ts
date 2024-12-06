export interface PassportUpload {
    ETag: string;
    DateTimeUploaded: string;
    Location: string;
}

export interface UploadResponse {
    message: string;
    s3Response: {
        Bucket: string;
        Key: string;
    };
}

export interface ExtractData {
    dates: string[];
    otherFields: Record<string, any>;
}

export interface UploadedFile {
    filepath: string;
    originalFilename: string;
    mimetype: string;
    size: number;
    file: File[]
}

export interface File {
    filepath: string;
    originalFilename: string;
    mimetype: string;
}
export interface TextractResponse {
    Blocks: Array<{ Text?: string;[key: string]: any }>;
}

export interface S3UploadResponse {
    Message?: string
    Bucket: string;
    Key: string;
    Location: string;
    ETag: string;
}

export interface DbResponse {
    id: number,
    message: string
}

