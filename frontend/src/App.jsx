import { useEffect, useState, useRef } from 'react';
import VenueSelector from './components/VenueSelector';
import axios from 'axios';
import Header from './components/Header';
import MessageCard from './components/MessageCard';
import BookingList from './components/BookingList';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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

  const messageRef = useRef(null);

  useEffect(() => {
    axios.get(`${API_BASE}/api/venues`)
      .then(res => setVenues(res.data.data || []));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlots(prevSlots => {
        if (!prevSlots.length) return prevSlots;

        const indexToBook = Math.floor(Math.random() * prevSlots.length);
        const randomSlot = prevSlots[indexToBook];

        if (randomSlot.isBooked) return prevSlots;

        // Post booking to backend
        axios.post(`${API_BASE}/api/booking`, {
          venueId: selectedVenue,
          date: selectedDate,
          slotId: randomSlot.id,
          userName: `random_user${Math.floor(Math.random() * 1000)}`,
          sport
        }).then(res => {
          console.log('Mock booking created:', res.data);
        }).catch(err => {
          console.warn('Mock booking failed:', err.response?.data?.message || err.message);
        });

        // respectively, updating the UI
        const updatedSlots = prevSlots.map((slot, idx) => {
          if (idx === indexToBook) {
            return {
              ...slot,
              isBooked: true,
              booking: { userName: 'random_user' }
            };
          }
          return slot;
        });

        return updatedSlots;
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [selectedVenue, selectedDate, sport]);



  useEffect(() => {
    if (selectedVenue && selectedDate && sport) {
      axios.get(`${API_BASE}/api/venues/${selectedVenue}/slots`, {
        params: { date: selectedDate, sport }
      }).then(res => {
        setSlots(res.data.data?.slots || []);
      });
    }
  }, [selectedVenue, selectedDate, sport]);

  useEffect(() => {
    if (message && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const timer = setTimeout(() => {
      setMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);


  const handleVenueChange = (id) => {
    setSelectedVenue(id);
    setSport(''); // Reset sport when venue changes
    setSlots([]);
    setSelectedSlotId('');
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/booking`, {
        venueId: selectedVenue,
        date: selectedDate,
        slotId: selectedSlotId,
        userName,
        sport
      });

      // Updating slot state to reflect booking
      setSlots(prev =>
        prev.map(slot =>
          slot.id === selectedSlotId
            ? {
              ...slot,
              isBooked: true,
              booking: { userName }
            }
            : slot
        )
      );

      setSelectedSlotId('');
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
                const formattedName = userName.trim().toLowerCase().replace(/\s+/g, '_');
                localStorage.setItem('userName', formattedName);
                setUserName(formattedName); // update state too
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

      {selectedVenueData && (
        <div className="w-full md:w-64 bg-green-100 shadow-md rounded-lg p-4 flex-shrink-0 
            md:fixed md:top-0 md:left-0 md:z-10 md:mt-28 md:pt-6 md:ml-2 mt-4">
          <img
            src={selectedVenueData.image}
            alt={selectedVenueData.name}
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
          <h2 className="text-lg font-bold text-center">{selectedVenueData.name}</h2>
          <p className="text-sm text-gray-600 text-center">{selectedVenueData.location}</p>
          <div className="mt-3">
            <div className="flex flex-wrap justify-center items-center gap-2">
              {selectedVenueData.sports.map((sport) => (
                <span
                  key={sport}
                  className="bg-blue-200 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full"
                >
                  {sport.charAt(0).toUpperCase() + sport.slice(1)}
                </span>
              ))}
            </div>
          </div>

        </div>
      )}

      <div className="max-w-4xl mx-auto p-4">

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

        {slots.length > 0 && (
          <div className="border border-gray-300 rounded-xl p-4 shadow-sm mb-6">
            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-300 rounded"></div>
                <span className="text-sm text-gray-700">Booked by Others</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-400 rounded"></div>
                <span className="text-sm text-gray-700">Booked by You</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <span className="text-sm text-gray-700">Currently Selecting</span>
              </div>
            </div>

            {/* Slot Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {slots.map(slot => {
                const isSelected = selectedSlotId === slot.id;
                const isBookedByMe =
                  slot.booking?.userName?.toLowerCase() === userName.toLowerCase();
                const isBookedByOther = slot.isBooked && !isBookedByMe;

                let bgColor = 'bg-white hover:bg-blue-100 text-gray-800';
                let label = '';

                if (isBookedByOther) {
                  bgColor = 'bg-red-300 text-white cursor-not-allowed';
                  label = ' (Booked)';
                } else if (isBookedByMe) {
                  bgColor = 'bg-blue-400 text-white cursor-not-allowed';
                  label = ' (Booked by You)';
                } else if (isSelected) {
                  bgColor = 'bg-green-400 text-white ring-2 ring-green-600';
                  label = ' (Selected)';
                }

                return (
                  <button
                    key={slot.id}
                    onClick={() => !slot.isBooked && setSelectedSlotId(slot.id)}
                    disabled={slot.isBooked}
                    className={`border border-gray-300 px-4 py-3 rounded-xl shadow-sm font-medium text-sm 
                      transition-all duration-200 ${bgColor} `}
                  >
                    {slot.time}{label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={handleBooking}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded-md"
          disabled={!selectedSlotId || !userName || !sport}
        >
          Book Slot
        </button>

        {message &&
          <MessageCard
            ref={messageRef}
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
