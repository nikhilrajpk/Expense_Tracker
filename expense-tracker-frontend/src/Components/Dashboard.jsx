import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchUser } from '../store/authSlice';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { AlertCircle, Edit, Trash2 } from 'lucide-react';
import { showToast } from '../store/toastSlice';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [filters, setFilters] = useState({ start_date: '', end_date: '', category: '' });
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'food', date: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchUser());
    fetchExpenses();
    fetchSummary();
  }, [dispatch]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await axios.get(`/api/expenses/?${params}`, { withCredentials: true });
      setExpenses(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await axios.get(`/api/summary/?${params}`, { withCredentials: true });
      setSummary(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch summary');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/expenses/', formData, { withCredentials: true });
      setFormData({ title: '', amount: '', category: 'food', date: '', notes: '' });
      fetchExpenses();
      fetchSummary();
      dispatch(showToast({ message: 'Expense created.', type: 'success' }));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`/api/expenses/${id}/`, { withCredentials: true });
        fetchExpenses();
        fetchSummary();
        dispatch(showToast({ message: 'Expense deleted successfully.', type: 'success' }));
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to delete expense');
      }
    }
  };

  const chartData = {
    labels: summary.map((item) => item.category),
    datasets: [
      {
        data: summary.map((item) => item.total_amount),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Expense Dashboard</h1>
        {user && <p className="text-gray-600 mb-4">Welcome, {user.username}</p>}
        {error && (
          <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="w-full p-3 border rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleFormChange}
                  className="w-full p-3 border rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="w-full p-3 border rounded-xl"
                >
                  <option value="food">Food</option>
                  <option value="travel">Travel</option>
                  <option value="utilities">Utilities</option>
                  <option value="misc">Miscellaneous</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  className="w-full p-3 border rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  className="w-full p-3 border rounded-xl"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl"
              >
                {loading ? 'Adding...' : 'Add Expense'}
              </button>
            </form>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
            <Pie data={chartData} />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Expenses</h2>
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={filters.start_date}
                onChange={handleFilterChange}
                className="w-full p-3 border rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="end_date"
                value={filters.end_date}
                onChange={handleFilterChange}
                className="w-full p-3 border rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-3 border rounded-xl"
              >
                <option value="">All</option>
                <option value="food">Food</option>
                <option value="travel">Travel</option>
                <option value="utilities">Utilities</option>
                <option value="misc">Miscellaneous</option>
              </select>
            </div>
          </div>
          <button
            onClick={fetchExpenses}
            className="mb-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-xl"
          >
            Apply Filters
          </button>
          {loading ? (
            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="p-3">Title</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Date</th>
                    {user.is_staff && <th className="p-3">Username</th>}
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-t">
                      <td className="p-3" onClick={() => navigate(`/expense/${expense.id}`)}>{expense.title}</td>
                      <td className="p-3">₹{expense.amount}</td>
                      <td className="p-3">{expense.category}</td>
                      <td className="p-3">{expense.date}</td>
                      {user.is_staff && <td className="p-3">{expense.username}</td>}
                      <td className="p-3">
                        <button
                          onClick={() => navigate(`/expense/${expense.id}`)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;