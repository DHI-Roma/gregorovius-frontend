import { defineBoot } from '#q-app';
import axios from 'axios';
import { API } from '../../env.js';

const api = axios.create({ baseURL: API });

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
