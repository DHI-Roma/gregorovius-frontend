<template>
  <q-btn
    color="primary"
    flat
    outline
    :icon="icon"
    :aria-label="label"
    aria-haspopup="dialog"
    :aria-expanded="popoverOpen ? 'true' : 'false'"
  >
    <!-- mouse preview; hidden while the popover shows the same content -->
    <HoverTooltip
      v-if="!popoverOpen"
      anchor="center left"
      self="center right"
      :offset="[10, 10]"
      content-style="font-size: 15px"
      content-class="bg-white shadow-24 text-black q-pa-md"
    >
      <slot />
    </HoverTooltip>
    <q-menu
      v-model="popoverOpen"
      anchor="center left"
      self="center right"
      :offset="[10, 10]"
      role="dialog"
      :aria-label="label"
      class="g-margin-note-popover bg-white text-black q-pa-md"
    >
      <slot />
    </q-menu>
  </q-btn>
</template>

<script>
import { defineComponent, ref } from "vue";

// Margin note in the letter text: the text is shown in a popover on click, Enter or tap
export default defineComponent({
  name: "MarginNote",

  props: {
    icon: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },

  setup() {
    const popoverOpen = ref(false);

    return {
      popoverOpen,
    };
  },
});
</script>

<style lang="scss">
.g-margin-note-popover {
  font-size: 15px;
}
</style>
