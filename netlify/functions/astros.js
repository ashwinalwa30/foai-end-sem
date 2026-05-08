const ASTROS_URL = 'http://api.open-notify.org/astros.json';

export default async (req, context) => {
  try {
    const response = await fetch(ASTROS_URL);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    // Fallback data if API is down
    return new Response(
      JSON.stringify({ number: 7, people: [{ name: 'Data Unavailable', craft: 'ISS' }] }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
};

export const config = {
  path: '/api/astros',
};
