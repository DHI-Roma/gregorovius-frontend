import { shallowMount, createLocalVue } from "@vue/test-utils";
import * as Vuex from "vuex";

import PersonsTitle from "@/components/PersonsTitle.vue";

import { persons } from "../fixtures/persons";

describe("PersonsTitle", () => {
  let localVue;
  let wrapper;
  let getters;
  let actions;
  let store;

  localVue = createLocalVue();
  localVue.use(Vuex);

  const personData = {
    "@xmlns": "http://www.tei-c.org/ns/1.0",
    "@xml:id": "G001203",
    idno: { "@type": "uri", "#text": "http://d-nb.info/gnd/116830050" },
    persName: { "@type": "reg", surname: "Gregorovius", forename: "Julius" },
    birth: "1819",
    death: "1891",
    note: "Some additional notes"
  };

  const personEntity = {
    id: "G001203",
    entity: "persons",
    properties: {
      type: "person",
      role: null,
      name: {
        surname: "Gregorovius",
        forename: "Julius",
        simpleName: null,
        roleName: null,
        orgName: null,
        fullName: "Gregorovius, Julius",
        altNameSubtype: null,
        altSurname: null,
        altForename: null,
        altSimpleName: null
      }
    }
  };

  beforeEach(() => {
    getters = {
      fullNameIndex: () => [],
      persons: () => persons
    };

    actions = {
      loadFullNameIndexAction: jest.fn()
    };

    store = new Vuex.Store({
      actions,
      getters
    });
  });

  it("creates the component", () => {
    wrapper = shallowMount(PersonsTitle, {
      localVue,
      store,
      propsData: {
        entity: personEntity,
        person: personData
      }
    });

    expect(wrapper).toBeTruthy();
    wrapper.destroy();
  });

  it("displays the role element when the entry is a person and not an organisation", () => {
    personEntity.properties.role = "mythological";
    wrapper = shallowMount(PersonsTitle, {
      localVue,
      store,
      propsData: {
        entity: personEntity,
        person: personData
      }
    });

    const roleElement = wrapper.find("#role");
    const targetRole = "Mythologische Figur";

    expect(wrapper.vm.roleName).toBe(targetRole);
    expect(wrapper.vm.isPerson).toBeTruthy();
    expect(wrapper.vm.isOrganisation).toBeFalsy();
    expect(roleElement.exists()).toBeTruthy();
    expect(roleElement.text()).toBe(targetRole);

    wrapper.destroy();
  });

  it("displays the note if it is available", () => {
    const noteText = "Some important information";
    personData.note = noteText;
    wrapper = shallowMount(PersonsTitle, {
      localVue,
      store,
      propsData: {
        entity: personEntity,
        person: personData
      }
    });

    const noteElement = wrapper.find("#note");

    expect(noteElement.exists()).toBeTruthy();
    expect(noteElement.text()).toBe(noteText);

    wrapper.destroy();
  });
});
