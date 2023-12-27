
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ description: '', amount: 0 });

  useEffect(() => {
    axios.get('http://localhost:5000/expenses')
      .then(response => setExpenses(response.data))
      .catch(error => console.error('Error fetching expenses:', error));
  }, []);

  const addExpense = () => {
    axios.post('http://localhost:5000/expenses', newExpense)
      .then(response => setExpenses([...expenses, response.data]))
      .catch(error => console.error('Error adding expense:', error));
  };

  const editExpense = (id, updatedExpense) => {
    axios.put(`http://localhost:5000/expenses/${id}`, updatedExpense)
      .then(response => setExpenses(expenses.map(expense => (expense.id === id ? response.data : expense))))
      .catch(error => console.error('Error editing expense:', error));
  };

  const deleteExpense = (id) => {
    axios.delete(`http://localhost:5000/expenses/${id}`)
      .then(() => setExpenses(expenses.filter(expense => expense.id !== id)))
      .catch(error => console.error('Error deleting expense:', error));
  };

  return (
    <div>
      <h1>Expense Tracker</h1>
      <div>
        <input type="text" placeholder="Description" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} />
        <input type="number" placeholder="Amount" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })} />
        <button onClick={addExpense}>Add Expense</button>
      </div>
      <ul>
        {expenses.map(expense => (
          <li key={expense.id}>
            {`${expense.description}: $${expense.amount}`}
            <button onClick={() => editExpense(expense.id, { description: 'Updated Expense', amount: 50 })}>Edit</button>
            <button onClick={() => deleteExpense(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
