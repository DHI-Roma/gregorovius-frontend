import { useMainStore } from 'src/stores/main';
import { getPersonIdByGnd } from 'src/services/person-service';

const routes = [
  {
    path: '/',
    component: () => import('layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'Index',
        component: () => import('pages/Index.vue'),
      },
      {
        path: 'letters',
        name: 'Briefe',
        component: () => import('pages/LettersIndex.vue'),
      },
      {
        path: 'letters/full-index',
        name: 'Gesamtdatenbank',
        component: () => import('pages/LettersFullIndex.vue'),
      },
      {
        path: 'letters/:id',
        name: 'Brief',
        component: () => import('pages/LettersDetail.vue'),
        beforeEnter(to, from, next) {
          const store = useMainStore();
          store.unselectComment();
          next();
        },
      },
      {
        path: 'letters/:id/:commentId',
        name: 'Brief und Kommentar',
        component: () => import('pages/LettersDetail.vue'),
      },
      {
        path: 'letters/:id/filters/:entityIds',
        name: 'Briefe mit vorhandenen Entitaeten',
        component: () => import('pages/LettersDetail.vue'),
      },
      {
        path: 'persons',
        name: 'Personen',
        component: () => import('pages/PersonsIndex.vue'),
        async beforeEnter(to, from, next) {
          const store = useMainStore();
          await Promise.all([
            store.loadFullNameIndex(),
            store.loadEntities(),
          ]);
          next();
        },
      },
      {
        path: 'persons/:id',
        name: 'Person',
        component: () => import('pages/PersonsDetail.vue'),
      },
      {
        path: 'persons-multiple',
        name: 'Personen (mehrfach)',
        component: () => import('pages/PersonsDetailMultiple.vue'),
        props: (route) => ({ ids: route.query.ids }),
      },
      {
        path: 'gnd/:id',
        name: 'GND',
        component: () => import('pages/PersonsIndex.vue'),
        async beforeEnter(to, from, next) {
          const store = useMainStore();
          await Promise.all([
            store.loadFullNameIndex(),
            store.loadEntities(),
          ]);

          const personId = getPersonIdByGnd(to.params.id, store.persons);
          if (!personId) {
            next();
            return;
          }

          next({
            path: `/persons/${personId}`,
          });
        },
      },
      {
        path: 'places',
        name: 'Orte',
        component: () => import('pages/PlacesIndex.vue'),
        async beforeEnter(to, from, next) {
          const store = useMainStore();
          await Promise.all([
            store.loadFullNameIndex(),
            store.loadEntities(),
          ]);
          next();
        },
      },
      {
        path: 'places/:id',
        name: 'Ort',
        component: () => import('pages/PlacesDetail.vue'),
      },
      {
        path: 'works',
        name: 'Werke',
        component: () => import('pages/WorksIndex.vue'),
      },
      {
        path: 'works/:id',
        name: 'Werk',
        component: () => import('pages/WorksDetail.vue'),
      },
      {
        path: 'works-multiple',
        name: 'Werk (mehrfach)',
        component: () => import('pages/WorksDetailMultiple.vue'),
        props: (route) => ({ ids: route.query.ids }),
      },
      {
        path: 'project',
        name: 'Projekt',
        component: () => import('pages/Project.vue'),
      },
      {
        path: 'team',
        name: 'Team',
        component: () => import('pages/Team.vue'),
      },
      {
        path: 'impressum',
        name: 'Impressum',
        component: () => import('pages/Impressum.vue'),
      },
      {
        path: 'privacy',
        name: 'Datenschutzerklärung',
        component: () => import('pages/PrivacyNotice.vue'),
      },
      {
        path: 'announcements',
        name: 'announcements',
        component: () => import('pages/Announcements.vue'),
      },
    ],
  },

  // Always leave this as last one
  {
    path: '/:catchAll(.*)*',
    name: '404',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
