import ImageKit from "imagekit";
import dotenv from "dotenv";
dotenv.config();

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// helper function
export const uploadImage = async (file) => {
  try {
    const uploaded = await imagekit.upload({
      file: file.buffer.toString("base64"),
      fileName: file.originalname,
      folder:"Eccomerce/user"
    });
    return uploaded;
  } catch (error) {
    throw new Error(error.message);
  }
};
