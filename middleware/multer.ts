import "multer";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

export const uploadFile = (
  file: Express.Multer.File
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "newsletters",
        resource_type: "raw",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};