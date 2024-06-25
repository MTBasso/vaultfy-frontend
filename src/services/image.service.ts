import { InternalServerError } from '../errors';
import { imageApi } from './apiConfig';

export const imageService = {
  fetchSVG: async (searchTerm: string) => {
    const response = await imageApi.post('image-to-svg', {
      term: searchTerm,
    });

    if (response.data.error) {
      throw new InternalServerError('Failed to fetch credential icon');
    }

    return response.data;
  },
};
