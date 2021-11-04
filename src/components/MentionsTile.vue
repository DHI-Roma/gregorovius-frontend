<template>
  <q-list
    class="cursor-pointer g-card-list mention"
    :class="backgroundColorClass"
    @click.native="$router.push(route)"
    @click.middle="openInNewTab(route)"
  >
    <q-item class="g-card">
      {{ name | truncate }}
    </q-item>
    <ContextMenu :route-to-open="route"></ContextMenu>
  </q-list>
</template>

<script>
import { openInNewTabMixin } from "@/mixins/openInNewTabMixin";
import {
  ENTITY_PERSON,
  ENTITY_PLACE,
  ENTITY_WORKS,
  WORK_TYPE_GREGOROVIUS_MAIN,
  WORK_TYPE_GREGOROVIUS_TRANSLATION,
  WORK_TYPE_OTHER,
  WORK_TYPE_SECONDARY
} from "@/shared/constants";
import { mapGetters } from "vuex";
import ContextMenu from "@/components/ContextMenu";

export default {
  name: "MentionsTile",
  components: { ContextMenu },
  filters: {
    truncate(text) {
      const characterLimit = 90;
      if (text.length < characterLimit) {
        return text;
      }

      return text.substr(0, characterLimit) + "...";
    }
  },
  mixins: [openInNewTabMixin],
  props: {
    entity: {
      type: [Object, Promise],
      required: true
    }
  },
  computed: {
    ...mapGetters(["fullNameIndex"]),
    route() {
      if (this.entity.entity === ENTITY_PERSON) {
        return "/persons/" + this.entity.id;
      }

      if (this.entity.entity === ENTITY_PLACE) {
        return "/places/" + this.entity.id;
      }

      if (this.entity.entity === ENTITY_WORKS) {
        return "/works/" + this.entity.id;
      }

      return "";
    },
    name() {
      if (this.entity.entity === ENTITY_PERSON) {
        return this.entity.properties.name.fullName;
      }

      if (this.entity.entity === ENTITY_PLACE) {
        return this.entity.properties.name.toponym;
      }

      if (this.entity.entity === ENTITY_WORKS) {
        return this.entity.properties.title;
      }

      return "";
    },
    backgroundColorClass() {
      if (this.entity.entity === ENTITY_PERSON) {
        return "bg-green-1";
      }

      if (this.entity.entity === ENTITY_PLACE) {
        return "bg-brown-1";
      }

      if (
        this.entity.entity === ENTITY_WORKS &&
        this.entity.properties.type === WORK_TYPE_GREGOROVIUS_MAIN
      ) {
        return "bg-indigo-1";
      }

      if (
        this.entity.entity === ENTITY_WORKS &&
        this.entity.properties.type === WORK_TYPE_GREGOROVIUS_TRANSLATION
      ) {
        return "bg-blue-1";
      }

      if (this.entity.entity === ENTITY_WORKS && this.entity.properties.type === WORK_TYPE_OTHER) {
        return "bg-cyan-1";
      }

      if (
        this.entity.entity === ENTITY_WORKS &&
        this.entity.properties.type === WORK_TYPE_SECONDARY
      ) {
        return "bg-teal-1";
      }

      return "";
    }
  }
};
</script>

<style scoped>
.g-card-list {
  font-size: 0.8rem;
}

.g-card-list:hover {
  filter: brightness(95%);
}
</style>
