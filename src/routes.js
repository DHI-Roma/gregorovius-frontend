import DefaultLayout from "@/layouts/Default.vue";
import Index from "@/views/Index.vue";

import LettersIndex from "@/views/LettersIndex.vue";
import LettersDetail from "@/views/LettersDetail.vue";
import PersonsIndex from "@/views/PersonsIndex.vue";
import PersonsDetail from "@/views/PersonsDetail.vue";
import PersonsDetailMultiple from "@/views/PersonsDetailMultiple.vue";
import PlacesIndex from "@/views/PlacesIndex.vue";
import PlacesDetail from "@/views/PlacesDetail.vue";
import WorksIndex from "@/views/WorksIndex.vue";
import WorksDetail from "@/views/WorksDetail.vue";
import WorksDetailMultiple from "@/views/WorksDetailMultiple.vue";

import Impressum from "@/views/Impressum.vue";
import Project from "@/views/Project.vue";
import Team from "@/views/Team.vue";
import PrivacyNotice from "@/views/PrivacyNotice";

import { getPersonIdByGnd } from "@/services/person-service";

import store from "@/store";

import Error404 from "@/views/Error404.vue";
import Announcements from "@/views/Announcements.vue";

export const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "/",
        name: "Index",
        component: Index
      },
      {
        path: "letters",
        name: "Briefe",
        component: LettersIndex
      },
      {
        path: "letters/:id",
        name: "Brief",
        component: LettersDetail,
        beforeEnter(to, from, next) {
          store.dispatch("unselectComment");
          next();
        }
      },
      {
        path: "letters/:id/:commentId",
        name: "Brief und Kommentar",
        component: LettersDetail
      },
      {
        path: "letters/:id/filters/:entityIds",
        name: "Briefe mit vorhandenen Entitaeten",
        component: LettersDetail
      },
      {
        path: "persons",
        name: "Personen",
        component: PersonsIndex,
        async beforeEnter(to, from, next) {
          await Promise.all([
            store.dispatch("loadFullNameIndexAction"),
            store.dispatch("loadEntitiesAction")
          ]);
          next();
        }
      },
      {
        path: "persons/:id",
        name: "Person",
        component: PersonsDetail
      },
      {
        path: "persons-multiple",
        name: "Personen (mehrfach)",
        component: PersonsDetailMultiple,
        props: route => ({ ids: route.query.ids })
      },
      {
        path: "gnd/:id",
        name: "GND",
        component: PersonsIndex,
        async beforeEnter(to, from, next) {
          await Promise.all([
            store.dispatch("loadFullNameIndexAction"),
            store.dispatch("loadEntitiesAction")
          ]);

          const personId = getPersonIdByGnd(to.params.id, store.getters.persons);
          if (!personId) {
            next();
          }

          next({
            path: `persons/${personId}`
          });
        }
      },
      {
        path: "places",
        name: "Orte",
        component: PlacesIndex,
        async beforeEnter(to, from, next) {
          await Promise.all([
            store.dispatch("loadFullNameIndexAction"),
            store.dispatch("loadEntitiesAction")
          ]);
          next();
        }
      },
      {
        path: "places/:id",
        name: "Ort",
        component: PlacesDetail
      },
      {
        path: "works",
        name: "Werke",
        component: WorksIndex
      },
      {
        path: "works/:id",
        name: "Werk",
        component: WorksDetail
      },
      {
        path: "works-multiple",
        name: "Werk (mehrfach)",
        component: WorksDetailMultiple,
        props: route => ({ ids: route.query.ids })
      },
      {
        path: "project",
        name: "Projekt",
        component: Project
      },
      {
        path: "team",
        name: "Team",
        component: Team
      },
      {
        path: "impressum",
        name: "Impressum",
        component: Impressum
      },
      {
        path: "privacy",
        name: "Datenschutzerklärung",
        component: PrivacyNotice
      },
      {
        path: "announcements",
        name: "announcements",
        component: Announcements
      },
      {
        path: "*",
        name: "404",
        component: Error404
      }
    ]
  }
];
