import React, { useState } from 'react';
import Dashboard from '../components/Dashboard';
import { useUser } from '../hooks/useUser';
import { axiosConfig } from '../util/axiosConfig';
import { API_ENDPOINTS } from '../util/apiEndpoints';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import Input from '../components/Input';

function Filter() {
  useUser();

  const [filters, setFilters] = useState({
    type: 'income',
    startDate: '',
    endDate: '',
    keyword: '',
    sortField: 'date',
    sortOrder: 'desc',
  });

  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axiosConfig.post(API_ENDPOINTS.FILTER_TRANSACTIONS, filters);
      if (response.status === 200) {
        // Manually assign type to each transaction
        const typedResults = response.data.map(tx => ({
          ...tx,
          type: filters.type,
        }));
        setResults(typedResults);
      }
    } catch (error) {
      toast.error('Failed to fetch filtered transactions');
    }
  };

  return (
    <Dashboard activeMenu="Filters">
      <div className="p-6 bg-white rounded shadow min-h-screen">
        <h1 className="text-3xl font-semibold text-purple-700 mb-6">Filter Transactions 🔍</h1>

        {/* Filter Form */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <div className="w-full max-w-sm">
            <Input
              label="Type"
              isSelect
              name="type"
              value={filters.type}
              onChange={handleChange}
              options={[
                { label: 'Income', value: 'income' },
                { label: 'Expense', value: 'expense' },
              ]}
            />
          </div>
          <div className="w-full max-w-sm">
            <Input
              label="Keyword"
              type="text"
              name="keyword"
              placeholder="Search by name"
              value={filters.keyword}
              onChange={handleChange}
            />
          </div>
          <div className="w-full max-w-sm">
            <Input
              label="Start Date"
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
            />
          </div>
          <div className="w-full max-w-sm">
            <Input
              label="End Date"
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleChange}
            />
          </div>
          <div className="w-full max-w-sm">
            <Input
              label="Sort Field"
              isSelect
              name="sortField"
              value={filters.sortField}
              onChange={handleChange}
              options={[
                { label: 'Date', value: 'date' },
                { label: 'Amount', value: 'amount' },
                { label: 'Name', value: 'name' },
              ]}
            />
          </div>
          <div className="w-full max-w-sm">
            <Input
              label="Sort Order"
              isSelect
              name="sortOrder"
              value={filters.sortOrder}
              onChange={handleChange}
              options={[
                { label: 'Descending', value: 'desc' },
                { label: 'Ascending', value: 'asc' },
              ]}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Apply Filter
        </button>

        {/* Results as Cards */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">Filtered Results</h2>
          {results.length === 0 ? (
            <p className="text-sm text-gray-500">No transactions found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((tx) => (
                <div
                  key={tx.id}
                  className={`p-4 rounded shadow border ${
                    tx.type === 'income'
                      ? 'bg-green-100 border-green-300'
                      : 'bg-red-100 border-red-300'
                  }`}
                >
                  <div className="mb-2">
                    <p className="text-lg font-semibold text-gray-800">{tx.name}</p>
                    <p className="text-sm text-gray-500">
                      {moment(tx.date).format('Do MMM YYYY')}
                    </p>
                  </div>
                  <div className="text-right text-xl font-bold">
                    <span className={tx.type === 'income' ? 'text-green-700' : 'text-red-700'}>
                      ${tx.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
}

export default Filter;
