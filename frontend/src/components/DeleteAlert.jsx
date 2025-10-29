import React, { useState } from "react";
import { LoaderCircle } from "lucide-react";


function DeleteAlert({ content, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="text-sm">{content}</p>
      <div className="flex justify-end mt-6">
        <button
          disabled={loading}
          onClick={handleDelete}
          className="cursor-pointer flex items-center bg-purple-600 hover:bg-purple-700 text-white p-2 rounded transition-colors duration-200"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <LoaderCircle className="w-4 h-4 animate-spin" /> Deleting...
            </span>
          ) : (
            <>Delete</>
          )}
        </button>
      </div>
    </div>
  );
}

export default DeleteAlert;
