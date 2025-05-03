const Author = require('../models/Author');
const User = require('../models/User');

const applyForAuthor = async (req, res) => {
    try {
        const { userId } = req.user;
        const { penName, bio } = req.body;

        if (!userId || !penName || !bio) {
            return res.status(400).json({ msg: "Pen name and bio are required." });
        }

        // Check if user exists and is not already an author
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        if (user.role === "author") {
            return res.status(400).json({ msg: "User is already an author." });
        }

        // Check if penName is already taken
        const existingAuthor = await Author.findOne({ penName });
        if (existingAuthor) {
            return res.status(400).json({ msg: "Pen name is already taken." });
        }

        // Create new author
        const newAuthor = new Author({
            user: userId,
            penName,
            bio,
            novels: []
        });

        // Save the author
        await newAuthor.save();

        // Update user role
        user.role = "author";
        await user.save();

        // Populate user info before sending response
        await newAuthor.populate('user', '-password');

        return res.status(200).json({ 
            msg: "You have become an author.", 
            author: newAuthor 
        });
    } catch (error) {
        console.error('Apply for author error:', error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

const getAuthors = async (req, res) => {
    try {
        const authors = await Author.find()
            .populate('user', '-password')
            .populate('novels', 'title description');
            
        return res.status(200).json(authors);
    } catch (error) {
        console.error('Get authors error:', error);
        return res.status(500).json({ msg: "Failed to fetch authors" });
    }
};

const getAuthorById = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
            .populate('user', '-password')
            .populate('novels', 'title description');

        if (!author) {
            return res.status(404).json({ msg: "Author not found" });
        }

        return res.status(200).json(author);
    } catch (error) {
        console.error('Get author by ID error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid author ID format' });
        }
        return res.status(500).json({ msg: "Failed to fetch author" });
    }
};

const getAuthorByUserId = async (req, res) => {
    try {
        const { userId } = req.user;
        const author = await Author.findOne({ user: userId })
            .populate('user', '-password')
            .populate('novels', 'title description');

        if (!author) {
            return res.status(404).json({ msg: "Author not found" });
        }

        return res.status(200).json(author);
    } catch (error) {
        console.error('Get author by user ID error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid user ID format' });
        }
        return res.status(500).json({ msg: "Failed to fetch author" });
    }
};

module.exports = {
    applyForAuthor,
    getAuthors,
    getAuthorById,
    getAuthorByUserId
};
