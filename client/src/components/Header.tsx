import React from 'react';

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
      <div className="logo-container">
        <span className="text-2xl font-bold text-gray-800" > highway delite</span>
      </div>
      <div className="search-container flex items-center">
        <input
          type="text"
          className="px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent min-w-[300px] mr-2"
          placeholder="Search experiences"
        />
        <button className="px-4 py-2 font-bold text-gray-800 bg-yellow-400 border border-yellow-600 rounded-md shadow-sm transition-colors hover:bg-yellow-500">
          Search
        </button>
      </div>
    </header>
  );
};

export default Header;