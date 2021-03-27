export const teiHeaderFixture = {
  teiHeader: {
    "@xmlns": "http://www.tei-c.org/ns/1.0",
    fileDesc: {
      titleStmt: {
        title:
          "Ferdinand Gregorovius an Hermann von Thile in Berlin. Rom, 16. und 22. Dezember 1860",
        editor: {
          persName: {
            "@ref": "http://d-nb.info/gnd/1127895559",
            surname: "Steinsiek",
            forename: "Angela"
          }
        },
        respStmt: {
          persName: { surname: "Costea", forename: "Theodor" },
          resp: { note: { "@type": "remarkResponsibility", "#text": "Mitarbeit" } }
        }
      },
      editionStmt: { edition: { title: "Fredinand Gregorovius, gesammelte Briefe" } },
      publicationStmt: {
        publisher: {
          orgName: [
            { "@xml:lang": "de", "#text": "Deutsches Historisches Institut in Rom" },
            { "@xml:lang": "it", "#text": "Istituto Storico Germanico di Roma" },
            { "@xml:lang": "en", "#text": "German Historical Institute in Rome" }
          ],
          address: { addrLine: "Via Aurelia Antica, 00165 Rom, Italien" }
        },
        pubPlace: { "@ref": "http://www.geonames.org/3169070", "#text": "Rom" },
        availability: {
          "@status": "free",
          licence: {
            "@target": "http://creativecommons.org/licenses/by/4.0/",
            "#text": "Creative Commons Attribution 4.0 International (CC BY 4.0)"
          }
        }
      },
      sourceDesc: {
        msDesc: {
          msIdentifier: { repository: "GSA Weimar", idno: "96/937 (16)" },
          physDesc: { p: "1 Dbl., 1 Bl., 8°, 5 S." }
        },
        listWit: {
          witness: [
            {
              msDesc: {
                "@type": "copy",
                msIdentifier: {
                  institution: "GhStA Berlin",
                  collection: "NL Waldemar Kampf",
                  idno: {
                    idno: {
                      "@type": "shelfmark",
                      "#text":
                        "Karton 59, Mappe 346 (nach D) und Karton\n                                        59, Mappe 346 (Ergänzungen nach H)"
                    }
                  }
                }
              }
            },
            {
              msDesc: {
                "@type": "concept",
                msIdentifier: {
                  institution: null,
                  collection: null,
                  idno: { idno: { "@type": "shelfmark" } }
                }
              }
            },
            {
              bibl: {
                "@type": "print",
                "#text":
                  "Briefe von Ferdinand Gregorovius an den Staatssekretär\n                            Hermann von Thile. Hrsg. von Herman von Petersdorff. Berlin 1894. S.\n                            33–37 (leicht gekürzt)"
              }
            },
            {
              bibl: {
                "@type": "print",
                "#text":
                  "Deutsche Briefe aus Italien. Von Winckelmann bis Gregorovius. Hrsg. von Eberhard Haufe. Leipzig 1965. S. 402–403.  2. Aufl. 1971: S. 408–409.  3. Aufl. 1987: S. 412–413 (Auszug)"
              }
            }
          ]
        }
      }
    },
    profileDesc: {
      abstract: {
        p: [
          {
            "@xml:lang": "de",
            "#text":
              "Er hat seinen letzten Brief in der Berliner Wohnung Thiles hinterlassen. Der Bildhauer August Wittig lässt niemanden in sein Atelier, um seine von Moritz August von Bethmann Hollweg in Auftrag gegebene Pietà in Augenschein nehmen zu können, allein Peter Cornelius hat sie gesehen. Die bei Hirzel jüngst herausgekommenen „Zwölf Briefe von Goethe’s Eltern an Lavater“ sind in nur 50 Exemplaren gedruckt worden. Er ist von Berlin über Südfrankreich reisend seit dem 11. Oktober wieder in Rom. Die französische Landschaft und der Papstpalast in Avignon haben ihn sehr beiendruckt. Wenn Rom erst an das europäische Eisenbahnnetz angeschlossen wird, würden keine zeitraubenden Schiffsfahrten über Civiavecchia mehr nötig sein. Er wohnt jetzt zusammen mit dem Bildhauer Eduard Mayer in der Via Gregoriana und arbeitet am vierten Band seiner „Geschichte der Stadt Rom im Mittelalter“ (1862). Er ist froh, dass Moritz August von Bethmann Hollweg günstig über die ersten drei Bände (1859–1860) geurteilt hat. Die politische Umwälzung in Italien und das absehbare Ende des Kirchenstaates helfen ihm bei der Entstehung seines Werkes, auch wenn er als Künstler keine Prognose der künftigen Entwicklung wagt. Er würde gerne nach Deutschland zurückkehren, doch kann er seine „Geschichte der Stadt Rom im Mittelalter“ nicht „in der dünnen Atmosphäre Berlin’s“ schreiben. Cornelius will im April nach Deutschland zurück. Nach dem Tod seiner Frau Geltrude im Juni 1859 gibt es Gerüchte über eine erneute Heirat. Clemens August Alertz will sich in Aachen niederlassen. Dass Thiles Sohn Hans jetzt in die Schule gehen kann, wirderlegt die Befürchtungen des Vaters."
          },
          { "@xml:lang": "it" },
          {
            "@xml:lang": "en",
            "#text":
              "He left his last letter at Thile’s apartment in Berlin. The sculptor August Wittig does not allow anyone to enter his studio to view his Pietà, commissioned by Moritz August from Bethmann Hollweg; only Peter Cornelius has seen it. Only 50 copies of the „Zwölf Briefe von Goethe’s Eltern an Lavater“ recently published by Hirzel were printed. He has been travelling from Berlin via the south of France and has been back in Rome since October 11th. The French landscape and the Pope’s palace in Avignon impressed him greatly. Once Rome is connected to the European railway system, there will no longer be any need for time-consuming boat trips via Civiavecchia. He is now living with the sculptor Eduard Mayer in Via Gregoriana and is working on the fourth volume of his „Geschichte der Stadt Rom im Mittelalter“ (1862). He is pleased that Moritz August von Bethmann Hollweg has given a favorable verdict on the first three volumes (1859-1860). The political upheaval in Italy and the foreseeable end of the Papal States helped him in the creation of his work, even though as an artist he does not dare to predict future developments. He would like to return to Germany, but he cannot write his „Geschichte der Stadt Rom im Mittelalter“ „in the thin atmosphere of Berlin“. Cornelius wants to return to Germany in April. there are rumors of a remarriage after the death of his wife Geltrude in June 1859. Clemens August Alertz wants to settle in Aachen. The fact that Thile’s son Hans is now able to go to school contradicts the fears of his father."
          }
        ]
      },
      correspDesc: {
        correspAction: [
          {
            "@type": "sent",
            persName: { "@key": "G001200", "#text": "Gregorovius, Ferdinand (1821–1891)" },
            placeName: { "@key": "G000763", "#text": "Rom" },
            date: { "@from": "1860-12-16", "@to": "1860-12-22", "@cert": "high" }
          },
          {
            "@type": "received",
            persName: { "@key": "G001644", "#text": "Thile, Hermann von (1812–1889)" },
            placeName: { "@key": "G000636", "#text": "Berlin" }
          }
        ]
      }
    }
  }
};
