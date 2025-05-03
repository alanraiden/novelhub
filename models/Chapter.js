const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  novel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Novel',
    required: true
  },
  chapterNumber: {
    type: Number,
    required: true
  },
  chapterName: {
    type: String,
    required: true,
    trim: true
  },
  chapterContent: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Ensure chapter numbers are unique within a novel
chapterSchema.index({ novel: 1, chapterNumber: 1 }, { unique: true });

const Chapter = mongoose.model('Chapter', chapterSchema);
module.exports = Chapter;
