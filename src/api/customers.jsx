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
    return response.status === 201;
  }
  catch (error) {
    return error;
  }
}

export const updateCustomer = async (id, newCustomer) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    const response = await axiosInstance.put(`/api/customers/${id}`, newCustomer, config);
    return response.status === 200;
  }
  catch (error) {
    return error;
  }
}


export const deleteCustomer = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/customers/${id}`);
    return response.status === 200;
  }
  catch (error) {
    return error;
  }
}

