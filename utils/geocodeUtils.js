// utils/geocodeUtils.js

export const getCoordinates = async (placeName) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}`
      );
      const data = await response.json();
  
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      } else {
        throw new Error('Unable to retrieve coordinates');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  