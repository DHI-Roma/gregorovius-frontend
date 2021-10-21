export const openInNewTabMixin = {
  methods: {
    openInNewTab(route) {
      window.open(this.$router.resolve(route).href, "_blank");
    }
  }
};
