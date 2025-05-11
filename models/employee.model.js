const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    empID:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    
    salary:{
        type: Number,
        required: true
    },
    hireDate:{
        type: Date,
        required: true
    },
    performanceScore:[
        {
            year: {
                type: Number,
                required: true
            },
            score: {
                type: Number,
                required: true
            }
        }
    ],
    isDeleted: {
        type: Boolean,
        default: false
    }
    }, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Employee', employeeSchema);