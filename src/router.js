import Vue from "vue";
import Router from "vue-router";
import DefaultLayout from "@/layouts/Default.vue";
import Index from "@/views/Index.vue";

import LettersIndex from "@/views/LettersIndex.vue";
import LettersDetail from "@/views/LettersDetail.vue";
import PersonsIndex from "@/views/PersonsIndex.vue";
import PersonsDetail from "@/views/PersonsDetail.vue";
import PlacesIndex from "@/views/PlacesIndex.vue";
import PlacesDetail from "@/views/PlacesDetail.vue";
import WorksIndex from "@/views/WorksIndex.vue";
import WorksDetail from "@/views/WorksDetail.vue";
import WorksDetailMultiple from "@/views/WorksDetailMultiple.vue";

import Impressum from "@/views/Impressum.vue";
import Project from "@/views/Project.vue";
import Team from "@/views/Team.vue";

import store from "@/store";

import Error404 from "@/views/Error404.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
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
          component: LettersDetail
        },
        {
          path: "persons",
          name: "Personen",
          component: PersonsIndex
        },
        {
          path: "persons/:id",
          name: "Person",
          component: PersonsDetail,
          beforeEnter(to, from, next) {
            store.dispatch("loadFullNameIndexAction");
            next();
          }
        },
        {
          path: "places",
          name: "Orte",
          component: PlacesIndex,
          beforeEnter(to, from, next) {
            store.dispatch("loadFullNameIndexAction");
            next();
          }
        },
        {
          path: "places/:id",
          name: "Ort",
          component: PlacesDetail,
          beforeEnter(to, from, next) {
            store.dispatch("loadFullNameIndexAction");
            next();
          }
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
          path: "*",
          name: "404",
          component: Error404
        }
      ]
    }
  ]
});
