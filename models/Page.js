const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Page title is required'],
        trim: true
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Page content is required']
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    seo: {
        metaTitle: { type: String, trim: true },
        metaDescription: { type: String, trim: true }
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Page', pageSchema);