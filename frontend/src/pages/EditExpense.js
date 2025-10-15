import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Education', 'Salary', 'Other'];

function EditExpense() {
    const { id } = useParams(); // Get expense ID from URL
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpense = async () => {
            if (!user || !user.token) {
                setLoading(false);
                return;
            }
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(`/api/expenses/${id}`, config);
                setDescription(data.description);
                setAmount(data.amount);
                setCategory(data.category);
                // Format date for input type="date" (YYYY-MM-DD)
                setDate(new Date(data.date).toISOString().split('T')[0]);
            } catch (err) {
                const errorMessage = err.response && err.response.data && err.response.data.message
                                 ? err.response.data.message
                                 : err.message;
                setError(`Failed to fetch expense: ${errorMessage}`);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchExpense();
    }, [id, user]);

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
            await axios.put(`/api/expenses/${id}`, { description, amount: parseFloat(amount), category, date }, config);
            navigate('/dashboard'); // Redirect to dashboard after successful update
        } catch (err) {
            const errorMessage = err.response && err.response.data && err.response.data.message
                                 ? err.response.data.message
                                 : err.message;
            setError(`Failed to update expense: ${errorMessage}`);
            console.error(err);
        }
    };

    if (loading) {
        return <p>Loading expense details...</p>;
    }

    return (
        <div className="form-container">
            <h2>Edit Expense</h2>
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
                <button type="submit" className="btn btn-primary">Update Expense</button>
            </form>
        </div>
    );
}

export default EditExpense;