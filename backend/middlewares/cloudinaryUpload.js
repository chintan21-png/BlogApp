const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder = "blog-app/misc";

    // User profile images
    if (file.fieldname === "profileImage") {
      folder = "blog-app/users";
    }

    // Blog cover images
    if (file.fieldname === "coverImage") {
      folder = "blog-app/posts";
    }

    return {
      folder,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
