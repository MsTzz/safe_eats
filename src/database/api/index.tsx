import axios from 'axios';

const API_URL = 'http://192.168.1.4:3000'; // Substitua pela URL do seu servidor

export const testConnection = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/test`);
    console.log('Response from server:', response.data);
  } catch (error) {
    console.error('Error connecting to server:', error);
  }
};