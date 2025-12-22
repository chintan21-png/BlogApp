require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const BlogPost = require("../models/BlogPost");

const UPLOADS_DIR = path.join(__dirname, "../uploads");

async function migratePostImages() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("MongoDB connected");

  const posts = await BlogPost.find({
    coverImageUrl: { $regex: "/uploads/" },
  });

  console.log(`Found ${posts.length} blog posts to migrate`);

  for (const post of posts) {
    const fileName = post.coverImageUrl.split("/uploads/")[1];
    const localPath = path.join(UPLOADS_DIR, fileName);

    if (!fs.existsSync(localPath)) {
      console.log(`Missing file: ${fileName}`);
      continue;
    }

    const result = await cloudinary.uploader.upload(localPath, {
      folder: "blog-app/posts",
    });

    post.coverImageUrl = result.secure_url;
    await post.save();

    console.log(`Migrated post: ${post.title}`);
  }

  console.log("Blog post image migration completed");
  process.exit();
}

migratePostImages();
