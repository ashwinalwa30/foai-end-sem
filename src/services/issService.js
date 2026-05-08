import axios from 'axios';

// Using wheretheiss.at for HTTPS support (essential for deployed sites)
const ISS_BASE_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
const ASTROS_URL = 'https://coriolis.io/api/v1/astros'; // HTTPS proxy for astronauts
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

export const fetchIssLocation = async () => {
  const response = await axios.get(ISS_BASE_URL);
  return {
    latitude: parseFloat(response.data.latitude),
    longitude: parseFloat(response.data.longitude),
    timestamp: response.data.timestamp,
    speed: response.data.velocity // wheretheiss.at provides velocity directly!
  };
};

export const fetchAstronauts = async () => {
  try {
    // Falling back to a secondary HTTPS source for astronauts
    const response = await axios.get('https://api.allorigins.win/get?url=' + encodeURIComponent('http://api.open-notify.org/astros.json'));
    const data = JSON.parse(response.data.contents);
    return data;
  } catch (error) {
    console.warn('Astronaut fetch error, using fallback');
    return { number: 7, people: [{ name: 'Data Unavailable' }] };
  }
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
