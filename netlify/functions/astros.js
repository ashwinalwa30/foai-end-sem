exports.handler = async function (event, context) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const response = await fetch('http://api.open-notify.org/astros.json');
    const data = await response.json();
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (error) {
    // Fallback if API is down
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        number: 7,
        people: [{ name: 'Data Unavailable', craft: 'ISS' }],
      }),
    };
  }
};
