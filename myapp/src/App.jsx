import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css'

const BookingForm = () => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: 1,
    name: "",
    email: "",
    phone: "",
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    setFormData({ ...formData, date: selectedDate });
    setLoading(true);
    try {
      const response = await axios.get(
        `https://restaurant-table-booking-system-j584.vercel.app/?date=${selectedDate}` // Correct API URL for Render backend
      );
      setAvailableSlots(response.data.times);
    } catch (err) {
      setError("Failed to fetch available slots");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.date || !formData.time || !formData.name || !formData.email) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://restaurant-table-booking-system-1-w4qo.onrender.com/api/booking", // Correct API URL for Render backend
        formData
      );
      setBookingConfirmed(true);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to create booking. Please try again.");
      setLoading(false);
    }
  };

  if (bookingConfirmed) {
    return (
      <div className="confirmation">
        <h2>Booking Confirmed!</h2>
        <div className="confirmation-details">
          <p><strong>Date:</strong> {formData.date}</p>
          <p><strong>Time:</strong> {formData.time}</p>
          <p><strong>Guests:</strong> {formData.guests}</p>
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Phone:</strong> {formData.phone}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-form">
      <h2>Make a Reservation</h2>
      
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Date <span>*</span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div>
          <label>
            Time <span>*</span>
          </label>
          <select
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          >
            <option value="">Select a time</option>
            {availableSlots.length === 0 && !loading && (
              <option disabled>No available slots</option>
            )}
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>
            Number of Guests <span>*</span>
          </label>
          <input
            type="number"
            min="1"
            value={formData.guests}
            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
            required
          />
        </div>

        <div>
          <label>
            Name <span>*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label>
            Email <span>*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Booking..." : "Book Now"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
