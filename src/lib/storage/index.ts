import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

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
      // ContentType: 'audio/mpeg',
    };

    const command = new PutObjectCommand(params);
    const response = await r2Client.send(command);
    console.log("File uploaded successfully:", response);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

// Function to list all audio files from the bucket
export const listAudioFiles = async (bucketName: string) => {
  try {
    const params = {
      Bucket: bucketName,
      Prefix: "", // List all files
    };

    const command = new ListObjectsV2Command(params);
    const response = await r2Client.send(command);

    // Filter for .mp3 files and return file info
    const audioFiles =
      response.Contents?.filter((file) => file.Key?.endsWith(".mp3")).map(
        (file) => ({
          key: file.Key,
          lastModified: file.LastModified,
          size: file.Size,
          url: `https://pub-bd8c59c93bf74d13825de7e81e4cc08d.r2.dev/${file.Key}`, // Update with your R2 public URL
        }),
      ) || [];

    return audioFiles;
  } catch (error) {
    console.error("Error listing files:", error);
    return [];
  }
};

// Function to generate playlist from audio files
export const generatePlaylist = async (bucketName: string) => {
  const audioFiles = await listAudioFiles(bucketName);

  const playlist = {
    name: "Intimate Commons Audio Stories",
    description: "Generated playlist of all audio stories",
    created: new Date().toISOString(),
    tracks: audioFiles.map((file, index) => ({
      id: index + 1,
      title: `Story ${file.key?.replace(".mp3", "")}`,
      url: file.url,
      duration: null, // Could be determined if needed
      lastModified: file.lastModified,
    })),
  };

  return playlist;
};
