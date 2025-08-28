import axios from 'axios';

const API_URL = 'http://localhost:8080/chat';

export const chatBotMessage = async ({ message }) => {
  try {
    const response = await axios.post(`${API_URL}/chatbot`, { message });
    return response.data;
  } catch (error) {
    console.error('Error in chatBotMessage:', error);
    throw error;
  }
};
