import { onBeforeUnmount } from 'vue';

/**
 * Keeps the options menu of a q-select on screen.
 *
 * Quasar positions a menu only while it has a size: it measures for about 50 ms after opening and
 * once after the transition. On a busy page (e.g. the full letter index) the options can render
 * later; the menu then stays hidden off screen until the window scrolls or resizes.
 * While the menu is open, this re-positions it whenever its size changes.
 *
 * Usage: <q-select ref="selector" @popup-show="onPopupShow" @popup-hide="onPopupHide">
 */
export function useMenuPosition(selector) {
  let menus = null;
  let sizes = null;

  function observeMenus() {
    document.querySelectorAll('.q-menu').forEach((menu) => sizes.observe(menu));
  }

  function onPopupShow() {
    onPopupHide();
    sizes = new ResizeObserver(() => selector.value?.updateMenuPosition());
    // the menu is rendered after this event and re-rendered when the options are filtered
    menus = new MutationObserver(observeMenus);
    menus.observe(document.body, { childList: true, subtree: true });
    observeMenus();
  }

  function onPopupHide() {
    menus?.disconnect();
    sizes?.disconnect();
    menus = null;
    sizes = null;
  }

  onBeforeUnmount(onPopupHide);

  return { onPopupShow, onPopupHide };
}
