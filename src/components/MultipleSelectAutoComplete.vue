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
      :options="filteredOptions"
      :label="label"
      @filter="filterOptions"
      @update:model-value="setSelected"
    />
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useMainStore } from 'src/stores/main';

export default defineComponent({
  name: 'MultipleSelectAutoComplete',

  props: {
    label: {
      type: String,
      default: '',
    },
    entity: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    reloadOptions: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  emits: ['update-selection'],

  setup(props, { emit }) {
    const route = useRoute();
    const store = useMainStore();

    const model = ref([]);
    const filteredOptions = ref([]);

    const optionsFull = computed(() => props.options);

    watch(optionsFull, (loadedOptions) => {
      if (!loadedOptions.length) {
        return;
      }
      if (props.entity in route.query) {
        const entityIds = route.query[props.entity]
          .split(',')
          .filter((entityId) => entityId.length > 0);

        if (entityIds.length) {
          model.value = entityIds.map((entityId) => {
            return optionsFull.value.find((option) => option.value === entityId);
          });
        } else {
          model.value = [];
        }
      } else if (props.reloadOptions) {
        model.value = [];
      }
      filteredOptions.value = [...loadedOptions];
    });

    function filterOptions(val, update) {
      update(() => filterByInput(val));
    }

    function filterByInput(userInput) {
      const needle = userInput.toLowerCase();
      const filtered = optionsFull.value.filter((option) => {
        const label = option?.label ?? option;
        return label.toLowerCase().includes(needle);
      });
      filteredOptions.value = filtered.sort((a, b) => {
        const labelA = a?.label ?? a;
        const labelB = b?.label ?? b;
        const valA = labelA.toLowerCase();
        const valB = labelB.toLowerCase();
        return valA.localeCompare(valB);
      });
    }

    function setSelected() {
      store.setSelected({ entity: props.entity, value: model.value });
      emit('update-selection', model.value);
    }

    function getSelected() {
      if (props.entity in route.query) {
        const entityIds = route.query[props.entity]
          .split(',')
          .filter((entityId) => entityId.length > 0);

        if (entityIds.length) {
          model.value = route.query[props.entity].split(',');
        } else {
          model.value = [];
        }
      } else {
        model.value = [];
      }
    }

    function getOptionValue(option) {
      if (typeof option === 'object') {
        return option.value;
      }
      return option;
    }

    function getOptionLabel(option) {
      if (typeof option === 'object') {
        return option.label;
      }
      return option;
    }

    onMounted(() => {
      filteredOptions.value = [...props.options];
      getSelected();
    });

    return {
      model,
      filteredOptions,
      filterOptions,
      setSelected,
      getOptionValue,
      getOptionLabel,
    };
  },
});
</script>

<style></style>
