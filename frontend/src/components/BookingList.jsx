import { useEffect, useState } from 'react';
import axios from 'axios';

const BookingList = ({ userName, onClose }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (userName) {
      axios.get(`http://localhost:3000/api/bookings?userName=${userName}`)
        .then(res => setBookings(res.data.data || []));
    }
  }, [userName]);

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-4 overflow-y-auto z-50 border-l border-gray-300">
      <button onClick={onClose} className="mb-4 text-red-500 font-bold float-right">✖</button>
      <h2 className="text-lg font-bold mb-4">Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        bookings.map((b, idx) => (
          <div key={idx} className="border rounded-md p-3 mb-3 shadow-sm">
            <p><strong>Booked By :</strong> {b.userName}</p>
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
