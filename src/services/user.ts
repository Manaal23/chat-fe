import axios from 'axios';
import { EndPoints, BASE_URL } from '../constants/endpoints';

// eslint-disable-next-line import/prefer-default-export
export const getProfile = () =>
  axios.get(`${BASE_URL}${EndPoints.user.GET_USERS}`);
