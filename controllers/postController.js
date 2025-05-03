const Post = require("../models/Post");
const User = require("../models/User");

// Create a new post
const addPosts = async (req, res) => {
    try {
        const { userId } = req.user;
        const { title, content } = req.body;

        if (!title || !content) {
            return res
                .status(400)
                .json({ msg: "Title and content are required" });
        }

        if (!req.file) {
            return res.status(400).json({ msg: "Image file is required" });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const post = new Post({
            title,
            content,
            image: {
                url: req.file.path,
                publicId: req.file.filename
            },
            user: userId,
            likes: [],
            comments: [],
        });

        // Save the post
        await post.save();

        // Add post reference to user's posts array
        if (!user.posts) user.posts = [];
        user.posts.push(post._id);
        await user.save();

        // Populate user info before sending response
        await post.populate("user", "-password");

        return res.status(201).json(post);
    } catch (error) {
        console.error("Add post error:", error);
        if (error.message.includes('image')) {
            return res.status(400).json({ msg: "Invalid image format or size" });
        }
        return res.status(500).json({ msg: "Failed to create post" });
    }
};

// Get all posts with populated user and comment data
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "-password")
            .populate("comments.user", "-password")
            .sort({ createdAt: -1 });

        return res.status(200).json(posts);
    } catch (error) {
        console.error("Get all posts error:", error);
        return res.status(500).json({ msg: "Failed to fetch posts" });
    }
};

// Add a comment to a post
const addCommentToPost = async (req, res) => {
    try {
        const { userId } = req.user;
        const { content } = req.body;
        const { postId } = req.params;

        if (!content) {
            return res.status(400).json({ msg: "Content is required" });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        // Add comment to post
        post.comments.push({
            content,
            user: userId,
            likes: [],
        });

        await post.save();

        // Populate user info in comments
        await post.populate("comments.user", "-password");

        return res.status(200).json(post);
    } catch (error) {
        console.error("Add comment error:", error);
        if (error.kind === "ObjectId") {
            return res.status(400).json({ msg: "Invalid ID format" });
        }
        return res.status(500).json({ msg: "Failed to add comment" });
    }
};

// Get a specific post by ID
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("user", "-password")
            .populate("comments.user", "-password");

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        return res.status(200).json(post);
    } catch (error) {
        console.error("Get post by ID error:", error);
        if (error.kind === "ObjectId") {
            return res.status(400).json({ msg: "Invalid post ID format" });
        }
        return res.status(500).json({ msg: "Failed to fetch post" });
    }
};

// Get all posts by a specific user
const getPostsByUserId = async (req, res) => {
    try {
        const { userId } = req.user;
        const posts = await Post.find({ user: userId })
            .populate("user", "-password")
            .populate("comments.user", "-password")
            .sort({ createdAt: -1 });

        return res.status(200).json(posts);
    } catch (error) {
        console.error("Get posts by user ID error:", error);
        if (error.kind === "ObjectId") {
            return res.status(400).json({ msg: "Invalid user ID format" });
        }
        return res.status(500).json({ msg: "Failed to fetch posts" });
    }
};

const togglePostLike = async (req, res) => {
    try {
        const { userId } = req.user;
        const { postId } = req.params;
        if (!userId) {
            return res.status(400).json({ msg: "userId is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        // Toggle like
        const likeIndex = post.likes.indexOf(userId);
        if (likeIndex === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(likeIndex, 1);
        }
        await post.save();

        return res.status(200).json(post);
    } catch (error) {
        console.error("Toggle post like error:", error);
        if (error.kind === "ObjectId") {
            return res.status(400).json({ msg: "Invalid ID format" });
        }
        return res.status(500).json({ msg: "Failed to toggle post like" });
    }
};

// Like/Unlike a comment
const toggleCommentLike = async (req, res) => {
    try {
        const { userId } = req.body;
        const { postId, commentId } = req.params;

        // Validate inputs
        if (!userId) {
            return res.status(400).json({ msg: "userId is required" });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Find the post and comment
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ msg: "Comment not found" });
        }

        // Toggle like in comment
        const userLikeIndex = comment.likes.indexOf(userId);
        if (userLikeIndex === -1) {
            comment.likes.push(userId);
        } else {
            comment.likes.splice(userLikeIndex, 1);
        }

        await post.save();

        return res.status(200).json(post);
    } catch (error) {
        console.error("Toggle comment like error:", error);
        if (error.kind === "ObjectId") {
            return res.status(400).json({ msg: "Invalid ID format" });
        }
        return res.status(500).json({ msg: "Failed to toggle comment like" });
    }
};

module.exports = {
    addPosts,
    getAllPosts,
    addCommentToPost,
    getPostById,
    getPostsByUserId,
    togglePostLike,
    toggleCommentLike,
};
