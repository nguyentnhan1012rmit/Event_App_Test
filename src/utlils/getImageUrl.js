export const getImageUrl = (eventId) =>
    `${import.meta.env.VITE_API_URL}/api/events/image/${eventId}`;
  