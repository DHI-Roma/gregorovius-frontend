<template>
  <div class="q-pa-md">
    <q-select
      ref="selector"
      v-model="model"
      filled
      bg-color="white"
      use-input
      hide-selected
      fill-input
      :options="options"
      :label="label"
      :value="model.value"
      @filter="filterOptions"
      @input="setSelected"
    >
      <template v-if="model.value" v-slot:append>
        <q-icon name="cancel" class="cursor-pointer" @click.stop="clearSelection()" />
      </template>
    </q-select>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { QSelect } from "quasar";

export default {
  name: "SelectAutoComplete",
  components: {
    QSelect
  },
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
      model: {
        label: "",
        value: ""
      },
      options: this.$attrs.options
    };
  },
  computed: {
    optionsFull() {
      return this.$attrs.options;
    },
    value() {
      return this.model.value;
    },
    hasValue() {
      if (!this.model.value) {
        return false;
      }

      return true;
    }
  },
  async mounted() {
    await this.getSelected();
  },
  methods: {
    ...mapActions(["setSelectedAction"]),
    filterOptions(val, update) {
      update(() => this.filterByInput(val));
    },
    filterByInput(userInput) {
      const needle = userInput.toLowerCase();
      const filteredOptions = this.optionsFull.filter(option =>
        option.label.toLowerCase().includes(needle)
      );
      this.options = filteredOptions.sort((a, b) => {
        const valA = a.label.toLowerCase();
        const valB = b.label.toLowerCase();
        return valA.localeCompare(valB);
      });
    },
    clearSelection() {
      this.model = { label: "", value: "" };
      this.setSelected();
    },
    setSelected() {
      this.setSelectedAction({ entity: this.$props.entity, value: this.value });
      this.$emit('update-selection', this.model);
    },
    getSelected() {
      if (this.$props.entity in this.$route.query) {
        const selectedValue = this.$route.query[this.$props.entity];
        const selectedLabel = this.$store.getters.fullNameIndex[selectedValue];
        this.model = {
          label: selectedLabel,
          value: selectedValue
        };
      }
    },
    setModel(model) {
      this.model = model;
    },
  }
};
</script>

<style></style>
