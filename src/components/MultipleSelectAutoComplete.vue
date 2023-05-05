<template>
  <div class="q-pa-md">
    <q-select
      ref="selector"
      v-model="model"
      bg-color="white"
      use-input
      fill-input
      filled
      multiple
      use-chips
      emit-value
      map-options
      :option-value="getOptionValue"
      :option-label="getOptionLabel"
      :options="options"
      :label="label"
      @filter="filterOptions"
      @input="setSelected"
    >
    </q-select>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { QSelect } from "quasar";

export default {
  name: "MultipleSelectAutoComplete",
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
    },
  },
  emits: ['update-selection'],
  data() {
    return {
      model: [],
      options: this.$attrs.options
    };
  },
  computed: {
    optionsFull() {
      return this.$attrs.options;
    }
  },
  watch: {
    optionsFull: function(loadedOptions) {
      if (!loadedOptions.length) {
        return;
      }
      if (this.$props.entity in this.$route.query) {
        const entityIds = this.$route.query[this.$props.entity]
          .split(",")
          .filter(entityId => entityId.length > 0);

        if (entityIds.length) {
          this.model = entityIds.map(entityId => {
            return this.optionsFull.find(option => option.value === entityId);
          });
        } else {
          this.model = [];
        }
      } else {
        this.model = [];
      }
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
      const filteredOptions = this.optionsFull.filter((option) => {
        const label = option?.label ?? option;
        return label.toLowerCase().includes(needle);
      });
      this.options = filteredOptions.sort((a, b) => {
        const labelA = a?.label ?? a;
        const labelB = b?.label ?? b;
        const valA = labelA.toLowerCase();
        const valB = labelB.toLowerCase();
        return valA.localeCompare(valB);
      });
    },
    setSelected() {
      this.setSelectedAction({ entity: this.$props.entity, value: this.model });
      this.$emit('update-selection', this.model);
    },
    getSelected() {
      if (this.$props.entity in this.$route.query) {
        const entityIds = this.$route.query[this.$props.entity]
          .split(",")
          .filter(entityId => entityId.length > 0);

        if (entityIds.length) {
          this.model = this.$route.query[this.$props.entity].split(",");
        } else {
          this.model = [];
        }
      } else {
        this.model = [];
      }
    },
    getOptionValue(option) {
      if (typeof option === 'object') {
        return option.value;
      }
      return option;
    },
    getOptionLabel(option) {
      if (typeof option === 'object') {
        return option.label;
      }
      return option;
    },
  }
};
</script>

<style></style>
