import { io } from 'socket.io-client';
import { BASE_URL } from './constants/endpoints';

const URL = BASE_URL;
const socket = io(URL, { autoConnect: false });

export default socket;
