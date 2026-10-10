<template>
  <q-layout>
    <a href="#main-content" class="g-skip-link" @click.prevent="focusMainContent">Zum Inhalt springen</a>
    <q-header :class="$route.path === '/' ? 'transparent' : 'bg-primary'">
      <nav aria-label="Hauptnavigation">
        <q-tabs inline-label indicator-color="positive" align="left" class="g-route-tabs">
          <router-link to="/" class="gt-sm">
            <img
              class="logo-signature cursor-pointer q-mx-md q-pa-md"
              src="/img/gregorovius_signature.svg"
              alt="Ferdinand Gregorovius – Startseite"
            />
          </router-link>
          <router-link to="/" class="lt-sm q-mr-md text-white" aria-label="Startseite">
            <q-icon name="home" style="font-size: 1.3em" />
          </router-link>
          <q-route-tab :to="$router.resolve({ path: '/letters', query: $route.query }).href" label="BRIEFEDITION" class="tab-small" />
          <q-route-tab to="/persons" label="PERSONEN" class="tab-small" />
          <q-route-tab to="/places" label="ORTE" class="tab-small" />
          <q-route-tab to="/works" label="WERKE" class="tab-small" />
          <q-space />
          <q-route-tab to="/letters/full-index">
            <div class="flex-block">
              <div>Gesamtdatenbank</div>
              <div>der Korrespondenz</div>
            </div>
          </q-route-tab>
          <q-space />
          <q-btn flat label="PROJEKT" :to="{ name: 'Projekt' }" />
          <q-btn flat label="AKTUELLES" :to="{ name: 'announcements' }" />
          <q-btn flat label="TEAM" :to="{ name: 'Team' }" />
          <q-btn
            flat
            label="EDITIONSRICHTLINIEN"
            href="http://gregorovius-edition.dhi-roma.it/richtlinien/"
            target="_blank"
          />
        </q-tabs>
      </nav>
    </q-header>
    <q-page-container
      id="main-content"
      tabindex="-1"
      :class="$route.path === '/' ? 'bg-none' : 'bg-grey-2'"
    >
      <router-view />
    </q-page-container>
    <q-footer :class="$route.path === '/' ? 'transparent' : 'bg-secondary'" class="text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="row q-pa-md">
            <div class="col-md-6 col-10 q-pa-md self-center">
              <a href="http://dhi-roma.it">
                <img src="/img/logo_dhi.png" />
              </a>
            </div>
            <div class="col-md-3 col-10 q-pa-md">
              <div class="text-caption">gefördert durch</div>
              <div class="row q-py-md">
                <a href="https://www.dfg.de/">
                  <img src="/img/logo_dfg.png" />
                </a>
              </div>
              <div class="row">
                <a href="https://www.gerda-henkel-stiftung.de/">
                  <img src="/img/logo_henkel.png" />
                </a>
              </div>
            </div>
            <div class="col-md-3 col-10 q-pa-md">
              <div class="text-caption">in Kooperation mit</div>
              <a href="http://www.bbaw.de">
                <img src="/img/logo_bbaw.png" />
              </a>
            </div>
          </div>
          <div class="row justify-between">
            <div class="col-md-3 col-10 q-pa-md q-ml-sm">
              <div class="col-md-3 col-10 text-caption">
                <b>Ferdinand Gregorovius Briefedition </b>
                <q-badge color="black">v{{ appVersion }}</q-badge>
              </div>
              <div class="col-md-3 col-10 text-caption">
                <a href="https://creativecommons.org/licenses/by/4.0/deed.de">
                  <img src="/img/badge_cc_by.png" alt="" />
                </a>
              </div>
            </div>
            <div class="col-md-3 col-10">
              <q-btn flat class="text-caption bg-none" :to="{ name: 'Impressum' }">
                Impressum
              </q-btn>
            </div>
            <div class="col-md-3 col-10">
              <q-btn flat class="text-caption bg-none" :to="{ name: 'Datenschutzerklärung' }">
                Datenschutz
              </q-btn>
            </div>
            <div class="col-md-1 col-10 cursor-pointer">
              <q-btn
                flat
                dense
                padding="none"
                size="11.7px"
                icon="photo_camera"
                aria-label="Bildnachweis"
                aria-haspopup="dialog"
                :aria-expanded="imageCreditOpen ? 'true' : 'false'"
                :class="$route.path === '/' ? '' : 'hidden'"
              >
                <q-popup-proxy v-model="imageCreditOpen">
                  <q-banner class="text-subtitle">
                    <b>Hintergrundbild:</b>
                    Gregorovius am Schreibtisch, Aquarell von K. Lindemann-Frommel, BSB München,
                    Nachlass F. Gregorovius, Gregoroviusiana 30.a.9,
                    <a href="http://mdz-nbn-resolving.de/urn:nbn:de:bvb:12-bsb00002519-8">
                      urn:nbn:de:bvb:12-bsb00002519-8
                    </a>
                  </q-banner>
                </q-popup-proxy>
              </q-btn>
            </div>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { version } from '../../package.json';

export default defineComponent({
  name: 'DefaultLayout',

  setup() {
    const imageCreditOpen = ref(false);

    function focusMainContent() {
      document.getElementById('main-content')?.focus();
    }

    return {
      appVersion: version,
      imageCreditOpen,
      focusMainContent,
    };
  },
});
</script>

<style lang="scss">
.landing-page-bg {
  color: none;
}
.logo-signature {
  height: 80px;
  max-width: 320px;
}
.q-tab__indicator {
  height: 5px !important;
}
.g-route-tabs {
  font-family: IBMPlexSansMedium;
}

.tab-small {
  max-width: 120px;
}

// Visible only when focused with the keyboard (spec 002)
.g-skip-link {
  position: absolute;
  left: -9999px;
  top: 8px;
  z-index: 3000;
  padding: 8px 16px;
  background: #fff;
  color: #000;
  outline: 2px solid $primary;

  &:focus {
    left: 16px;
  }
}

#main-content:focus {
  outline: none;
}
</style>
