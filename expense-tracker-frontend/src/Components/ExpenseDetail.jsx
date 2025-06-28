import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle } from 'lucide-react';
import { showToast } from '../store/toastSlice';
import { useDispatch } from 'react-redux';

function ExpenseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [expense, setExpense] = useState(null);
  const [formData, setFormData] = useState({ title: '', amount: '', category: '', date: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExpense();
  }, [id]);

  const fetchExpense = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/expenses/${id}/`, { withCredentials: true });
      setExpense(response.data);
      setFormData({
        title: response.data.title,
        amount: response.data.amount,
        category: response.data.category,
        date: response.data.date,
        notes: response.data.notes || '',
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch expense');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/expenses/${id}/`, formData, { withCredentials: true });
      dispatch(showToast({ message: 'Expense updated.', type: 'success' }));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`/api/expenses/${id}/`, { withCredentials: true });
        dispatch(showToast({ message: 'Expense deleted successfully.', type: 'success' }));
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to delete expense');
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!expense) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Expense</h1>
        {error && (
          <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
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
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
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
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            ></textarea>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl"
            >
              {loading ? 'Updating...' : 'Update Expense'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpenseDetail;