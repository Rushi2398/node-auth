const express = require("express");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const {
  uploadImage,
  fetchImage,
  deleteImage,
} = require("../controllers/image-controller");
const authMiddleware = require("../middleware/auth-middleware");

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  uploadImage
);

router.get("/get", authMiddleware, fetchImage);

router.delete("/:id", authMiddleware, adminMiddleware, deleteImage);
module.exports = router;
