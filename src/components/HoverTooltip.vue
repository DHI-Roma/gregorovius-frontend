<template>
  <q-tooltip
    ref="tooltip"
    class="g-hover-tooltip"
    :hide-delay="hideDelay"
    @mouseenter="keepOpen"
    @mouseleave="release"
  >
    <slot />
  </q-tooltip>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";

// QTooltip that stays open while the pointer is on it (WCAG 1.4.13). Everything else
// (keyboard focus, touch, Escape, aria-describedby) is QTooltip's own behaviour.
export default defineComponent({
  name: "HoverTooltip",

  props: {
    // time to move the pointer from the anchor onto the tooltip
    hideDelay: {
      type: Number,
      default: 300,
    },
  },

  setup() {
    const tooltip = ref(null);
    let anchor = null;

    // same anchor as QTooltip picks (it skips wrappers such as q-btn__content)
    onMounted(() => {
      anchor = tooltip.value.$el.parentNode;
      while (anchor?.classList.contains("q-anchor--skip")) {
        anchor = anchor.parentNode;
      }
    });

    // QTooltip has a single timer for showing and hiding: replaying the anchor's
    // mouse events cancels or restarts its pending hide
    function keepOpen() {
      anchor?.dispatchEvent(new MouseEvent("mouseenter"));
    }

    function release() {
      anchor?.dispatchEvent(new MouseEvent("mouseleave"));
    }

    return {
      tooltip,
      keepOpen,
      release,
    };
  },
});
</script>

<style lang="scss">
.q-tooltip.g-hover-tooltip {
  pointer-events: auto !important;
}
</style>
