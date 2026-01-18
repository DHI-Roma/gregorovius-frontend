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
      @update:model-value="onSelectedChange"
    >
      <template #selected>
        {{ selectedYearsSorted }}
      </template>
      <template #option="{ itemProps, opt, selected, toggleOption }">
        <q-item v-bind="itemProps">
          <q-item-section>
            <q-item-label>
              <template v-if="opt === '0000'">undatiert</template>
              <template v-else>{{ opt }}</template>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useMainStore } from 'src/stores/main';

export default defineComponent({
  name: 'SelectYears',

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

  setup(props, { emit }) {
    const route = useRoute();
    const store = useMainStore();

    const selectedYears = ref([]);

    const selectedYearsSorted = computed(() => {
      return [...selectedYears.value].sort().join(', ').replace('0000', 'undatiert');
    });

    watch(selectedYears, (newValue) => {
      store.setSelected({ entity: 'years', value: newValue });
    });

    function getSelected() {
      if ('years' in route.query) {
        selectedYears.value = route.query.years.split(',');
      } else {
        selectedYears.value = [];
      }
    }

    function onSelectedChange(value) {
      emit('update-selection', value);
    }

    onMounted(() => {
      getSelected();
    });

    return {
      selectedYears,
      selectedYearsSorted,
      onSelectedChange,
    };
  },
});
</script>

<style></style>
