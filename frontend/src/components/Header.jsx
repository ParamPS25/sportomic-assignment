import React from 'react';

const Header = ({ setShowBookings }) => {
  return (
    <header className="bg-green-500 text-white py-4 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">Sportomic - Book Your Game</h1>
        <button
          className="text-sm underline"
          onClick={() => setShowBookings(true)}
        >
          View My Bookings
        </button>
      </div>
    </header>
  );
};

export default Header;
