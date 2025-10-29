import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import { useUser } from '../hooks/useUser';
import { axiosConfig } from '../util/axiosConfig';
import { API_ENDPOINTS } from '../util/apiEndpoints';
import { toast } from 'react-hot-toast';
import moment from 'moment';

function Home() {
  useUser();
  const navigate = useNavigate();

  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [netSavings, setNetSavings] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const res = await axiosConfig.get(API_ENDPOINTS.GET_DASHBOARD_DATA);
      if (res.status === 200) {
        const data = res.data;
        setIncomeTotal(data.totalIncome || 0);
        setExpenseTotal(data.totalExpense || 0);
        setNetSavings(data.totalBalance || 0);
        setRecentTransactions(data.recentTransactions || []);
      }
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <Dashboard activeMenu="Dashboard">
      <div className="p-6 min-h-screen">
        {/* Welcome Header */}
        <div className="mb-6 bg-white rounded p-5">
          <h1 className="text-3xl font-semibold text-purple-700">Welcome to Money Manager 💰</h1>
          <p className="text-sm text-gray-500 mt-1">Track your finances with clarity and control.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-green-50 p-5 rounded shadow">
            <h3 className="text-sm text-green-700">Total Income</h3>
            <p className="text-2xl font-bold text-green-800">${incomeTotal.toLocaleString()}</p>
          </div>
          <div className="bg-red-50 p-5 rounded shadow">
            <h3 className="text-sm text-red-700">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-800">${expenseTotal.toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 p-5 rounded shadow">
            <h3 className="text-sm text-purple-700">Net Savings</h3>
            <p className={`text-2xl font-bold ${netSavings >= 0 ? 'text-purple-800' : 'text-red-600'}`}>
              ${netSavings.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-800">Recent Transactions</h2>
          <ul className="divide-y divide-gray-200">
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-gray-500">No recent transactions found.</p>
            ) : (
              recentTransactions.map(tx => (
                <li key={tx.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="text-gray-800 font-medium">{tx.name}</p>
                    <p className="text-sm text-gray-500">{moment(tx.date).format('Do MMM YYYY')}</p>
                  </div>
                  <div className={`text-right font-semibold ${tx.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
                    ${tx.amount.toLocaleString()}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-purple-800">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/income')}
              className="cursor-pointer bg-green-100 text-green-800 hover:bg-green-200 px-4 py-2 rounded transition"
            >
              + Add Income
            </button>
            <button
              onClick={() => navigate('/expense')}
              className="cursor-pointer bg-red-100 text-red-800 hover:bg-red-200 px-4 py-2 rounded transition"
            >
              + Add Expense
            </button>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default Home;
