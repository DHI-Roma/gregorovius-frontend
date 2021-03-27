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
      <template v-slot:option="scope">
        <q-item>
          <q-item-section>
            <q-item-label>{{ scope.opt }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle v-model="model" :val="scope.opt" @input="setSelected" />
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
  mounted() {
    this.getSelected();
  },
  methods: {
    ...mapActions(["setSelectedAction"]),
    setSelected() {
      this.setSelectedAction({ entity: "years", value: this.model });
    },
    getSelected() {
      if ("years" in this.$route.query) this.model = this.$route.query.years.split(",");
      else this.model = [];
    }
  }
};
</script>

<style></style>
