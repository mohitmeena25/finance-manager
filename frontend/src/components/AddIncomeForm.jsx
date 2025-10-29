import React, { useEffect, useState } from "react";
import EmojiPickerPopup from "./EmojiPickerPopUp";
import Input from "./Input";
import { LoaderCircle } from "lucide-react";

function AddIncomeForm({ onAddIncome, categories }) {
  const [income, setIncome] = useState({
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
    setIncome({ ...income, [key]: value });
  };

  const [loading, setLoading] = useState(false);

  const handleAddIncome = async () => {
    setLoading(true);
    try {
      await onAddIncome(income);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(categories.length > 0 && !income.categoryId){
        setIncome((prev) => ({...prev, categoryId: categories[0].id}))
    }
  }, [categories, income.categoryId])

  return (
    <div>
      <EmojiPickerPopup
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />
      <Input
        value={income.name}
        onChange={({ target }) => handleChange("name", target.value)}
        label="Income Source"
        placeholder="e.g., Salary, Freelance, Bonus"
        type="text"
      />
      <Input
        value={income.categoryId}
        onChange={({ target }) => handleChange("categoryId", target.value)}
        label="Category"
        options={categoryOptions}
        isSelect={true}
      />
      <Input
        value={income.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder="e.g., 500.00"
        type="number"
      />
      <Input
        value={income.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
      />
      <div className="flex justify-end mt-6">
        <button
          onClick={handleAddIncome}
          className="cursor-pointer flex items-center bg-green-200 hover:bg-green-300 text-green-800 p-2 rounded transition-colors duration-200"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <LoaderCircle className="w-4 h-4 animate-spin" /> Adding...
            </span>
          ) : (
            <>
            Add Income
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default AddIncomeForm;
