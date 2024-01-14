import { useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { BASE_URL } from '../constants/endpoints';

axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;
const useAxiosFetch = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (
    params: AxiosRequestConfig<any>,
    actionCreator?: ActionCreatorWithPayload<any>
  ): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.request(params);
      setData(response.data);

      // if (actionCreator !== undefined) {
      //   dispatch(actionCreator(response.data ?? response));
      // } else {
      //   return response.data;
      // }
      if (actionCreator) dispatch(actionCreator(response.data ?? response));
      return response.data ?? response;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError('Axios Error with Message: ' + e.message);
      } else {
        setError(e);
      }

      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return [data, error, loading, fetchData] as const;
};

export default useAxiosFetch;
