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
      :options="filteredOptions"
      :label="label"
      @filter="filterOptions"
      @update:model-value="setSelected"
    >
      <template v-if="model.value" #append>
        <q-icon name="cancel" class="cursor-pointer" @click.stop="clearSelection()" />
      </template>
    </q-select>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useMainStore } from 'src/stores/main';

export default defineComponent({
  name: 'SelectAutoComplete',

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
  },

  emits: ['update-selection'],

  setup(props, { emit, expose }) {
    const route = useRoute();
    const store = useMainStore();

    const model = ref({
      label: '',
      value: '',
    });

    const filteredOptions = ref([]);

    const optionsFull = computed(() => props.options);

    function filterOptions(val, update) {
      update(() => filterByInput(val));
    }

    function filterByInput(userInput) {
      const needle = userInput.toLowerCase();
      const filtered = optionsFull.value.filter((option) =>
        option.label.toLowerCase().includes(needle)
      );
      filteredOptions.value = filtered.sort((a, b) => {
        const valA = a.label.toLowerCase();
        const valB = b.label.toLowerCase();
        return valA.localeCompare(valB);
      });
    }

    function clearSelection() {
      model.value = { label: '', value: '' };
      setSelected();
    }

    function setSelected() {
      store.setSelected({ entity: props.entity, value: model.value.value });
      emit('update-selection', model.value);
    }

    function getSelected() {
      if (props.entity in route.query) {
        const selectedValue = route.query[props.entity];
        const selectedLabel = store.fullNameIndex[selectedValue];
        model.value = {
          label: selectedLabel,
          value: selectedValue,
        };
      }
    }

    function setModel(newModel) {
      model.value = newModel;
    }

    onMounted(() => {
      filteredOptions.value = [...props.options];
      getSelected();
    });

    // Expose setModel for parent component access
    expose({ setModel });

    return {
      model,
      filteredOptions,
      filterOptions,
      clearSelection,
      setSelected,
      setModel,
    };
  },
});
</script>

<style></style>
