import { Download, Mail } from "lucide-react";
import React from "react";
import TransactionInfoCard from "./TransactionInfoCard";
import moment from 'moment';

function IncomeList({ transactions , onDelete }) {
  return (
    <div className="card bg-white px-6 py-6 rounded">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income Sources</h5>
       
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Display the income */}
            {transactions?.map((income)=>(
                <TransactionInfoCard
                 key={income.id} 
                 title={income.name}
                 icon={income.icon}
                 date={moment(income.date).format("Do MMM YYYY")}
                 amount={income.amount}
                 type="income"
                 onDelete={() => onDelete(income.id) }
                 />
            ))}
        </div>

    </div>
  );
}

export default IncomeList;
