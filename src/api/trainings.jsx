import { axiosInstance } from './index';

export const getAllTrainings = async () => {
  try {
    const response = await axiosInstance.get('/gettrainings');
    if (response.status === 200) {
      return response.data;
    }
  }
  catch (error) {
    return error;
  }
}

export const addNewTraining = async (training) => {
  try {
    const response = await axiosInstance.post('/api/trainings', training);
    return response.status === 201;
  }
  catch (error) {
    return error;
  }
}