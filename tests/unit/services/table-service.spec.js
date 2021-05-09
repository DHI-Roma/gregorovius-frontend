import { letterIndexItem } from "../fixtures/letter-index-item";
import tableService from "@/services/table-service";

describe("Value Service", () => {

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
