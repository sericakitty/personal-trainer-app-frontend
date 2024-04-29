import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
    baseURL
});

export const extractDataFromResponse = (response) => {
  // Assuming the relevant data is nested inside `_embedded`
  if (response.data && response.data._embedded && response.data._embedded) {
    return response.data._embedded;
  }
  return []; // Return an empty array if the expected structure is not found
}