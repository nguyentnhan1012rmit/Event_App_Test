import axios from "axios";
import React, { useEffect, useState } from "react";

const MyEvents = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyEvents = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:5001/api/myevents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMyEvents(response.data);
        setError("");
      } catch (err) {
        console.error("Failed to fetch user events", err);
        setError("Failed to load your events.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5001/api/myevents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMyEvents((prev) => prev.filter((event) => event._id !== id));
    } catch (err) {
      console.error("❌ Failed to delete event", err);
      alert("❌ Could not delete event.");
    }
  };

  const handleEdit = async (event) => {
    const token = localStorage.getItem("token");

    const choice = prompt(
      "What do you want to update?\n1. Name\n2. Image\n3. Both\nEnter 1, 2 or 3:"
    );

    if (!["1", "2", "3"].includes(choice)) {
      alert("Invalid choice. Please enter 1, 2, or 3.");
      return;
    }

    const formData = new FormData();

    if (choice === "1" || choice === "3") {
      const newName = prompt("Enter new event name:", event.eventName);
      if (newName && newName.trim() !== "") {
        formData.append("eventName", newName);
      }
    }

    if (choice === "2" || choice === "3") {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";

      fileInput.onchange = async () => {
        const file = fileInput.files[0];
        if (file) {
          formData.append("image", file);

          try {
            await axios.put(`http://localhost:5001/api/myevents/${event._id}`, formData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            });
            alert("✅ Event updated!");
            window.location.reload();
          } catch (err) {
            console.error("❌ Failed to update event", err);
            alert("❌ Could not update event.");
          }
        }
      };

      fileInput.click();
    }

    if (choice === "1") {
      try {
        await axios.put(`http://localhost:5001/api/myevents/${event._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("✅ Event updated!");
        window.location.reload();
      } catch (err) {
        console.error("❌ Failed to update event", err);
        alert("❌ Could not update event.");
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">My Created Events</h1>

      {loading ? (
        <p>Loading events...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : myEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myEvents.map((event) => (
            <div key={event._id} className="border p-4 rounded shadow">
              {event.image && (
                <img
                  src={`http://localhost:5001/api/events/image/${event._id}`}
                  alt={event.eventName || "Event image"}
                  className="h-40 w-full object-cover rounded mb-2"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <h2 className="text-lg font-bold">{event.eventName}</h2>
              <p>
                {new Date(event.startDateTime).toLocaleString()} —{" "}
                {new Date(event.endDateTime).toLocaleString()}
              </p>
              <p className="text-sm mt-1">{event.description}</p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
};

export default MyEvents;
