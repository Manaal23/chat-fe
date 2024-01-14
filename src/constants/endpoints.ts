const GET_USER_CONTACT = 'contact';
const GET_USER_BY_FILTER = 'filter';
const GET_USER_BY_SEARCH = 'search';

export const EndPoints = {
  auth: {
    SIGNUP: '/signup',
    LOGIN: '/user/login',
    LOGOUT: '/logout',
  },
  user: {
    GET_USERS: '/user',
    [GET_USER_BY_FILTER]: '/user/filter',
    SET_PREFERENCES: '/preference',
    [GET_USER_CONTACT]: '/user/contact',
    [GET_USER_BY_SEARCH]: '/user/search',
    CHECK_BLOCKED: '/user/checkblock',
    UNBLOCK: '/user/unblock',
    BLOCK: '/user/block',
    UNIQUE_NAME: '/uniqueName',
  },
  chat: {
    SAVE_CHAT: '/chat',
  },
};
export const BASE_URL = 'http://localhost:5000';
// export const BASE_URL = 'https://qa-chatbackend.onrender.com';
// export const BASE_URL = 'https://chatroom-g3m7.onrender.com';
