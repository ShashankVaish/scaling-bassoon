// import React from 'react';
import { Outlet } from 'react-router-dom'; // 1. Import Outlet
import Header from './components/Header'; // Assuming you have this

function App() {
  return (
    <div className="App">
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <Outlet /> {/* 2. Add this. Your pages will render here. */}
      </main>
    </div>
  );
}

export default App;