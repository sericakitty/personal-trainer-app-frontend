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

export const addNewCustomer = async (customer) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    const response = await axiosInstance.post('/api/customers', customer, config);
    if (response.status === 201) {
      return response.data;
    }
  }
  catch (error) {
    return error;
  }
}


