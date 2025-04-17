import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MyEvents = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyEvents = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/api/myevents", {
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
      await axios.delete(`/api/myevents/${id}`, {
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
            await axios.put(`/api/myevents/${event._id}`, formData, {
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
        await axios.put(`/api/myevents/${event._id}`, formData, {
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
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      <Header />

      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-6 px-4">
        <h2 className="text-xl font-semibold uppercase">My Created Events</h2>
      </div>

      <main className="flex-grow px-6 py-10">
        {loading ? (
          <p className="text-gray-300">Loading events...</p>
        ) : error ? (
          <p className="text-red-500 font-medium">{error}</p>
        ) : myEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {myEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition text-black flex flex-col"
              >
                {event.image && (
                  <img
                    src={`/api/events/image/${event._id}`}
                    alt={event.eventName}
                    className="w-full h-40 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-lg font-semibold">{event.eventName}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(event.startDateTime).toLocaleString()} —{" "}
                      {new Date(event.endDateTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {event.description}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300">You haven’t created any events yet.</p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyEvents;
