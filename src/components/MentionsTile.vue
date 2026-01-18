<template>
  <q-list
    class="cursor-pointer g-card-list mention"
    :class="backgroundColorClass"
    @click="$router.push(route)"
    @click.middle="openInNewTab(route)"
  >
    <q-item class="g-card">
      <q-item-label>
        {{ truncate(name) }}
      </q-item-label>
      <q-item-label v-if="subtitle.length" class="text-subtitle3 text-secondary">
        {{ subtitle }}
      </q-item-label>
    </q-item>
    <ContextMenu :route-to-open="route"></ContextMenu>
  </q-list>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import {
  ENTITY_PERSON,
  ENTITY_PLACE,
  ENTITY_WORKS,
  WORK_TYPE_GREGOROVIUS_MAIN,
  WORK_TYPE_GREGOROVIUS_TRANSLATION,
  WORK_TYPE_OTHER,
  WORK_TYPE_SECONDARY,
} from "src/shared/constants";
import ContextMenu from "src/components/ContextMenu.vue";

export default defineComponent({
  name: "MentionsTile",
  components: { ContextMenu },

  props: {
    entity: {
      type: [Object, Promise],
      required: true,
    },
  },

  setup(props) {
    const router = useRouter();

    function truncate(text) {
      const characterLimit = 90;
      if (!text || text.length < characterLimit) {
        return text;
      }
      return text.substr(0, characterLimit) + "...";
    }

    function openInNewTab(route) {
      const resolved = router.resolve(route);
      window.open(resolved.href, "_blank");
    }

    const route = computed(() => {
      if (props.entity.entity === ENTITY_PERSON) {
        return "/persons/" + props.entity.id;
      }
      if (props.entity.entity === ENTITY_PLACE) {
        return "/places/" + props.entity.id;
      }
      if (props.entity.entity === ENTITY_WORKS) {
        return "/works/" + props.entity.id;
      }
      return "";
    });

    const name = computed(() => {
      if (props.entity.entity === ENTITY_PERSON) {
        return props.entity.properties.name.fullName;
      }
      if (props.entity.entity === ENTITY_PLACE) {
        return props.entity.properties.name.toponym;
      }
      if (props.entity.entity === ENTITY_WORKS) {
        return props.entity.properties.title;
      }
      return "";
    });

    const subtitle = computed(() => {
      if (props.entity.entity !== ENTITY_PERSON) {
        return "";
      }

      let subtitleText = "";
      if (props.entity.properties.birth) {
        subtitleText += props.entity.properties.birth;
      }
      if (props.entity.properties.birth || props.entity.properties.death) {
        subtitleText += " - ";
      }
      if (props.entity.properties.death) {
        subtitleText += props.entity.properties.death;
      }
      return subtitleText.trim();
    });

    const backgroundColorClass = computed(() => {
      if (props.entity.entity === ENTITY_PERSON) {
        return "bg-green-1";
      }
      if (props.entity.entity === ENTITY_PLACE) {
        return "bg-brown-1";
      }
      if (
        props.entity.entity === ENTITY_WORKS &&
        props.entity.properties.type === WORK_TYPE_GREGOROVIUS_MAIN
      ) {
        return "bg-indigo-1";
      }
      if (
        props.entity.entity === ENTITY_WORKS &&
        props.entity.properties.type === WORK_TYPE_GREGOROVIUS_TRANSLATION
      ) {
        return "bg-blue-1";
      }
      if (props.entity.entity === ENTITY_WORKS && props.entity.properties.type === WORK_TYPE_OTHER) {
        return "bg-cyan-1";
      }
      if (
        props.entity.entity === ENTITY_WORKS &&
        props.entity.properties.type === WORK_TYPE_SECONDARY
      ) {
        return "bg-teal-1";
      }
      return "";
    });

    return {
      route,
      name,
      subtitle,
      backgroundColorClass,
      truncate,
      openInNewTab,
    };
  },
});
</script>

<style scoped>
.g-card {
  flex-direction: column;
}

.g-card-list {
  font-size: 0.8rem;
}

.g-card-list:hover {
  filter: brightness(95%);
}
</style>
