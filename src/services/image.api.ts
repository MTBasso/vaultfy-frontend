import axios from 'axios';

const imageApi = axios.create({
  baseURL: 'https://appstore-app-icon-fetch.onrender.com/',
});

export const imageService = {
  fetchSVG: async (searchTerm: string) => {
    console.log('fetch image called');

    const response = await imageApi.post('image-to-svg', { term: searchTerm });
    console.log(response.data);

    return response;
  },
};
