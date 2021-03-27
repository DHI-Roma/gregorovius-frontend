<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="q-py-xl q-gutter-y-lg">
        <q-card class="col-md-8 col-12 q-pa-xl" flat>
          <q-card-section>
            <div class="text-h6 text-center">Das Team</div>
            <div class="text-subtitle3 text-secondary"></div>
          </q-card-section>
          <q-separator dark />
        </q-card>
        <q-card
          v-for="person in team"
          :key="person.id"
          :item="person"
          :class="person.url ? 'cursor-pointer' : ''"
          @click="openUrl(person.url)"
        >
          <div class="row">
            <div class="self-center">
              <img
                :src="person.img"
                class="vertical-middle self-center q-pa-md"
                style="border-radius: 50%; max-width: 80%;"
              />
            </div>
            <div class="self-center">
              <q-card-section>
                <div class="text-h6">{{ person.name }}</div>
                <div class="text-subtitle2 text-primary">{{ person.role }}</div>
                <div class="text-secondary">{{ person.mail }}</div>
                <div class="text-secondary">{{ person.tel }}</div>
              </q-card-section>
            </div>
          </div>
        </q-card>
        <q-card class="col-md-8 col-12 q-mt-xl" flat>
          <q-card-section>
            <div class="text-h6 text-center">Ehemalige Mitarbeiter</div>
          </q-card-section>
          <q-separator dark />
        </q-card>
        <q-card>
          <div class="row">
            <div class="self-center">
              <q-card-section>
                <div class="text-h6">Dr. Wiebke Fastenrath Vinattieri</div>
                <div class="text-secondary">(bis Februar 2019)</div>
              </q-card-section>
            </div>
          </div>
        </q-card>
        <q-card>
          <div class="row">
            <div class="self-center">
              <q-card-section>
                <div class="text-h6">Eric Müller M. A.</div>
                <div class="text-secondary">(bis Juni 2019)</div>
              </q-card-section>
            </div>
          </div>
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
      team: [
        {
          id: "steinsiek",
          img: require("../statics/img/steinsiek.jpg"),
          name: "Dr. Angela Steinsiek",
          role: "Projekt- und Editionsleitung (DFG-Projekt)",
          tel: "+49 (0)30 4940204",
          mail: "steinsiek@dhi-roma.it",
          url: "http://dhi-roma.it/index.php?id=steinsiek"
        },
        {
          id: "costea",
          img: require("../statics/img/costea.jpg"),
          name: "Theodor Costea M. A.",
          role: "Wissenschaftlicher Mitarbeiter (DFG-Projekt)",
          tel: "+49 (0)30 20370490",
          mail: "costea@dhi-roma.it",
          url: "http://dhi-roma.it/index.php?id=costea"
        },
        {
          id: "weiger",
          img: require("../statics/img/weiger.jpg"),
          name: "Dr. des. Katharina Weiger",
          role: "Wissenschaftliche Mitarbeiterin (Stipendiatin Gerda Henkel Stiftung)",
          tel: "+49 (0)7571 7572970",
          mail: "weiger@dhi-roma.it",
          url: "http://dhi-roma.it/index.php?id=2475"
        },
        {
          id: "neuber",
          img: require("../statics/img/neuber.jpg"),
          name: "Frederike Neuber",
          role: "Werkauftrag",
          tel: "",
          mail: ""
        },
        {
          id: "stepken",
          img: require("../statics/img/stepken.jpg"),
          name: "Raphael Stepken B. A.",
          role: "Wissenschaftliche Hilfskraft (DFG-Projekt)",
          tel: "",
          mail: "stepken@dhi-roma.it",
          url: "http://dhi-roma.it/index.php?id=mueller0"
        }
      ]
    };
  },
  methods: {
    openUrl(url) {
      url ? window.open(url) : null;
    }
  }
};
</script>

<style></style>
