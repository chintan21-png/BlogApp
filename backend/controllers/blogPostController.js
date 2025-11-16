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
    try{
        const post = await BlogPost.findById(req.params.id);
        if(!post) return res.status(404).json({message:"Page Not Found"});

        await post.deleteOne();
        res.json({message:"Post Deleted"});
    }
    catch(err) {
        res.status(500).json({message:"Server Error", error:err.message});
    }

};

const getAllPosts = async (req,res) => {
    try{
        const status = req.query.status || "published";
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page-1)* limit;

        //Determine filter for main posts response
        let filter = {};
        if(status === "published") filter.isDraft = false;
        else if (status === "draft") filter.isDraft = true;

        //Fetch paginated posts
        const posts = await BlogPost.find(filter)
        .populate("author", "name profileImageUrl")
        .sort({ updatedAt : -1})
        .skip(skip)
        .limit(limit);

        //count totals for pagination and tab counts

        const [totalCount, allCount, publishedCount, draftCount] = await Promise.all([
            BlogPost.countDocuments(filter),
            BlogPost.countDocuments(),
            BlogPost.countDocuments({isDraft: false}),
            BlogPost.countDocuments({isDraft: true}),
        ]);
        res.json({
            posts,
            page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            counts: {
                all : allCount,
                published: publishedCount,
                draft: draftCount,
            },
        })
    }
    catch(err) {
        res.status(500).json({message:"Server Error", error: err.message});
    }

};

const getPostBySlug = async (req,res) => {
    try {
        const post = await BlogPost.findOne({slug: req.params.slug}).populate(
            "author",
            "name profileImageUrl"
        );
        if(!post) return res.status(404).json({message:"Post Not Found"});
        res.json(post);
    }
    catch(err) {
        res.status(500).json({message:"Server Error", error: err.message});
    }
};

const getPostByTag = async (req,res) => {
    try{
        const posts = await BlogPost.find({
            tags: req.params.tag,
            isDraft: false,
        }).populate("author", "name profileImageUrl");
        res.json(posts)
    }
    catch (err) {
        res.status(500).json({message: "Server Error", error: err.message});
    }

};

const searchPosts = async (req,res) => {
    try {
        const q = req.query.q;
        const posts = await BlogPost.find({
            isDraft: false,
            $or : [
                {title:{ $regex:q, $options: "i"}},
                {content: {$regex:q, $options: "i"}},
            ],
        }).populate("author", "name profileImageUrl");
        res.json(posts);
    }
    catch(err) {
        res.status(500).json({message:"Server error", error: err.message});
    }
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