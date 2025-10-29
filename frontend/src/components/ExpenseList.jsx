import { Download, Mail } from "lucide-react";
import React from "react";
import TransactionInfoCard from "./TransactionInfoCard";
import moment from "moment";

function ExpenseList({ transactions, onDelete }) {
  return (
    <div className="card bg-white px-6 py-6 rounded">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expense Records</h5>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Display the expenses */}
        {transactions?.map((expense) => (
          <TransactionInfoCard
            key={expense.id}
            title={expense.name}
            icon={expense.icon}
            date={moment(expense.date).format("Do MMM YYYY")}
            amount={expense.amount}
            type="expense"
            onDelete={() => onDelete(expense.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default ExpenseList;
