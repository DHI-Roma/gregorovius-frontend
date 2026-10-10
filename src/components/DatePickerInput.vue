<template>
  <div class="q-pa-md">
    <q-input
      v-model="dateInput"
      filled
      :label="label"
      :error="dateError !== null"
      :aria-invalid="dateError !== null ? 'true' : undefined"
      :aria-describedby="dateError !== null ? errorId : undefined"
      clearable
      @update:model-value="onDateInput"
      @clear="clearDateInput"
    >
      <template v-slot:append>
        <q-btn
          flat
          dense
          padding="none"
          icon="event"
          aria-label="Kalender öffnen"
        >
          <q-popup-proxy
            ref="qDateProxy"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="datePickerSelection"
              :navigation-min-year-month="earliestMonth"
              :navigation-max-year-month="latestMonth"
              :default-year-month="earliestMonth"
              @update:model-value="onDatePicked"
            >
              <div class="row items-center justify-end">
                <q-btn
                  v-close-popup
                  label="Schließen"
                  color="primary"
                  flat
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
      </template>
      <template #error>
        <div :id="errorId" role="alert">{{ dateError }}</div>
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  name: 'DatePickerInput',
  props: {
    label: {
      type: String,
      required: false,
      default: ''
    },
    minDate: {
      type: String,
      required: false,
      default: '1837/07/17'
    },
    maxDate: {
      type: String,
      required: false,
      default: '1891/04/30'
    }
  },
  emits: ['update-date'],
  data() {
    return {
      dateInput: null,
      datePickerSelection: null
    };
  },
  computed: {
    dateError() {
      const result = this.germanDateRule(this.dateInput);
      return result === true ? null : result;
    },
    errorId() {
      return `date-error-${this.$.uid}`;
    },
    earliestMonth() {
      const [year, month] = this.minDate.split('-');
      return `${year}/${month}`;
    },
    latestMonth() {
      const [year, month] = this.maxDate.split('-');
      return `${year}/${month}`;
    }
  },
  methods: {
    germanDateRule(val) {
      if (!val) {
        return true;
      }
      const regex = new RegExp(
        '^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.]\\d{4}$'
      );

      return regex.test(val) || 'Bitte Datum im Format TT.MM.JJJJ eingeben';
    },
    onDateInput(value) {
      if (!value) {
        this.clearDateInput();
        return;
      }

      // only complete, valid dates are applied as filter
      if (this.germanDateRule(value) !== true) {
        return;
      }

      const [day, month, year] = value.split('.');

      this.datePickerSelection = `${year}/${month}/${day}`;
      const date = `${year}-${month}-${day}`;
      this.$emit('update-date', date);
    },
    onDatePicked(value) {
      if (!value) {
        return;
      }

      const [year, month, day] = value.split('/');
      if (!day || !month || !year) {
        return;
      }

      this.dateInput = `${day}.${month}.${year}`;
      const date = `${year}-${month}-${day}`;
      this.$emit('update-date', date);
    },
    clearDateInput() {
      this.datePickerSelection = null;
      this.dateInput = null;
      this.$emit('update-date', null);
    }
  }
};
</script>
