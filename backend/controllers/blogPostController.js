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
    try {
        const post = await BlogPost.findById(req.params.id);
        if(!post) return res.status(404).json({message: "Post not Found"});

        if (post.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({message: "Not Authorized to update this post"})
        }
        const updatedData = req.body;
        if(updatedData.title) {
            updatedData.slug = updatedData.title
            .toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
        }

        const updatedPost = await BlogPost.findByIdAndUpdate(
            req.params.id,
            updatedData,
            {new: true}
        );
        res.json(updatedPost);
    }
    catch(err) {
        res.status(500).json({message:"Server Error", error: err.message});
    }

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