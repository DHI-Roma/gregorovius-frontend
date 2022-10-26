<template>
  <div class="q-pa-md">
    <q-select
      v-model="selectedYears"
      filled
      bg-color="white"
      multiple
      use-input
      fill-input
      :options="options"
      :label="label"
      :value="selectedYears"
    >
      <template #selected>
        {{ selectedYearsSorted }}
      </template>
      <template v-slot:option="{ itemProps, itemEvents, opt, selected, toggleOption }">
        <q-item
          v-bind="itemProps"
          v-on="itemEvents"
        >
          <q-item-section>
            <q-item-label>{{ opt }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle :value="selected" @input="toggleOption(opt)" />
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "SelectYears",
  props: {
    label: {
      type: String,
      default: ""
    },
    entity: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      selectedYears: []
    };
  },
  computed: {
    options() {
      return this.$attrs.options;
    },
    selectedYearsSorted() {
      return this.selectedYears.sort().join(", ");
    }
  },
  watch: {
    model: {
      handler: function(newValue) {
        this.setSelectedAction({ entity: "years", value: newValue });
      }
    }
  },
  mounted() {
    this.getSelected();
  },
  methods: {
    ...mapActions(["setSelectedAction"]),
    getSelected() {
      if ("years" in this.$route.query) this.selectedYears = this.$route.query.years.split(",");
      else this.selectedYears = [];
    }
  }
};
</script>

<style></style>
