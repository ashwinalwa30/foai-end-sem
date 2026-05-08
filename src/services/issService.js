import axios from 'axios';

const ISS_BASE_URL = 'http://api.open-notify.org';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

export const fetchIssLocation = async () => {
  const response = await axios.get(`${ISS_BASE_URL}/iss-now.json`);
  return {
    latitude: parseFloat(response.data.iss_position.latitude),
    longitude: parseFloat(response.data.iss_position.longitude),
    timestamp: response.data.timestamp
  };
};

export const fetchAstronauts = async () => {
  const response = await axios.get(`${ISS_BASE_URL}/astros.json`);
  return response.data;
};

export const fetchLocationName = async (lat, lon) => {
  try {
    const response = await axios.get(NOMINATIM_URL, {
      params: {
        lat,
        lon,
        format: 'json',
        zoom: 10,
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'ISS-Tracker-Dashboard/1.0'
      }
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
