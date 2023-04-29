import "dotenv/config";
import AWS from "aws-sdk";
import fs from "fs";

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

export const uploadToS3 = async (file, userId, folderName) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;
  const { Location } = await new AWS.S3()
    .upload({
      Bucket: "instaclone-upload--1",
      Key: objectName,
      ACL: "public-read",
      Body: fs.createReadStream(readStream._writeStream.path),
    })
    .promise();
  return Location;
};