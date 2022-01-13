/*
AUTHOR: Devin Davis
DATE: Oct 2nd, 2021
FILE: basic_estimate_model.js
*/

const mongoose = require("mongoose");

const basicEstimateSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    pageCount: String,
    languages: Array,
    seo: Boolean,
    total: Number,
});

const BasicEstimate = mongoose.model("BasicEstimate", basicEstimateSchema);

module.exports = BasicEstimate;