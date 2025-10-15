import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Education', 'Salary', 'Other'];

function AddExpense() {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!description || !amount || !category || !date) {
            setError('Please fill in all fields.');
            return;
        }
        if (isNaN(amount) || parseFloat(amount) <= 0) {
            setError('Amount must be a positive number.');
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post('/api/expenses', { description, amount: parseFloat(amount), category, date }, config);
            navigate('/dashboard'); // Redirect to dashboard after successful add
        } catch (err) {
            const errorMessage = err.response && err.response.data && err.response.data.message
                                 ? err.response.data.message
                                 : err.message;
            setError(`Failed to add expense: ${errorMessage}`);
            console.error(err);
        }
    };

    return (
        <div className="form-container">
            <h2>Add New Expense</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}
                <div>
                    <label htmlFor="description">Description:</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="amount">Amount (₹):</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="0.01"
                        step="0.01"
                    />
                </div>
                <div>
                    <label htmlFor="category">Category:</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Expense</button>
            </form>
        </div>
    );
}

export default AddExpense;