import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { API } from '../../env.js';

const api = axios.create({ baseURL: API });

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
