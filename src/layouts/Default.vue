<template>
  <q-layout>
    <q-header :class="$route.path === '/' ? 'transparent' : 'bg-primary'">
      <q-tabs inline-label indicator-color="positive" align="left" class="g-route-tabs">
        <img
          class="gt-sm logo-signature cursor-pointer q-mx-md q-pa-md"
          src="../statics/img/gregorovius_signature.svg"
          @click="$router.push({ path: '/' })"
        />
        <q-icon
          class="lt-sm q-mr-md cursor-pointer"
          name="home"
          style="font-size: 1.3em"
          @click="$router.push({ path: '/' })"
        ></q-icon>
        <q-route-tab to="/letters" label="BRIEFE" />
        <q-route-tab to="/persons" label="PERSONEN" />
        <q-route-tab to="/places" label="ORTE" />
        <q-route-tab to="/works" label="WERKE" />
        <q-space />
        <q-btn flat label="PROJEKT" @click="$router.push({ name: 'Projekt' })" />
        <q-btn flat label="TEAM" @click="$router.push({ name: 'Team' })" />
        <q-btn
          flat
          label="EDITIONSRICHTLINIEN"
          @click="openUrl('http://gregorovius-edition.dhi-roma.it/richtlinien/')"
        />
      </q-tabs>
    </q-header>
    <q-page-container :class="$route.path === '/' ? 'bg-none' : 'bg-grey-2'">
      <router-view />
    </q-page-container>
    <q-footer :class="$route.path === '/' ? 'transparent' : 'bg-secondary'" class="text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="row q-pa-md">
            <div class="col-md-6 col-10 q-pa-md self-center">
              <a href="http://dhi-roma.it">
                <img src="../statics/img/logo_dhi.png" />
              </a>
            </div>
            <div class="col-md-3 col-10 q-pa-md">
              <div class="text-caption">gefördert durch</div>
              <div class="row q-py-md">
                <a href="https://www.dfg.de/">
                  <img src="../statics/img/logo_dfg.png" />
                </a>
              </div>
              <div class="row">
                <a href="https://www.gerda-henkel-stiftung.de/">
                  <img src="../statics/img/logo_henkel.png" />
                </a>
              </div>
            </div>
            <div class="col-md-3 col-10 q-pa-md">
              <div class="text-caption">in Kooperation mit</div>
              <a href="http://www.bbaw.de">
                <img src="../statics/img/logo_bbaw.png" />
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
                  <img src="../statics/img/badge_cc_by.png" alt="" />
                </a>
              </div>
            </div>
            <div class="col-md-3 col-10">
              <q-btn flat class="text-caption bg-none" @click="$router.push({ name: 'Impressum' })">
                Impressum
              </q-btn>
            </div>
            <div class="col-md-1 col-10 cursor-pointer">
              <q-icon name="photo_camera" :class="$route.path === '/' ? '' : 'hidden'">
                <q-popup-proxy>
                  <q-banner class="text-subtitle" content-style="font-size: 12px">
                    <b>Hintergrundbild:</b>
                    Gregorovius am Schreibtisch, Aquarell von K. Lindemann-Frommel, BSB München,
                    Nachlass F. Gregorovius, Gregoroviusiana 30.a.9,
                    <a href="http://mdz-nbn-resolving.de/urn:nbn:de:bvb:12-bsb00002519-8">
                      urn:nbn:de:bvb:12-bsb00002519-8
                    </a>
                  </q-banner>
                </q-popup-proxy>
              </q-icon>
            </div>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: "DefaultLayout",
  computed: {
    appVersion() {
      return require("../../package.json").version;
    }
  },
  methods: {
    openUrl(url) {
      url ? window.open(url) : null;
    }
  }
};
</script>

<style>
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
</style>
