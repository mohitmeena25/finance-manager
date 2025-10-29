import React, { useEffect, useState } from "react";
import EmojiPickerPopup from "./EmojiPickerPopUp";
import Input from "./Input";
import { LoaderCircle } from "lucide-react";

function AddExpenseForm({ onAddExpense, categories }) {
  const [expense, setExpense] = useState({
    name: "",
    amount: "",
    date: "",
    icon: "",
    categoryId: "",
  });

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const handleChange = (key, value) => {
    setExpense({ ...expense, [key]: value });
  };

  const [loading, setLoading] = useState(false);

  const handleAddExpense = async () => {
    setLoading(true);
    try {
      await onAddExpense(expense);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categories.length > 0 && !expense.categoryId) {
      setExpense((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories, expense.categoryId]);

  return (
    <div>
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />
      <Input
        value={expense.name}
        onChange={({ target }) => handleChange("name", target.value)}
        label="Expense Name"
        placeholder="e.g., Rent, Groceries, Utilities"
        type="text"
      />
      <Input
        value={expense.categoryId}
        onChange={({ target }) => handleChange("categoryId", target.value)}
        label="Category"
        options={categoryOptions}
        isSelect={true}
      />
      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder="e.g., 1200.00"
        type="number"
      />
      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        type="date"
      />
      <div className="flex justify-end mt-6">
        <button
          onClick={handleAddExpense}
          className="cursor-pointer flex items-center bg-red-200 hover:bg-red-300 text-red-800 p-2 rounded transition-colors duration-200"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <LoaderCircle className="w-4 h-4 animate-spin" /> Adding...
            </span>
          ) : (
            <>Add Expense</>
          )}
        </button>
      </div>
    </div>
  );
}

export default AddExpenseForm;
