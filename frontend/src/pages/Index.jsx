import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menubar from "../components/Menubar";
import { AppContext } from "../context/AppContext";

function Index() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    } else {
      setCheckingAuth(false);
    }
  }, [user, navigate]);

  if (checkingAuth) return null; // Prevent rendering during redirect

  return (
    <div className="min-h-screen bg-gray-50">
      <Menubar activeMenu="Home" />

      {/* Hero Section */}
      <section className="bg-purple-50 py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-purple-700 mb-4">
            Take Control of Your Finances 💸
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Money Manager helps you track income, expenses, and savings—all in one place.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="cursor-pointer bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="cursor-pointer bg-white border border-purple-600 text-purple-600 px-6 py-2 rounded hover:bg-purple-100 transition"
            >
              Register
            </button>
          </div>
        </div>
      </section>

      {/* App Info Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Why Money Manager?</h2>
          <p className="text-gray-600 mb-10">
            Whether you're budgeting for groceries or planning your next vacation, Money Manager gives you the tools to stay financially confident.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-gray-50 rounded shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Track Transactions</h3>
              <p className="text-gray-600">
                Log income and expenses with ease. Filter by date, category, or keyword.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Smart Filters</h3>
              <p className="text-gray-600">
                Quickly find what you need with powerful filtering options for your financial records.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your data is encrypted and stored securely. Only you control your financial records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-white text-gray-800 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to master your money?</h2>
        <button
          onClick={() => navigate("/signup")}
          className="cursor-pointer bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
        >
          Get Started
        </button>
      </section>
    </div>
  );
}

export default Index;
