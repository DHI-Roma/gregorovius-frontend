<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-md-8 col-12 q-py-xl q-gutter-y-lg">
        <q-card class="q-pa-md" flat>
          <q-card-section>
            <div class="text-h6">Ankündigungen</div>
          </q-card-section>
        </q-card>

        <q-card v-for="announcement in announcements" :key="announcement.id" class="q-pa-md" flat>
          <q-card-section>
            <div class="row announcement-title">
              {{ announcement.title }}
            </div>
            <div class="row q-mt-sm">
              <div class="col-12">
                <q-icon name="schedule" color="primary" size="md" left></q-icon>
                <span class="text-primary">
                  {{ announcement.date }}
                </span>
              </div>
              <div class="col-12">
                <q-icon name="room" color="primary" size="md" left></q-icon>
                <span class="text-primary text-small">
                  {{ announcement.location }}
                </span>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="text-body1" v-html="announcement.description" />
        </q-card>

        <q-card class="q-pa-md" flat>
          <q-card-section>
            <div class="text-h6">Publikationen zur ferneren Lektüre</div>
          </q-card-section>
          <q-card-section
            class="text-body1"
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

<style lang="stylus" scoped>
.announcement-title
  font-size 1.1rem
  font-weight bold
</style>
