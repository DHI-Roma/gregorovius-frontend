<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-md-8 col-12 q-py-xl q-gutter-y-lg">
        <q-card class="q-pa-md" flat>
          <q-card-section>
            <div class="text-h4">Ankündigungen</div>
          </q-card-section>
        </q-card>

        <q-card v-for="announcement in announcements" :key="announcement.id" class="q-pa-md" flat>
          <q-card-section>
            <div class="row text-h6">
              {{ announcement.title }}
            </div>
            <div class="row q-mt-sm">
              <q-chip size="sm" outline color="primary" icon="schedule"
                >{{ announcement.date }}
              </q-chip>
              <q-chip v-if="announcement.location" size="sm" outline color="primary" icon="room">
                {{ announcement.location }}
              </q-chip>
            </div>
          </q-card-section>
          <q-card-section v-html="announcement.description" />
        </q-card>

        <q-card class="q-pa-md" flat>
          <q-card-section>
            <div class="text-h4">Publikationen zur ferneren Lektüre</div>
          </q-card-section>
          <q-card-section
            v-for="(literatureEntry, index) in additionalLiteratureEntries"
            :key="index"
            v-html="literatureEntry"
          >
          </q-card-section>
        </q-card>
      </div>

    </div>
  </q-page>
</template>

<script>
import { announcements } from "@/shared/announcements";
import { additionalLiterature } from "@/shared/additional-literature";

export default {
  name: "Announcements",
  data() {
    return {
      announcements,
      additionalLiteratureEntries: additionalLiterature
    };
  }
};
</script>
