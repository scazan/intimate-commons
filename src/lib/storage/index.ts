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
      response.Contents?.filter((file) => file.Key?.endsWith(".wav"))?.map(
        (file) => ({
          key: file.Key,
          lastModified: file.LastModified,
          size: file.Size,
          url: `https://pub-58753b13db894b5ea3d9730f9a15a537.r2.dev/${file.Key}`,
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

  // Sort by lastModified date (most recent first) and take only the last 10
  const recentAudioFiles = audioFiles
    .sort(
      (a, b) =>
        new Date(b.lastModified!).getTime() -
        new Date(a.lastModified!).getTime(),
    )
    .slice(0, 10);

  const playlist = {
    name: "Intimate Commons Audio Stories",
    description: "Generated playlist of the 10 most recent audio stories",
    created: new Date().toISOString(),
    tracks: recentAudioFiles.map((file, index) => ({
      id: index + 1,
      title: `Story ${file.key?.replace(".wav", "")}`,
      url: file.url,
      duration: null, // Could be determined if needed
      lastModified: file.lastModified,
    })),
  };

  return playlist;
};
