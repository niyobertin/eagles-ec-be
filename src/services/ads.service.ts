import axios from 'axios';
import { env } from '../utils/env';

export const fetchAds = async (query: string) => {
  try {
    const response = await axios.get(`${env.ADS_URL}`, {
      params: { query }
    });
    const data = await response.data
    return data;
  } catch (error: any) {
    throw Error(error.message);
  }
}

