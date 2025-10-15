import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Education', 'Salary', 'Other'];

function Dashboard() {
    const { user, logout } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    const fetchExpenses = useCallback(async () => {
        setLoading(true);
        setError('');
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
            const { data } = await axios.get('/api/expenses', config);
            let filteredData = data;
            if (filterCategory) {
                filteredData = data.filter(exp => exp.category === filterCategory);
            }
            setExpenses(filteredData);
        } catch (err) {
            const errorMessage = err.response && err.response.data && err.response.data.message
                                 ? err.response.data.message
                                 : err.message;
            setError(`Failed to fetch expenses: ${errorMessage}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user, filterCategory]); // Depend on user and filterCategory

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]); // Call fetchExpenses when it changes

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this expense?')) {
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.delete(`/api/expenses/${id}`, config);
            setExpenses(expenses.filter(exp => exp._id !== id)); // Remove deleted item from state
        } catch (err) {
            const errorMessage = err.response && err.response.data && err.response.data.message
                                 ? err.response.data.message
                                 : err.message;
            setError(`Failed to delete expense: ${errorMessage}`);
            console.error(err);
        }
    };

    const calculateTotal = () => {
        return expenses.reduce((acc, exp) => acc + exp.amount, 0).toFixed(2);
    };

    const getCategoryTotals = () => {
        const totals = {};
        expenses.forEach(exp => {
            totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
        });
        return totals;
    };

    if (!user) {
        return <p className="error-message">Please log in to view your dashboard.</p>;
    }

    if (loading) {
        return <p>Loading expenses...</p>;
    }

    return (
        <div className="dashboard-container">
            <h2>Welcome, {user.username}!</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '25px' }}>
                <Link to="/add" className="btn btn-primary">Add New Expense</Link>
                <button onClick={logout} className="btn btn-secondary">Logout</button>
            </div>


            {error && <p className="error-message">{error}</p>}

            <div className="summary-section">
                <h3>Expense Summary</h3>
                <p>Total Expenses: ₹{calculateTotal()}</p>
                <h4>Category Breakdown:</h4>
                <ul>
                    {Object.entries(getCategoryTotals()).map(([category, total]) => (
                        <li key={category}>
                            <span>{category}:</span>
                            <span>₹{total.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="filter-section">
                <label htmlFor="categoryFilter">Filter by Category:</label>
                <select
                    id="categoryFilter"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <h3>Your Expenses</h3>
            {expenses.length === 0 ? (
                <p>No expenses recorded yet. Add your first expense!</p>
            ) : (
                <ul className="expense-list">
                    {expenses.map((expense) => (
                        <li key={expense._id} className="expense-item">
                            <div className="expense-details">
                                <span>{expense.description}</span>
                                <span>₹{expense.amount.toFixed(2)}</span>
                                <span className="category-tag">{expense.category}</span>
                                <span className="date-tag">{new Date(expense.date).toLocaleDateString()}</span>
                            </div>
                            <div className="expense-actions">
                                <Link to={`/edit/${expense._id}`} className="btn btn-edit">Edit</Link>
                                <button onClick={() => handleDelete(expense._id)} className="btn btn-delete">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Dashboard;