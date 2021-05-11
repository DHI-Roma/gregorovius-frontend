import { letterIndexItem } from "../fixtures/letter-index-item";
import { lettersResponse } from "../fixtures/letters-response";
import tableService from "@/services/table-service";

describe("Table Service", () => {
  describe("#traverseObject", () => {
    it("traverses an object with a direct property name", () => {
      expect(tableService.traverseObject(letterIndexItem, "date")).toBeTruthy();
    });

    it("traverses an object with a nested property name", () => {
      expect(tableService.traverseObject(letterIndexItem, "mentioned.persons")).toBeTruthy();
    });
  });

  describe("#hasValue", () => {
    it("checks whether a direct property matches a value", () => {
      expect(tableService.hasValue(letterIndexItem, "date", "1860-01-11")).toBeTruthy();
    });

    it("checks whether a nested property matches a value", () => {
      expect(tableService.hasValue(letterIndexItem, "place.sent", "G000763")).toBeTruthy();
    });

    it("checks whether a direct array property contains a value", () => {
      expect(tableService.hasValue(letterIndexItem, "comments", "nalr_3nm_ylb"));
    });

    it("checks whether a nested array property contains a value", () => {
      expect(tableService.hasValue(letterIndexItem, "mentioned.works", "G004289"));
    });
  });

  describe("#filterByRecipient", () => {
    it("does not filter any letters when no recipients have been selected", () => {
      expect(tableService.filterByRecipients(lettersResponse, []).length).toBe(14);
    });

    it("filters the letters when one recipient was provided", () => {
      expect(tableService.filterByRecipients(lettersResponse, ["G001011"]).length).toBe(2);
    });

    it("filters the letters when multiple recipients have been provided", () => {
      expect(tableService.filterByRecipients(lettersResponse, ["G001011"]).length).toBe(2);
      expect(tableService.filterByRecipients(lettersResponse, ["G000924"]).length).toBe(1);
      expect(tableService.filterByRecipients(lettersResponse, ["G001011", "G000924"]).length).toBe(
        3
      );
    });
  });
});
