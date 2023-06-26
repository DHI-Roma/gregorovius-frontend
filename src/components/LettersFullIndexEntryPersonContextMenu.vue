<template>
  <q-btn
    round
    flat
    size="xs"
    icon="arrow_drop_down"
  >
    <q-menu>
      <q-list>
        <q-item v-if="person.birth || person.death">
          <template>{{ person.birth }}</template>
          -
          <template>{{ person.death }}</template>
        </q-item>
        <q-item v-if="person.gnd">
          <a :href="'http://d-nb.info/gnd/' + person.gnd" target="_blank">
            <q-chip color="blue-1" class="q-ml-none">
              <q-avatar rounded font-size="11px" color="blue-5" class="text-white">
                GND
              </q-avatar>
              <div class="text-blue text-caption q-pl-sm">
                {{ person.gnd }}
              </div>
            </q-chip>
          </a>
        </q-item>

      </q-list>
    </q-menu>

  </q-btn>
</template>

<script>
import { QAvatar, QBtn, QChip, QMenu } from "quasar";

export default {
  name: 'LettersFullIndexEntryPersonContextMenu',
  components: { QAvatar, QMenu, QChip, QBtn },
  props: {
    person: {
      type: Object,
      required: true
    }
  }
}
</script>
