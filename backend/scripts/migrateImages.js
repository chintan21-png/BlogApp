require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");

const UPLOADS_DIR = path.join(__dirname, "../uploads");

async function migrate() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("DB connected");

  const users = await User.find({
    profileImageUrl: { $regex: "/uploads/" },
  });

  for (const user of users) {
    const fileName = user.profileImageUrl.split("/uploads/")[1];
    const filePath = path.join(UPLOADS_DIR, fileName);

    if (!fs.existsSync(filePath)) continue;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "blog-app/profile",
    });

    user.profileImageUrl = result.secure_url;
    await user.save();

    console.log(`Migrated: ${user.email}`);
  }

  console.log("Migration done");
  process.exit();
}

migrate();
