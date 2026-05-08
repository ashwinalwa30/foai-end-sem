import axios from 'axios';

const ISS_BASE_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

export const fetchIssLocation = async () => {
  const response = await axios.get(ISS_BASE_URL);
  return {
    latitude: parseFloat(response.data.latitude),
    longitude: parseFloat(response.data.longitude),
    timestamp: response.data.timestamp,
    speed: response.data.velocity,
  };
};

export const fetchAstronauts = async () => {
  try {
    // Use our own Netlify proxy function (works both locally via netlify dev and in production)
    const response = await axios.get('/api/astros');
    return response.data;
  } catch (error) {
    console.warn('Astronaut fetch error, using fallback');
    return { number: 7, people: [{ name: 'Data Unavailable', craft: 'ISS' }] };
  }
};

export const fetchLocationName = async (lat, lon) => {
  try {
    // Remove User-Agent header - browsers block it (unsafe header)
    const response = await axios.get(NOMINATIM_URL, {
      params: {
        lat,
        lon,
        format: 'json',
        zoom: 10,
        addressdetails: 1,
      },
    });

    if (response.data && response.data.display_name) {
      return response.data.display_name;
    }
    return 'Over Open Ocean / Remote Area';
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return 'Ocean/Remote Area';
  }
};
