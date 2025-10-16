import axios from 'axios';

// Unga Vercel la set panna environment variable'ah inga edukurom.
// Local la test pannumbodhu localhost'ku pogum.
const API_URL = process.env.PUBLIC_API_URL || 'https://ekamperfumes-production.up.railway.app/';

// API call panradhuku oru common 'client' create panrom
const apiClient = axios.create({
  baseURL: API_URL, // Unga backend URL'ah base'ah vechikom
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;