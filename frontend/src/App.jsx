import { useEffect, useState } from 'react';
import VenueSelector from './components/VenueSelector';
import axios from 'axios';
import Header from './components/Header';
import MessageCard from './components/MessageCard';
import BookingList from './components/BookingList';

const App = () => {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [sport, setSport] = useState('');
  const [slots, setSlots] = useState([]);

  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [message, setMessage] = useState('');
  const [showBookings, setShowBookings] = useState(false);

  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [showNamePrompt, setShowNamePrompt] = useState(!localStorage.getItem('userName'));

  const selectedVenueData = venues.find(v => v.id === selectedVenue);
  const availableSports = selectedVenueData?.sports || [];

  useEffect(() => {
    axios.get('http://localhost:3000/api/venues')
      .then(res => setVenues(res.data.data || []));
  }, []);

  useEffect(() => {
    if (selectedVenue && selectedDate && sport) {
      axios.get(`http://localhost:3000/api/venues/${selectedVenue}/slots`, {
        params: { date: selectedDate, sport }
      }).then(res => {
        setSlots(res.data.data?.slots || []);
      });
    }
  }, [selectedVenue, selectedDate, sport]);

  const handleVenueChange = (id) => {
    setSelectedVenue(id);
    setSport(''); // Reset sport when venue changes
    setSlots([]);
    setSelectedSlotId('');
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/booking', {
        venueId: selectedVenue,
        date: selectedDate,
        slotId: selectedSlotId,
        userName,
        sport
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <>
      {showNamePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Welcome!</h2>
            <p className="mb-2">Please enter your name to continue:</p>
            <input
              type="text"
              className="border p-2 rounded w-full mb-4"
              placeholder="Your name"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value)
                console.log(e.target.value);
                }
              }
            />
            <button
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              disabled={!userName.trim()}
              onClick={() => {
                localStorage.setItem('userName', userName);
                setShowNamePrompt(false);
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <Header 
        setShowBookings={setShowBookings}
      />
      {/* <div className="flex justify-between items-center mb-4">
        <button
          className="text-sm text-blue-600 underline"
          onClick={() => setShowBookings(true)}
        >
          View My Bookings
        </button>
      </div> */}

      <div className="max-w-3xl mx-auto p-4">

        <VenueSelector
          venues={venues}
          selectedVenue={selectedVenue}
          setSelectedVenue={handleVenueChange}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">

          <select
            value={sport}
            onChange={e => setSport(e.target.value)}
            className="w-full sm:w-auto border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
            disabled={!availableSports.length}
          >
            <option value="">Select a Sport</option>
            {availableSports.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {slots.map(slot => (
            <button
              key={slot.id}
              onClick={() => !slot.isBooked && setSelectedSlotId(slot.id)}
              disabled={slot.isBooked}
              className={`border px-3 py-2 rounded-md transition-all duration-200 
              ${selectedSlotId === slot.id ? 'bg-green-300 ring-2 ring-green-500' : ''}
              ${slot.isBooked ? 'bg-red-300 text-gray-500 cursor-not-allowed' : 'hover:bg-blue-100'}`}
            >
              {slot.time} {slot.isBooked ? '(Booked)' : ''}
            </button>
          ))}
        </div>

        <button
          onClick={handleBooking}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded-md"
          disabled={!selectedSlotId || !userName || !sport}
        >
          Book Slot
        </button>

        {message &&
          <MessageCard
            message={message}
            type={message.toLowerCase().includes('success') ? 'success' : 'error'}
          />
        }

        {showBookings && (
          <BookingList
            userName={userName}
            onClose={() => setShowBookings(false)}
          />
        )}
      </div>
    </>
  );
};

export default App;
