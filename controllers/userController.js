const User = require('../models/User');
const Novel = require('../models/Novel');

const getAllUsers = async (req, res) => {
    try {
        // Only fetch necessary fields, exclude password
        const users = await User.find({}, '-password')
            .populate('posts', 'title content')
            .populate('reviews', 'reviewTitle reviewContent')
            .populate('likedNovels', 'title');
            
        return res.status(200).json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        return res.status(500).json({ message: 'Failed to fetch users' });
    }
};

const getUserByName = async (req, res) => {
    try {
        // Case-insensitive name search
        const users = await User.find(
            { name: { $regex: new RegExp(req.params.name, 'i') } },
            '-password'
        )
        .populate('posts', 'title content')
        .populate('reviews', 'reviewTitle reviewContent')
        .populate('likedNovels', 'title');

        if (users.length > 0) {
            return res.status(200).json(users);
        } else {
            return res.status(404).json({ message: "No users found" });
        }
    } catch (error) {
        console.error('Get user by name error:', error);
        return res.status(500).json({ message: 'Failed to fetch user' });
    }
};

const getUserById = async (req, res) => {
    try {
        const { userId } = req.user;
        const user = await User.findById(userId, '-password')
            .populate('posts', 'title content')
            .populate('reviews', 'reviewTitle reviewContent')
            .populate('likedNovels', 'title');

        if (user) {
            return res.status(200).json(user);
        }
        
        return res.status(404).json({ message: "User not found" });
    } catch (error) {
        console.error('Get user by ID error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        return res.status(500).json({ message: 'Failed to fetch user' });
    }
};

const getLikedNovels = async (req, res) => {
    try {
        const { userId } = req.user;
        const user = await User.findById(userId, 'likedNovels');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const likedNovelIds = user.likedNovels;
        const likedNovels = await Novel.find({ _id: { $in: likedNovelIds } })
            .populate('author', '-user.password')
            .populate('chapters', 'chapterNumber chapterName')
            .populate({
                path: 'reviews',
                select: 'reviewTitle reviewContent likes',
                populate: {
                    path: 'user',
                    select: '-password'
                }
            });

        return res.status(200).json(likedNovels);
    } catch (error) {
        console.error('Get liked novels error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        return res.status(500).json({ message: 'Failed to fetch novels' });
    }
};

module.exports = {
    getAllUsers,
    getUserByName,
    getUserById,
    getLikedNovels
};
