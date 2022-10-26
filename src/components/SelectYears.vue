<template>
  <div class="q-pa-md">
    <q-select
      v-model="model"
      filled
      bg-color="white"
      multiple
      use-input
      fill-input
      :options="options"
      :label="label"
      :value="model"
    >
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
      model: []
    };
  },
  computed: {
    options() {
      return this.$attrs.options;
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
      if ("years" in this.$route.query) this.model = this.$route.query.years.split(",");
      else this.model = [];
    }
  }
};
</script>

<style></style>
