<template>
  <div class="q-pa-md">
    <q-input
      v-model="dateInput"
      filled
      :rules="[germanDateRule]"
      :label="label"
      @input="onDateInput"
    >
      <template v-slot:append>
        <q-icon
          name="event"
          class="cursor-pointer"
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
              @input="onDatePicked"
            >
              <div class="row items-center justify-end">
                <q-btn
                  v-close-popup
                  label="Close"
                  color="primary"
                  flat
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
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
    onDateInput() {
      if (!this.dateInput) {
        return;
      }

      const [day, month, year] = this.dateInput.split('.');
      if (!day || !month || !year) {
        return;
      }

      this.datePickerSelection = `${year}/${month}/${day}`;
      const date = `${year}-${month}-${day}`;
      this.$emit('update-date', date);
    },
    onDatePicked() {
      if (!this.datePickerSelection) {
        return;
      }

      const [year, month, day] = this.datePickerSelection.split('/');
      if (!day || !month || !year) {
        return;
      }

      this.dateInput = `${day}.${month}.${year}`;
      const date = `${year}-${month}-${day}`;
      this.$emit('update-date', date);
    }
  }
};
</script>
