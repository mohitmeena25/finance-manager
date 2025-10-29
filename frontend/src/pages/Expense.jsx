import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import { axiosConfig } from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { toast } from "react-hot-toast";
import ExpenseList from "../components/ExpenseList";
import Modal from "../components/Modal";
import { Plus } from "lucide-react";
import AddExpenseForm from "../components/AddExpenseForm";
import DeleteAlert from "../components/DeleteAlert";

function Expense() {
  const [expenseData, setExpenseData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);
      if (response.status === 200) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch expense details", error);
      toast.error(error?.response?.data?.message || "Failed to fetch expense details");
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenseCategories = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("expense"));
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
      toast.error(error?.response?.data?.message || "Failed to fetch expense categories");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
    fetchExpenseCategories();
  }, []);

  const handleAddExpense = async (expense) => {
    const { name, amount, date, icon, categoryId } = expense;

    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0");
      return;
    }
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (date > today) {
      toast.error("Date cannot be in the future");
      return;
    }

    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, {
        name,
        amount: Number(amount),
        date,
        icon,
        categoryId,
      });
      if (response.status === 201) {
        setOpenAddExpenseModal(false);
        toast.success("Expense added successfully");
        fetchExpenseDetails();
      }
    } catch (error) {
      console.error("Error adding expense", error);
      toast.error(error?.response?.data?.message || "Failed to add expense");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error deleting expense", error);
      toast.error(error?.response?.data?.message || "Failed to delete expense");
    }
  };

  useUser();

  return (
    <Dashboard activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <button
              onClick={() => setOpenAddExpenseModal(true)}
              className="cursor-pointer flex items-center bg-red-100 hover:bg-red-200 text-red-800 p-2 rounded transition-colors duration-200"
            >
              <Plus size={15} className="mr-2 text-lg" />
              Add Expense
            </button>
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
          />

          <Modal
            isOpen={openAddExpenseModal}
            onClose={() => setOpenAddExpenseModal(false)}
            title="Add Expense"
          >
            <AddExpenseForm
              categories={categories}
              onAddExpense={(expense) => handleAddExpense(expense)}
            />
          </Modal>

          <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
            title="Delete Expense"
          >
            <DeleteAlert
              content="Are you sure you want to delete this expense?"
              onDelete={() => deleteExpense(openDeleteAlert.data)}
            />
          </Modal>
        </div>
      </div>
    </Dashboard>
  );
}

export default Expense;
