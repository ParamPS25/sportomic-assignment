import { useEffect, useState } from 'react';
import axios from 'axios';
import { RxCross2 } from "react-icons/rx";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const BookingList = ({ userName, onClose}) => {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (userName) {
      axios.get(`${API_BASE}/api/bookings?userName=${userName}`)
        .then(res => setBookings(res.data.data || []));
    }
  }, [userName]);

  const formatUserName = (name) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };


  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-green-200 shadow-lg p-4 overflow-y-auto z-50 border-l border-gray-300">

      <div className='flex justify-center items-center'>
        <div className='flex items-center justify-center mt-5 px-2 w-[90%]'>
          <h2 className="text-xl font-bold mb-4 text-center">Your Bookings</h2>
        </div>
        <div className='flex items-center justify-end'>
          <RxCross2
            onClick={onClose}
            className="cursor-pointer text-2xl text-red-500"
          />
        </div>
      </div>


      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        bookings.map((b, idx) => (
          <div key={idx} className="mt-3 border rounded-md p-3 mb-3 shadow-sm bg-green-400">
            <p><strong>Booked By :</strong> {formatUserName(b.userName)}</p>
            <p><strong>Venue:</strong> {b.venue}</p>
            <p><strong>Sport:</strong> {b.sport}</p>
            <p><strong>Date:</strong> {b.date}</p>
            <p><strong>Time:</strong> {b.slot}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default BookingList;
