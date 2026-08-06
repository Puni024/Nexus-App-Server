import cloudinary from "../../config/cloudinary";
import streamifier from "streamifier";
import path from "path";

export const uploadFile = (
  file: Express.Multer.File
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const fileName = path.parse(file.originalname).name;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "newsletters",
        resource_type: "raw",

        // Use the original filename (without extension) as public_id
        public_id: fileName,

        // Keep the extension
        use_filename: true,
        unique_filename: true,

        // Preserve original filename for downloads
        filename_override: file.originalname,
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