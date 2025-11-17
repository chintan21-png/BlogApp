const Comment = require("../models/Comment");
const BlogPost = require("../models/BlogPost");

const addComment = async(req,res) => {
    try {
        const {postId} = req.params;
        const {content, parentComment} = req.body;

        const post = await BlogPost.findById(postId);
        if(!post) return res.status(404).json({message:"Post Not Found"});

        const comment = await Comment.create({
            post: postId,
            author: req.user._id,
            content,
            parentComment: parentComment || null,
        });
        await comment.populate("author", "name profileImageUrl");
        res.status(201).json(comment);
    }
    catch(err) {
        res.status(500).json({message: "Failed to add Comment", error: err.message});
    }
};

const getAllComments = async(req,res) => {
    try {
        const comments = await Comment.find()
        .populate("author", "name profileImageUrl")
        .populate("post", "title coverImageUrl")
        .sort({createdAt : 1})

        const commentMap = {};
        comments.forEach(comment => {
            comment = comment.toObject();
            comment.replies = [];
            commentMap[comment._id] = comment;
        });

        const nestedComments = [];
        comments.forEach(comment => {
            if(comment.parentComment) {
                const parent = commentMap[comment.parentComment];
                if(parent) {
                    parent.replies.push(commentMap[comment._id]);
                }
            }
                else {
                    nestedComments.push(commentMap[comment._id]);
                }
        });
        res.json(nestedComments);
    }
    catch(err) {
        res.status(500).json({message: "Failed to fetch all Comment", error: err.message});
    }
};

const getCommentsByPost = async (req,res) => {
    try {
         const { postId } = req.params;

        // Ensure post exists
        const post = await BlogPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post Not Found" });
        }

        const comments = await Comment.find({ post: postId })
            .populate("author", "name profileImageUrl")
            .sort({ createdAt: 1 });

        // Build nested structure
        const commentMap = {};
        comments.forEach(comment => {
            comment = comment.toObject();
            comment.replies = [];
            commentMap[comment._id] = comment;
        });

        const nestedComments = [];
        comments.forEach(comment => {
            if (comment.parentComment) {
                const parent = commentMap[comment.parentComment];
                if (parent) parent.replies.push(commentMap[comment._id]);
            } else {
                nestedComments.push(commentMap[comment._id]);
            }
        });

        res.json(nestedComments);
    }
    catch(err) {
        res.status(500).json({message: "Failed to fetch comments", error: err.message});
    }
};

const deleteComment = async (req,res) => {
    try{
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Authorization: user must be owner OR admin
        if (comment.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }

        // Delete the comment
        await Comment.findByIdAndDelete(commentId);

        // Delete all child replies recursively
        await Comment.deleteMany({ parentComment: commentId });

        res.json({ message: "Comment deleted successfully" });

    }
    catch(err) {
        res.status(500).json({message:"Failed to delete comment", error: err.message});
    }
};

module.exports = {
    addComment,
    getAllComments,
    getCommentsByPost,
    deleteComment
};