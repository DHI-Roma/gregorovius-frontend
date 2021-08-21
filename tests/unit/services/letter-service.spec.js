import letterService from "@/services/letter-service";
import { teiHeaderFixture } from "../fixtures/tei-header";

describe("Metatada extraction", () => {
  it("should extract the title of a letter", () => {
    const title = "Ferdinand Gregorovius an Hermann von Thile in Berlin";
    expect(letterService.getTitle(teiHeaderFixture)).toBe(title);
  });

  it("should extract the secondary title of a letter", () => {
    const secondaryTitle = "Rom, 16. und 22. Dezember 1860";
    expect(letterService.getSecondaryTitle(teiHeaderFixture)).toBe(secondaryTitle);
  });

  it("should extract the editor", () => {
    const editor = "Angela Steinsiek";
    expect(letterService.getEditor(teiHeaderFixture)).toBe(editor);
  });

  it("should extract the responsible names", () => {
    const editor1 = {
      persName: { surname: "Einstein", forename: "Albert" },
      resp: { note: { "@type": "remarkResponsibility", "#text": "Mitarbeit" } }
    };

    const editor2 = {
      persName: { surname: "Newton", forename: "Isaac" },
      resp: { note: { "@type": "remarkResponsibility", "#text": "Mitarbeit" } }
    };

    const editor3 = {
      persName: { surname: "Tesla", forename: "Nikola" },
      resp: { note: { "@type": "remarkResponsibility", "#text": "Mitarbeit" } }
    };

    teiHeaderFixture.teiHeader.fileDesc.titleStmt.respStmt = [editor1, editor2, editor3];
    expect(letterService.getResponsible(teiHeaderFixture)).toBe(
      "Albert Einstein, Isaac Newton und Nikola Tesla"
    );
  });
});

describe("Citation recommendation", () => {
  it("should compute a citation recommendation", () => {
    const editor1 = {
      persName: { surname: "Einstein", forename: "Albert" },
      resp: { note: { "@type": "remarkResponsibility", "#text": "Mitarbeit" } }
    };

    const editor2 = {
      persName: { surname: "Newton", forename: "Isaac" },
      resp: { note: { "@type": "remarkResponsibility", "#text": "Mitarbeit" } }
    };

    const editor3 = {
      persName: { surname: "Tesla", forename: "Nikola" },
      resp: { note: { "@type": "remarkResponsibility", "#text": "Mitarbeit" } }
    };

    teiHeaderFixture.teiHeader.fileDesc.titleStmt.respStmt = [editor1, editor2, editor3];

    const recommendation =
      "Ferdinand Gregorovius an Hermann von Thile in Berlin. Rom, 16. und 22. Dezember 1860. " +
      "In: Ferdinand Gregorovius. Poesie und Wissenschaft. Gesammelte deutsche und italienische Briefe. Digitale Edition, " +
      "hrsg. von Angela Steinsiek unter Mitarbeit von Albert Einstein, Isaac Newton und Nikola Tesla. " +
      "Deutsches Historisches Institut in Rom, " +
      "URL: https://gregorovius-edition.dhi-roma.it/letters/G000392";

    const url = "https://gregorovius-edition.dhi-roma.it/letters/G000392";
    expect(letterService.getCitationRecommendation(teiHeaderFixture, url)).toBe(recommendation);
  });
});
