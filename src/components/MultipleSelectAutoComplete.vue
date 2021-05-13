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
      option-value="value"
      option-label="label"
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
    }
  },
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
      const filteredOptions = this.optionsFull.filter(option =>
        option.label.toLowerCase().includes(needle)
      );
      this.options = filteredOptions.sort((a, b) => {
        const valA = a.label.toLowerCase();
        const valB = b.label.toLowerCase();
        return valA.localeCompare(valB);
      });
    },
    setSelected() {
      this.setSelectedAction({ entity: this.$props.entity, value: this.model });
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
    }
  }
};
</script>

<style></style>
