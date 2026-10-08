import { boot } from 'quasar/wrappers';
import { QTooltip, QIcon, QBtn } from 'quasar';
import CommentIcon from 'src/components/CommentIcon.vue';
import { useMainStore } from 'src/stores/main';
import { basePathLetters } from 'src/router';

// Register components globally for use in vue3-runtime-template
export default boot(({ app, router }) => {
  // Custom components
  app.component('CommentIcon', CommentIcon);

  // Quasar components used in XSLT templates
  app.component('q-tooltip', QTooltip);
  app.component('q-icon', QIcon);
  app.component('q-btn', QBtn);

  // Make store properties and methods available globally for vue3-runtime-template
  app.mixin({
    computed: {
      activeComment() {
        const store = useMainStore();
        return store.activeComment;
      }
    },
    methods: {
      openComment(commentId) {
        const store = useMainStore();
        if (!store.openComment(commentId)) return;
        const route = router.currentRoute.value;
        // no router.push, so that the letter text is not re-rendered
        history.pushState({}, null, basePathLetters + "/" + route.params.id + "/" + commentId);
      },

      // Click on a commented passage (mouse only; keyboard users use the CommentIcon button).
      // Links and buttons inside the passage keep their own behaviour.
      activateComment(event, commentId) {
        if (event.target.closest('a, button')) return;
        this.openComment(commentId);
      },
    }
  });
});
