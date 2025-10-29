import React, { useEffect, useState } from "react";
import Input from "../components/Input";
import EmojiPickerPopUp from "./EmojiPickerPopUp";
import { LoaderCircle } from "lucide-react";

function AddCategoryForm({ onAddCategory, isEditing, initialCategoryData }) {
  const [category, setCategory] = useState({
    name: "",
    type: "income",
    icon: "",
  });

  useEffect(()=>{
    if(isEditing && initialCategoryData){
      setCategory(initialCategoryData)
    }else{
      setCategory({name:"", type:"income", icon:""})
    }
  },[isEditing, initialCategoryData])

  const [loading, setLoading] = useState();

  const categoryTypeOptions = [
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
  ];

  const handleChange = (key, value) => {
    setCategory({ ...category, [key]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onAddCategory(category);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <EmojiPickerPopUp
        icon={category.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />
      <Input
        value={category.name}
        onChange={({ target }) => handleChange("name", target.value)}
        placeholder="e.g., Freelance, Salary, Bonus, Groceries"
        type="text"
        label="Category Name"
      />
      <Input
        value={category.type}
        onChange={({ target }) => handleChange("type", target.value)}
        isSelect={true}
        label="Category Type"
        options={categoryTypeOptions}
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center cursor-pointer px-6 py-2 rounded-md text-white font-semibold bg-purple-600 hover:bg-purple-700 transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <LoaderCircle className="w-4 h-4 animate-spin" />
              <span>{isEditing ? "Updating..." : "Adding..."}</span>
            </span>
          ) : (
            <>{isEditing ? "Update Category" : "Add Category"}</>
          )}
        </button>
      </div>
    </div>
  );
}

export default AddCategoryForm;
