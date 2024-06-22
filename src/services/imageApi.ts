import axios from 'axios';

const imageApi = axios.create({
  baseURL: 'https://appstore-app-icon-fetch.onrender.com/',
});

interface PostProps {
  url?: string;
  data: {
    term: string;
  };
}

export const fetchSVG = async ({ url = 'image-to-svg', data }: PostProps) => {
  const response = await imageApi.post(url, data);
  return response;
};
