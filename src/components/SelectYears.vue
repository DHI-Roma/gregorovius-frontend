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
      @input="onSelectedChange"
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
            <q-item-label>
              <template v-if="opt === '0000'">undatiert</template>
              <template v-else>{{ opt }}</template>
            </q-item-label>
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
  emits: ["update-selection"],
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
      return this.selectedYears.sort().join(", ").replace("0000", "undatiert");
    }
  },
  watch: {
    selectedYears: {
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
    },
    setSelected(value) {
      this.setSelectedAction({ entity: "years", value });
      this.selectedYears = value;
    },
    onSelectedChange(value) {
      this.$emit("update-selection", value);
    }
  }
};
</script>

<style></style>
