import { fetchSVG } from './imageApi';

export const imageService = {
  fetchSVG: async (searchTerm: string) => {
    try {
      const response = await fetchSVG({ data: { term: searchTerm } });
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
