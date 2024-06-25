import axios from 'axios';
import { InternalServerError } from '../errors';

const imageApi = axios.create({
  baseURL: 'https://appstore-app-icon-fetch.onrender.com/',
});

export const imageService = {
  fetchSVG: async (searchTerm: string) => {
    const response = await imageApi.post('image-to-svg', { term: searchTerm });
    if (response.data.error)
      throw new InternalServerError('Failed to fetch credential icon');
    return response.data;
  },
};
