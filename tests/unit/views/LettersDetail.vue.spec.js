import { shallowMount } from "@vue/test-utils";
import LettersDetail from "@/views/LettersDetail.vue";
import { itemDataRegStandard, itemDataRegNoAbstract, itemDataRegOneAbstract } from "../fixtures/item-data";
import teiHeaderFixture from "../fixtures/tei-header";
import * as service from "../../../src/shared/service";

describe("LettersDetail", () => {
  let wrapper;

  const path = "/letters/G000127";
  const $route = {
    path
  };

  jest.doMock("axios", () => ({
    get: Promise.resolve(teiHeaderFixture)
  }));
  service.dataService.XSLTransform = jest.fn();

  describe("German and English abstracts are available", () => {
    beforeEach(() => {
      wrapper = shallowMount(LettersDetail, {
        mocks: {
          $route
        },
        data() {
          return {
            data: {
              teiHeader: itemDataRegStandard.teiHeader
            },
            loading: false
          };
        }
      });
    });

    afterEach(() => {
      wrapper.destroy();
    });

    it("renders the component", () => {
      expect(wrapper).toBeTruthy();
    });

    it("shows the German abstract when it is available", () => {
      const abstractDe = wrapper.find("#abstract-de");
      expect(abstractDe.exists()).toBeTruthy();
      expect(abstractDe.text()).toContain("Er hat seinen letzten Brief");
    });

    it("shows the English abstract when it is available", () => {
      const abstractEn = wrapper.find("#abstract-en");
      expect(abstractEn.exists()).toBeTruthy();
      expect(abstractEn.text()).toContain("He left his last letter");
    });

    it("reads any abstract with the specified language", () => {
      expect(wrapper.vm.getAbstractForLanguage("de")).toContain("Er hat seinen letzten Brief");
      expect(wrapper.vm.getAbstractForLanguage("en")).toContain("He left his last letter");
    });

    it("checks whether there are abstracts available", () => {
      expect(wrapper.vm.hasAbstracts()).toBeTruthy();
    });

    it("counts two available abstracts", () => {
      expect(wrapper.vm.getAbstractCount()).toBe(2);
    });
  });

  describe("No abstracts are available", () => {
    beforeEach(() => {
      wrapper = shallowMount(LettersDetail, {
        mocks: {
          $route
        },
        data() {
          return {
            data: {
              teiHeader: itemDataRegNoAbstract.teiHeader
            },
            loading: false
          };
        }
      });
    });

    afterEach(() => {
      wrapper.destroy();
    });

    it("detects that there are no abstracts", () => {
      expect(wrapper.vm.hasAbstracts()).toBeFalsy();
      expect(wrapper.vm.getAbstractForLanguage("de")).toBeFalsy();
      expect(wrapper.vm.getAbstractForLanguage("en")).toBeFalsy();
    });

    it("does not show the abstract label, panel and text if there are no abstracts available", () => {
      expect(wrapper.find("#panel-reg").exists()).toBeFalsy();
      expect(wrapper.find("#label-reg").exists()).toBeFalsy();
      expect(wrapper.find("#abstract-de").exists()).toBeFalsy();
      expect(wrapper.find("#abstract-en").exists()).toBeFalsy();

      expect(wrapper.find("#panel-tgl").exists()).toBeTruthy();
      expect(wrapper.find("#label-tgl").exists()).toBeTruthy();
    });

    it("counts no available abstracts", () => {
      expect(wrapper.vm.getAbstractCount()).toBe(0);
    });
  });

  describe("Only one abstract is available", () => {
    beforeEach(() => {
      wrapper = shallowMount(LettersDetail, {
        mocks: {
          $route
        },
        data() {
          return {
            data: {
              teiHeader: itemDataRegOneAbstract.teiHeader
            },
            loading: false
          };
        }
      });
    });

    afterEach(() => {
      wrapper.destroy();
    });

    it("detects that there are abstracts available", () => {
      expect(wrapper.vm.hasAbstracts()).toBeTruthy();
    });

    it("shows the abstracts tab panel and the abstract text", () => {
      expect(wrapper.find("#panel-reg").exists()).toBeTruthy();
      expect(wrapper.find("#label-reg").exists()).toBeTruthy();

      expect(wrapper.find("#abstract-de").exists()).toBeTruthy();
      expect(wrapper.find("#abstract-de").text()).toContain("Er hat seinen letzten Brief");
    });

    it("shows only the one available abstract", () => {
      expect(wrapper.find("#abstract-de").exists()).toBeTruthy();
      expect(wrapper.find("#abstract-en").exists()).toBeFalsy();
    });

    it("counts one available abstract", () => {
      expect(wrapper.vm.getAbstractCount()).toBe(1);
    });
  });
});
