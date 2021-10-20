<template>
  <q-menu touch-position context-menu>
    <q-list dense style="min-width: 100px">
      <q-item v-close-popup clickable @click.native="openInNewTab">
        <q-item-section>In neuem Tab öffnen</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script>
export default {
  name: "ContextMenu",
  props: {
    routeToOpen: {
      type: String,
      required: true
    }
  },
  methods: {
    openInNewTab() {
      window.open(this.routeToOpen, "_blank");
    }
  }
};
</script>
