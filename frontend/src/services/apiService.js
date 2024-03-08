// apiService.js
const apiBaseUrl = 'http://localhost:3000';

export const createPassenger = async (newPassenger) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/passengers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPassenger),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating passenger:', error);
    throw error;
  }
};
