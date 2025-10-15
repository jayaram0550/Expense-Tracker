const Expense = require('../models/Expense');

// @desc    Get all expenses for a user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single expense by ID
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (expense && expense.user.toString() === req.user._id.toString()) {
            res.json(expense);
        } else {
            res.status(404).json({ message: 'Expense not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Add a new expense
// @route   POST /api/expenses
// @access  Private
const addExpense = async (req, res) => {
    const { description, amount, category, date } = req.body;

    try {
        const newExpense = new Expense({
            user: req.user._id,
            description,
            amount,
            category,
            date: date || Date.now() // Use provided date or default
        });
        const createdExpense = await newExpense.save();
        res.status(201).json(createdExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
    const { description, amount, category, date } = req.body;

    try {
        const expense = await Expense.findById(req.params.id);

        if (expense && expense.user.toString() === req.user._id.toString()) {
            expense.description = description || expense.description;
            expense.amount = amount || expense.amount;
            expense.category = category || expense.category;
            expense.date = date || expense.date;

            const updatedExpense = await expense.save();
            res.json(updatedExpense);
        } else {
            res.status(404).json({ message: 'Expense not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (expense && expense.user.toString() === req.user._id.toString()) {
            await Expense.deleteOne({ _id: req.params.id }); // Use deleteOne
            res.json({ message: 'Expense removed' });
        } else {
            res.status(404).json({ message: 'Expense not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getExpenses, getExpenseById, addExpense, updateExpense, deleteExpense };