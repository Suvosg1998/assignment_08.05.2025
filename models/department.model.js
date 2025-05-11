const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    budget:{
        type: Number,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},{ timestamps: true, versionKey: false });

module.exports = mongoose.model('Department', departmentSchema);