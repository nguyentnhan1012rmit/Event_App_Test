// src/components/EventForm.jsx

import axios from 'axios';
import React, { useState } from 'react';

export default function EventForm({ onClose }) {
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [description, setDescription] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(50); // Default value
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('eventName', eventName);
    formData.append('type', eventType);
    formData.append('startDateTime', startDateTime);
    formData.append('endDateTime', endDateTime);
    formData.append('description', description);
    formData.append('maxParticipants', maxParticipants); // Add maxParticipants to the form data
    if (image) {
      formData.append('image', image);
    }

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('/api/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
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
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <label className="block">
        Event Name:
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
          className="mt-1 p-2 w-full rounded border border-gray-300 text-black"
        />
      </label>

      <label className="block">
        Event type:
        <div className="flex justify-center">
          <div className="flex items-center me-4">
            <input
              id="public-event"
              type="radio"
              value="public"
              name="eventType"
              checked={eventType === 'public'}
              onChange={(e) => setEventType(e.target.value)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="public-event" className="ms-2 font-medium text-black">
              Public
            </label>
          </div>
          <div className="flex items-center me-4">
            <input
              id="private-event"
              type="radio"
              value="private"
              name="eventType"
              checked={eventType === 'private'}
              onChange={(e) => setEventType(e.target.value)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="private-event" className="ms-2 font-medium text-black">
              Private
            </label>
          </div>
        </div>
      </label>

      <label className="block">
        Start Date and Time:
        <input
          type="datetime-local"
          value={startDateTime}
          onChange={(e) => setStartDateTime(e.target.value)}
          required
          className="mt-1 p-2 w-full rounded border border-gray-300 text-black"
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
          className="mt-1 p-2 w-full rounded border border-gray-300 text-black"
        />
      </label>

      <label className="block">
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 p-2 w-full rounded border border-gray-300 text-black"
        />
      </label>

      <div>
        <label className="block">Max Participants</label>
        <input
          type="number"
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(e.target.value)}
          className="w-full border p-2 rounded"
          min="1"
          required
        />
      </div>

      <label className="block">
        Upload Image:
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="mt-1 block w-full text-black"
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
