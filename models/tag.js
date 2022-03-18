const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
    name: { type: Array},
});

const Tag = mongoose.model("Tag", tagSchema);
exports.Tag = Tag;