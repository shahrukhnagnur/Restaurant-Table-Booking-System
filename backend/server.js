const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://restaurant-table-booking-system-beg6.vercel.app'];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));
app.use(express.json()); 

let bookings = [];

const generateTimeSlots = (date) => {
  const slots = [];
  for (let hour = 11; hour <= 22; hour++) {
    slots.push(`${hour}:00`);
    if (hour !== 22) slots.push(`${hour}:30`);
  }
  return slots;
};

app.get('/api/availability', (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  const bookedTimes = bookings
    .filter((booking) => booking.date === date)
    .map((booking) => booking.time);

  const availableSlots = generateTimeSlots(date).filter((time) => !bookedTimes.includes(time));
    console.log({message:err.message})
  res.json({ times: availableSlots });
});

app.post('/api/booking', (req, res) => {
  const { date, time, guests, name, email, phone } = req.body;

  if (!date || !time || !guests || !name || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const isBooked = bookings.some((booking) => booking.date === date && booking.time === time);
  if (isBooked) {
    return res.status(400).json({ error: 'This time slot is already booked' });
  }

  const newBooking = { date, time, guests, name, email, phone };
  bookings.push(newBooking);

  res.status(200).json({
    message: 'Booking confirmed!',
    booking: newBooking,
  });
});

app.get("/", (req, res) => {
  res.send("hello homepage");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
