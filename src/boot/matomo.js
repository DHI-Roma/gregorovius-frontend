import { defineBoot } from '#q-app';
import VueMatomo from 'vue-matomo';
import { MATOMO_CONFIG } from '../../env.js';

export default defineBoot(({ app, router }) => {
  if (MATOMO_CONFIG.enableMatomo) {
    app.use(VueMatomo, {
      host: MATOMO_CONFIG.host,
      siteId: MATOMO_CONFIG.siteId,
      router
    });
  }
});
