<template>
  <div class="q-pa-md">
    <q-select
      ref="selector"
      v-model="model"
      filled
      multiple
      stack-label
      use-chips
      bg-color="white"
      use-input
      fill-input
      emit-value
      map-options
      option-value="value"
      option-label="label"
      :options="options"
      :label="label"
      @filter="filterOptions"
      @input="setSelected"
    >
    <!--
      <template v-if="model.value" v-slot:append>
        <q-icon name="cancel" class="cursor-pointer" @click.stop="clearSelection()"></q-icon>
      </template>

      -->
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
      console.log({
        name: "selectAutoComplete#setSelected",
        value: this.value,
        model: this.model
      });
      this.setSelectedAction({ entity: this.$props.entity, value: this.model });
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
    }
  }
};
</script>

<style></style>
