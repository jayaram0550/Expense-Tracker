const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Links expense to a user
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01 // Ensures positive amount
    },
    category: {
        type: String,
        required: true,
        enum: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Education', 'Salary', 'Other'] // Example categories
    },
    date: {
        type: Date,
        required: true,
        default: Date.now // Default to current date
    }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);