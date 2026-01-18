<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-md-8 col-12 q-py-xl q-gutter-y-lg">
        <q-card class="q-pa-xl" flat>
          <q-card-section>
            <div class="text-h6 text-center">Impressum</div>
            <div class="text-subtitle3 text-secondary"></div>
          </q-card-section>
          <q-separator dark />
          <q-card-section class="text-body1">
            <div class="text-bold">Deutsches Historisches Institut in Rom</div>
            <div class="text-bold">Istituto Storico Germanico di Roma</div>
            <div>Via Aurelia Antica, 391</div>
            <div>I-00165 Roma</div>
            <div>Gesetzlicher Vertreter: Prof. Dr. Martin Baumeister</div>
            <div>Tel: +39 06 6604921</div>
            <div>Fax: +39 06 6623838</div>
            <div>E-Mail: info(at)dhi-roma(dot)it</div>
          </q-card-section>
          <q-card-section class="text-body1">
            <div>Ein Institut der</div>
            <div class="text-bold">Max Weber Stiftung</div>
            <div class="text-bold">Deutsche Geisteswissenschaftliche Institute im Ausland</div>
            <div>Rheinallee 6</div>
            <div>53173 Bonn</div>
            <div>Gesetzlicher Vertreter: Dr. Harald Rosenbach</div>
            <div>Tel. +49 228 377860</div>
            <div>Fax: +49 228 3778619</div>
            <div>E-Mail: info(at)maxweberstiftung(dot)de</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "Project",
  data() {
    return {
      tab: "edi"
    };
  }
};
</script>

<style scoped>
.g-project-img {
  max-width: 100%;
}
a {
  text-decoration: none;
}
</style>
