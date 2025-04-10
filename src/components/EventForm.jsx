// src/components/EventForm.jsx
import axios from 'axios';
import React, { useState } from 'react';

export default function EventForm({ onClose }) {
  const [eventName, setEventName] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('eventName', eventName);
    formData.append('startDateTime', startDateTime);
    formData.append('endDateTime', endDateTime);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }
  
    const token = localStorage.getItem('token'); // ✅ grab token
  
    try {
      const response = await axios.post('http://localhost:5000/api/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // ✅ send token
        },
      });
  
      console.log('✅ Event created:', response.data);
      setMessage('Event created successfully!');
      onClose();
    } catch (error) {
      console.error('❌ Error creating event:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Error submitting event');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-center">Create New Event</h2>

      <label className="block">
        Event Name:
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
          className="mt-1 p-2 w-full rounded border border-gray-300"
        />
      </label>

      <label className="block">
        Start Date and Time:
        <input
          type="datetime-local"
          value={startDateTime}
          onChange={(e) => setStartDateTime(e.target.value)}
          required
          className="mt-1 p-2 w-full rounded border border-gray-300"
        />
      </label>

      <label className="block">
        End Date and Time:
        <input
          type="datetime-local"
          value={endDateTime}
          onChange={(e) => setEndDateTime(e.target.value)}
          min={startDateTime}
          required
          className="mt-1 p-2 w-full rounded border border-gray-300"
        />
      </label>

      <label className="block">
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 p-2 w-full rounded border border-gray-300"
        />
      </label>

      <label className="block">
        Upload Image:
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="mt-1 block w-full"
        />
      </label>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>

      {message && <p className="text-sm text-center text-green-600">{message}</p>}
    </form>
  );
}
