import { axiosInstance } from './index';
import { extractDataFromResponse } from './index';

export const getAllCustomers = async () => {
  try {
    const response = await axiosInstance.get('/api/customers');
    if (response.status === 200) {
      return extractDataFromResponse(response).customers
    }
  }
  catch (error) {
    return error;
  }
}



