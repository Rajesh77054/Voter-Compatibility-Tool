import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const fetchUserData = async () => {
  const response = await api.get('/api/user-data');  // Adjust the endpoint as per your backend route
  return response.data;
};
