// src/pages/EventDetail.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error('Error fetching event:', err);
      }
    };

    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5001/api/discussions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(res.data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    fetchEvent();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5001/api/discussions/${id}/comment`,
        { comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [...prev, res.data]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  if (!event) return <p>Loading event...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Event Post Section */}
      <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div>
            <h2 className="font-bold text-lg">{event.eventName}</h2>
            <p className="text-sm text-gray-500">
              {new Date(event.startDateTime).toLocaleString()} - {new Date(event.endDateTime).toLocaleString()}
            </p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{event.description}</p>

        {event.image && (
          <img
            src={`http://localhost:5001/api/events/image/${event._id}`}
            alt="Event"
            className="w-full rounded-lg mb-4"
          />
        )}
      </div>

      {/* Comment Section */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-4">Discussion</h3>

        {/* Add Comment */}
        <form onSubmit={handleCommentSubmit} className="mb-4">
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded px-3 py-2"
            />
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
            >
              Post
            </button>
          </div>
        </form>

        {/* Render Comment List */}
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c._id} className="border-b pb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <p className="font-semibold">{c.user.name}</p>
              </div>
              <p className="ml-10 text-gray-700">{c.comment}</p>
              <p className="ml-10 text-sm text-gray-500">
                {new Date(c.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
