import React from 'react';
import { GrGithub } from "react-icons/gr";

const Header = ({ setShowBookings }) => {
  return (
    // <header className="bg-green-500 text-white py-4 shadow-md">
    //   <div className="max-w-4xl mx-auto flex justify-between items-center px-4">
    //     <h1 className="text-2xl font-bold">Sportomic - Book Your Game</h1>
    //     <button
    //       className="text-sm underline"
    //       onClick={() => setShowBookings(true)}
    //     >
    //       View My Bookings
    //     </button>
    //   </div>
    // </header>
    <div className='sticky top-0 left-0 w-full z-50'>
      <div className='header bg-green-500 min-h-24 flex items-center justify-between px-4 py-2'>
        <div>
          <h1 className="text-4xl font-bold text-white text-center py-4 px-2">
            Sportomic
          </h1>
        </div>
        <div className='flex items-center justify-center gap-4'>
          <div>
            <button
              className="text-white text-md p-4 bg-green-600 rounded-md hover:bg-green-700 transition duration-300"
              onClick={() => setShowBookings(true)}
            >
              View My Bookings
            </button>
          </div>
          <div>
            <GrGithub 
              onClick={() => window.open("https://github.com/ParamPS25/sportomic-assignment", "_blank")}
              className = "cursor-pointer text-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
