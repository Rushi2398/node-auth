const uploadToCloudinary = require("../helpers/cloudinaryHelper");
const Image = require("../models/Image");
const cloudinary = require("../config/cloudinary");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required! Please upload an image!",
      });
    }
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    const newUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo._id,
    });

    await newUploadedImage.save();
    res.status(201).json({
      success: true,
      message: "Image Uploaded Successfully",
      image: newUploadedImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again!",
    });
  }
};

const fetchImage = async (req, res) => {
  try {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const images = await Image.find({}).sort(sortObj).skip(skip).limit(limit);
    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
        data: images,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again!",
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const getImageID = req.params.id;
    const userID = req.userInfo.userId;

    const image = await Image.findById(getImageID);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // check if image is uploaded by the current user who wants to delete the image
    if (image.uploadedBy.toString() != userID) {
      return res.status(403).json({
        success: false,
        message: "You are not authorised to delete this image!",
      });
    }

    // delete this image first from cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    await Image.findByIdAndDelete(getImageID);
    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again!",
    });
  }
};

module.exports = {
  uploadImage,
  fetchImage,
  deleteImage,
};
