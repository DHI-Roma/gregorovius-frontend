import { boot } from 'quasar/wrappers';
import { QTooltip, QIcon, QBtn } from 'quasar';
import CommentIcon from 'src/components/CommentIcon.vue';
import ContextMenu from 'src/components/ContextMenu.vue';
import { useMainStore } from 'src/stores/main';
import { basePathLetters } from 'src/router';

// Register components globally for use in vue3-runtime-template
export default boot(({ app, router }) => {
  // Custom components
  app.component('CommentIcon', CommentIcon);
  app.component('context-menu', ContextMenu);

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
      activateComment(event, commentId) {
        const store = useMainStore();
        const route = router.currentRoute.value;

        history.pushState({}, null, basePathLetters + "/" + route.params.id + "/" + commentId);

        const commentHtml = document.querySelector(`#comment-${commentId}`);
        const commentReference = document.querySelector(
          `.g-comment-orig[commentId="${commentId}"]`
        );

        // Initial position
        const comment = {
          id: commentId,
          text: commentHtml.innerHTML,
          offsetTop: commentReference.offsetTop,
        };
        store.setActiveComment(comment);

        // Recalculate after splitter resizes
        setTimeout(() => {
          const panel = document.querySelector('.comment-panel');
          if (panel && commentReference) {
            const panelRect = panel.getBoundingClientRect();
            const refRect = commentReference.getBoundingClientRect();
            comment.offsetTop = refRect.top - panelRect.top + panel.scrollTop;
            store.setActiveComment(comment);
          }
        }, 50);
      },
      openInNewTab(routeObj) {
        const resolved = router.resolve(routeObj);
        window.open(resolved.href, "_blank");
      }
    }
  });
});
