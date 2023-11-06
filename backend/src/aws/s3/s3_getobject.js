import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';

dotenv.config({path: '../../../.env'});

const client = new S3Client({
  region: 'us-west-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export const getObject = async (fileName) => {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
  });

  try {
    const response = await client.send(command);
    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    const str = await response.Body.transformToString();
    console.log(str);
  } catch (err) {
    console.error(err);
  }
};
