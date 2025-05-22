import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3000;

// middleware

app.use(cors());
app.use(express.json())


// in-memory data storage

let venues = [
    {
        id: 'venue_1',
        name: 'SportsPlex Arena',
        location: 'Koramangala, Bangalore',
        sports: ['badminton', 'tennis', 'squash']
    },
    {
        id: 'venue_2',
        name: 'Elite Sports Club',
        location: 'Indiranagar, Bangalore',
        sports: ['cricket', 'football', 'basketball']
    },
    {
        id: 'venue_3',
        name: 'Champions Ground',
        location: 'HSR Layout, Bangalore',
        sports: ['badminton', 'cricket', 'tennis']
    },
    {
        id: 'venue_4',
        name: 'Victory Sports Complex',
        location: 'Whitefield, Bangalore',
        sports: ['football', 'basketball', 'volleyball']
    }
];

// time slots 

const timeSlots = [
    { id: 'slot_1', time: '06:00 AM - 07:00 AM', duration: 60 },
    { id: 'slot_2', time: '07:00 AM - 08:00 AM', duration: 60 },
    { id: 'slot_3', time: '08:00 AM - 09:00 AM', duration: 60 },
    { id: 'slot_4', time: '09:00 AM - 10:00 AM', duration: 60 },
    { id: 'slot_5', time: '10:00 AM - 11:00 AM', duration: 60 },
    { id: 'slot_6', time: '11:00 AM - 12:00 PM', duration: 60 },
    { id: 'slot_7', time: '12:00 PM - 01:00 PM', duration: 60 },
    { id: 'slot_8', time: '01:00 PM - 02:00 PM', duration: 60 },
    { id: 'slot_9', time: '02:00 PM - 03:00 PM', duration: 60 },
    { id: 'slot_10', time: '03:00 PM - 04:00 PM', duration: 60 },
    { id: 'slot_11', time: '04:00 PM - 05:00 PM', duration: 60 },
    { id: 'slot_12', time: '05:00 PM - 06:00 PM', duration: 60 },
    { id: 'slot_13', time: '06:00 PM - 07:00 PM', duration: 60 },
    { id: 'slot_14', time: '07:00 PM - 08:00 PM', duration: 60 },
    { id: 'slot_15', time: '08:00 PM - 09:00 PM', duration: 60 },
    { id: 'slot_16', time: '09:00 PM - 10:00 PM', duration: 60 }
];

// Bookings storage 
// structure:- venueId_date_slotId -> booking details

let bookings = {};

// Initialize mock bookings for demo

const initializeMockBookings = () => {
    const today = new Date().toISOString().split('T')[0]
    console.log(today);

    bookings[`venue_1_${today}_slot_3`] = {
        id: uuidv4(),
        venueId: 'venue_1',
        date: today,
        slotId: 'slot_3',
        userName: 'Rahul Sharma',
        sport: 'badminton',
        bookedAt: new Date().toISOString()
    };

    bookings[`venue_1_${today}_slot_7`] = {
        id: uuidv4(),
        venueId: 'venue_1',
        date: today,
        slotId: 'slot_7',
        userName: 'Priya Singh',
        sport: 'tennis',
        bookedAt: new Date().toISOString()
    };
};

// Utility function to generate booking key
const getBookingKey = (venueId, date, slotId) => `${venueId}_${date}_${slotId}`;

// Routes

// GET all venues
app.get('/api/venues', (req, res) => {
    res.status(200).json({
        success: true,
        data: venues
    })
})

// GET available slots for a venue on a specific date
app.get('/api/venues/:venueId/slots', (req, res) => {
    const { venueId } = req.params;
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({
            success: false,
            message: 'Date parameter is required'
        });
    }

    const venue = venues.find(v => v.id === venueId);

    const availableSlots = timeSlots.map(slot => {
        const bookingKey = getBookingKey(venueId, date, slot.id); // composite key
        const isBooked = bookings.hasOwnProperty(bookingKey);

        return {
            ...slot,
            isBooked,
            booking: isBooked ? bookings[bookingKey] : null // booking info / booked by if any
        };
    });

    res.json({
        success: true,
        data: {
            venue,         // full venue details
            date,          // the date provided
            slots: availableSlots  // array of all slots with status
        }
    });

});


// POST : create a booking
app.post('/api/booking', (req, res) => {
    const { venueId, date, slotId, userName, sport } = req.body;

    if (!venueId || !date || !slotId || !userName || !sport) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: venueId, date, slotId, userName, sport'
        });
    }

    // checking if venue exists
    const venue = venues.find(v => v.id === venueId);
    if (!venue) {
        return res.status(404).json({
            success: false,
            message: 'Venue not found'
        });
    }

    // check if sport is available at the venue
    if (!venue.sports.includes(sport.toLowerCase())) {
        return res.status(400).json({
            success: false,
            message: `Sport ${sport} is not available at this venue`
        });
    }

    // check if slot exists
    const slot = timeSlots.find(s => s.id === slotId);
    if (!slot) {
        return res.status(404).json({
            success: false,
            message: 'Time slot not found'
        });
    }

    // check if slot is already booked
    const bookingKey = getBookingKey(venueId, date, slotId);
    if (bookings[bookingKey]) {
        return res.status(409).json({
            success: false,
            message: 'This slot is already booked'
        });
    }

    const booking = {
        id: uuidv4(),
        venueId,
        date,
        slotId,
        userName: userName.trim(),
        sport: sport.toLowerCase(),
        bookedAt: new Date().toISOString()
    };

    bookings[bookingKey] = booking;

    res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: {
            ...booking,
            venue: venue.name,
            slot: slot.time
        }
    });
});


// GET all booking for a user
app.get('/api/bookings', (req, res) => {
  const { userName } = req.query;
  
  let userBookings = Object.values(bookings);
  
  if (userName) {
    userBookings = userBookings.filter(booking => 
      booking.userName.toLowerCase().includes(userName.toLowerCase())
    );
  }
  
  // Enrich bookings with venue and slot details
  const enrichedBookings = userBookings.map(booking => {
    const venue = venues.find(v => v.id === booking.venueId);
    const slot = timeSlots.find(s => s.id === booking.slotId);
    
    return {
      ...booking,
      venue: venue ? venue.name : 'Unknown Venue',
      slot: slot ? slot.time : 'Unknown Slot'
    };
  });
  
  res.json({
    success: true,
    data: enrichedBookings
  });
});


// DELETE cancel booking
app.delete('/api/bookings/:bookingId', (req, res) => {
  const { bookingId } = req.params;
  
  // Find and remove booking
  const bookingKey = Object.keys(bookings).find(key => 
    bookings[key].id === bookingId
  );
  
  if (!bookingKey) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }
  
  const deletedBooking = bookings[bookingKey];
  delete bookings[bookingKey];
  
  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    data: deletedBooking
  });
});

// Initialize mock data
initializeMockBookings();


app.listen(PORT, () => {
    console.log(`server running on port : ${PORT}`)
})