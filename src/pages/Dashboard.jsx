import axios from 'axios';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';


export default function Dashboard() {
useEffect(() => {
    if (localStorage.getItem('reload') === 'true') {
      window.location.reload();
      localStorage.removeItem('reload');
    }
  }, []);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:5001/api/events', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setEvents(data);
          setFilteredEvents(data); // Initialize filteredEvents with all events
        } else {
          console.error('Failed to fetch events');
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      try {
        const res = await axios.get('http://localhost:5001/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(res.data._id); // Assuming the API returns the user's ID
      } catch (err) {
        console.error('Failed to fetch current user:', err);
      }
    };
  
    fetchCurrentUser();
  }, []);

  const [isAlreadyBooked, setIsAlreadyBooked] = useState(false);

  useEffect(() => {
    const checkIfAlreadyBooked = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Make a GET request to fetch bookings made by the user
        const res = await axios.get(`http://localhost:5001/api/bookings/made`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Check if the selected event is in the user's bookings
        const alreadyBooked = res.data.some(
          (booking) => booking.eventId._id === selectedEvent._id
        );

        setIsAlreadyBooked(alreadyBooked);
      } catch (err) {
        console.error('Failed to check if already booked:', err);
      }
    };

    if (selectedEvent) {
      checkIfAlreadyBooked();
    }
  }, [selectedEvent]);

  const fetchComments = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5001/api/discussions/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = events.filter((event) =>
      event.eventName.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredEvents(filtered);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5001/api/discussions/${selectedEvent._id}/comment`,
        { comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [...prev, res.data]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/discussions/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditedComment(comment.comment);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editedComment.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:5001/api/discussions/comment/${commentId}`,
        { comment: editedComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? res.data : c))
      );
      setEditingCommentId(null);
    } catch (err) {
      console.error('Failed to update comment:', err);
    }
  };

  const handleJoinEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to be logged in to book an event.');
        return;
      }
  
      // Make a POST request to the bookings API
      const res = await axios.post(
        'http://localhost:5001/api/bookings',
        { eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Show success message
      alert('You have booked the event successfully!');
      console.log('Booking response:', res.data);
  
      // Optionally, update the UI or state if needed
      setSelectedEvent(null);
    } catch (err) {
      console.error('Failed to book the event:', err);
      alert('Failed to book the event. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      <Header onSearch={handleSearch}/>

      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-6 px-4">
        <h2 className="text-xl font-semibold uppercase">
          EXPERIENCE WORLD-CLASS LEARNING AT A PREMIER INSTITUTE
        </h2>
      </div>

      <main className="flex-grow px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition text-black">
              {event.image && (
                <img
                  src={`http://localhost:5001/api/events/image/${event._id}`}
                  alt={event.eventName}
                  className="w-full h-40 object-cover rounded-t-lg"
                  onError={(e) => { e.target.src = '/assets/placeholder.png'; }}
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{event.eventName}</h3>
                <p className="text-sm text-gray-500">{new Date(event.startDateTime).toLocaleString()}</p>
                <button
                  onClick={() => {
                    setSelectedEvent(event);
                    fetchComments(event._id);
                  }}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-xl rounded-md shadow-lg">
            {selectedEvent.image && (
              <img
                src={`http://localhost:5001/api/events/image/${selectedEvent._id}`}
                alt={selectedEvent.eventName}
                className="w-full h-60 object-cover rounded-t-md"
              />
            )}

            <div className="p-4 text-black">
              <h2 className="text-xl font-bold">{selectedEvent.eventName}</h2>
              <h3 className='text-base font-bold'>- {selectedEvent.createdBy.name} -</h3>
              <p className="text-sm text-gray-500 mb-1">
                {new Date(selectedEvent.startDateTime).toLocaleString()} - {new Date(selectedEvent.endDateTime).toLocaleString()}
              </p>
              <p className="text-gray-600 mb-1">Current Participants: {selectedEvent.participants.length} / {selectedEvent.maxParticipants}</p>
              <p className="text-gray-700 mb-4">{selectedEvent.description}</p>

              <div className="border-t pt-3">
                <h3 className="font-semibold mb-2">Discussion</h3>

                <form onSubmit={handleCommentSubmit} className="mb-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full border p-2 rounded mb-2"
                  />
                  <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">
                    Comment
                  </button>
                </form>

                <div className="max-h-40 overflow-y-auto">
                  {comments.map((c) => (
                    <div key={c._id} className="border-b pb-2 mb-2">
                      <p className="font-semibold">{c.user.name}</p>
                      {editingCommentId === c._id ? (
                        <>
                          <textarea
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                            className="w-full border p-1 rounded mb-1"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => handleUpdateComment(c._id)} className="text-blue-600 text-sm">Save</button>
                            <button onClick={() => setEditingCommentId(null)} className="text-gray-500 text-sm">Cancel</button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p>{c.comment}</p>
                          <p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</p>
                          {currentUserId === c.user._id && ( // Only show buttons if the current user is the comment owner
                            <div className="flex gap-2 mt-1">
                              <button
                                onClick={() => handleEditComment(c)}
                                className="text-blue-600 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(c._id)}
                                className="text-red-500 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Close
                </button>
                <button
                  onClick={() => handleJoinEvent(selectedEvent._id)}
                  disabled={isAlreadyBooked}
                  className={`px-4 py-2 rounded ${
                    isAlreadyBooked
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isAlreadyBooked ? 'Already Booked' : 'Book Event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}