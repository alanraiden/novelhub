const Chapter = require('../models/Chapter');
const Novel = require('../models/Novel');

const uploadChapter = async (req, res) => {
    try {
        const { novelId } = req.params;
        const { chapterName, chapterContent } = req.body;

        if (!novelId || !chapterName || !chapterContent) {
            return res.status(400).json({ msg: "Chapter Content required." });
        }

        const novel = await Novel.findById(novelId);
        if (!novel) {
            return res.status(404).json({ msg: "Novel not found" });
        }

        const chapterNumber = novel.chapters.length + 1;

        const newChapter = new Chapter({
            novel: novelId,
            chapterNumber,
            chapterName,
            chapterContent
        });
        await newChapter.save();

        novel.chapters.push(newChapter._id);
        await novel.save();

        return res.status(201).json({ msg: "Chapter uploaded" });
    } catch (error) {
        console.error('Upload chapter error:', error);
        return res.status(500).json({ msg: "Failed to upload chapter" });
    }
};

const getChapterById = async (req, res) => {
    try {
        const { novelId, chapterId } = req.params;

        const chapter = await Chapter.findOne({ _id: chapterId, novel: novelId });

        if (!chapter) {
            return res.status(404).json({ msg: "Chapter not found" });
        }

        return res.status(200).json(chapter);
    } catch (error) {
        console.error('Get chapter by ID error:', error);
        return res.status(500).json({ msg: "Failed to fetch chapter" });
    }
};

const getChaptersByNovelId = async (req, res) => {
    try {
        const { novelId } = req.params;

        const chapters = await Chapter.find({ novel: novelId }).sort('chapterNumber');

        if (chapters.length === 0) {
            return res.status(200).json({ msg: "No chapters found for this novel." });
        }

        return res.status(200).json(chapters);
    } catch (error) {
        console.error('Get chapters by novel ID error:', error);
        return res.status(500).json({ msg: "Failed to fetch chapters" });
    }
};

module.exports = {
    uploadChapter,
    getChapterById,
    getChaptersByNovelId,
};