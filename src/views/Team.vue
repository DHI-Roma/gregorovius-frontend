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
            <div class="text-h6 text-center">Ehemalige Mitarbeitende</div>
          </q-card-section>
          <q-separator dark />
        </q-card>
        <q-card v-for="person in formerMembers" :key="person.id">
          <div class="row">
            <div class="self-center">
              <q-card-section>
                <div class="text-h6">{{ person.name }}</div>
                <div class="text-secondary">(bis {{ person.until }})</div>
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
          role: "Projekt- und Editionsleitung",
          tel: "+49 (0)30 4940204",
          mail: "steinsiek@dhi-roma.it",
          url: "http://dhi-roma.it/index.php?id=steinsiek"
        },
        {
          id: "pohl",
          img: require("../statics/img/pohl.jpg"),
          name: "Oliver Pohl, M. A.",
          role: "Werkauftrag",
          tel: "",
          mail: "kontakt@wildegans-solutions.de",
          url: "",
        },
      ],
      formerMembers: [
        {
          id: "ramazzotti",
          name: "Mariana Ramazzotti, M. A.",
          until: "September 2023"
        },
        {
          id: "compton",
          name: "Marlene Compton, M. A.",
          until: "Februar 2023",
        },
        {
          id: "weiger",
          name: "Dr. Katharina Weiger",
          until: "Juli 2020"
        },
        {
          id: "stepken",
          name: "Raphael Stepken, B. A.",
          until: "Juli 2020"
        },
        {
          id: "costea",
          name: "Theodor Costea, M. A.",
          until: "März 2020"
        },
        {
          id: "mueller",
          name: "Eric Müller, M. A.",
          until: "Juni 2019"
        },
        {
          id: "neuber",
          name: "Dr. Frederike Neuber",
          until: "September 2019"
        },
        {
          id: "vinattieri",
          name: "Dr. Wiebke Fastenrath Vinattieri",
          until: "Februar 2019"
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
