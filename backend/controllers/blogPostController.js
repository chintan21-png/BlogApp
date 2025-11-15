const BlogPost = require("../models/BlogPost");
const mongoose = require("mongoose");

const createPost = async (req,res) => {
    try {
        const {title, content, coverImageUrl, tags, isDraft, generatedByAI} = req.body;

        const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
        const newPost = new BlogPost({
            title,
            slug,
            content,
            coverImageUrl,
            tags,
            author: req.user._id,
            isDraft,
            generatedByAI,
        });

        await newPost.save();
        res.status(201).json(newPost);
    }
    catch(err) {
        res.status(500).json({message:"Filed to create post", error: err.message});
    }
};

const updatePost = async (req,res) => {

};

const deletePost = async (req,res) => {

};

const getAllPosts = async (req,res) => {

};

const getPostBySlug = async (req,res) => {

};

const getPostByTag = async (req,res) => {

};

const searchPosts = async (req,res) => {

};

const incrementView = async (req,res) => {

};

const likePost = async (req,res) => {

};

const getTopPosts = async (req,res) => {

};

module.exports = {
    createPost,
    updatePost,
    deletePost,
    getAllPosts,
    getPostBySlug,
    getPostByTag,
    searchPosts,
    incrementView,
    likePost,
    getTopPosts,
};