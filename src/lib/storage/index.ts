import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Load the AWS credentials from environment variables
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_ENDPOINT = process.env.R2_ENDPOINT;

// Configure the R2 S3 client
const r2Client = new S3Client({
  region: "auto", // R2 doesn't require a specific region
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Function to upload a buffer to your R2 bucket
export const uploadBufferToStorage = async ({
  buffer,
  bucketName,
  key,
}: {
  buffer: Buffer;
  bucketName: string;
  key: string;
}) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: buffer,
    };

    const command = new PutObjectCommand(params);
    const response = await r2Client.send(command);
    console.log("File uploaded successfully:", response);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
