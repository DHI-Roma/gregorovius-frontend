<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-md-8 col-12 q-py-xl q-gutter-y-lg">
        <q-card class="q-pa-xl" flat>
          <q-card-section>
            <div class="text-h6 text-center">Das Projekt</div>
            <div class="text-subtitle3 text-secondary"></div>
          </q-card-section>
          <q-separator dark />
          <q-tabs v-model="tab" class="text-primary">
            <q-tab name="edi" label="Zur Edition" />
            <q-tab name="tec" label="Eingesetzte Technologien" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="edi" class="text">
              <div class="text-body1">
                <p>
                  Ferdinand Gregorovius hat mehr als zwanzig Jahre in Rom gelebt und hier sein
                  Hauptwerk, die „Geschichte der Stadt Rom im Mittelalter“, geschrieben, das ihm
                  1876 die römische Ehrenbürgerwürde einbrachte. Auch wenn Gregorovius vor seinem
                  Tod viele der Briefe <b>an ihn</b> vernichtet hat und einige seiner vertrauten
                  Freunde veranlasst hat, seine Briefe <b>von ihm</b> zu vernichten, haben sich
                  neben seinem historiographischen und schriftstellerischen Œuvre mehrere Tausend
                  Briefe erhalten. Das Gregorovius-Briefkorpus ist wissenschafts-, zeit- und
                  kulturgeschichtlich von höchster Relevanz, weil er selbst sich als Grenzgänger
                  zwischen Geschichtsschreibung und Literatur verstand. Wissenschafts-, Insbesondere
                  die weitgehend vollständig überlieferten Verlags-Briefe an und von Cotta sowie die
                  an Brockhaus erlauben einen konkreten Einblick in die Werkstatt dieses außerhalb
                  akademischer Strukturen schreibenden Historikers. Die Briefe dieses kritischen
                  Beobachters seiner Gegenwart ergänzen, begleiten und kommentieren gewissermaßen
                  seine Tagebuch-Aufzeichnungen, die eine Standardquelle des Risorgimento sind. Sie
                  zeigen sein transnationales Netzwerk mit Gelehrten, Schriftstellern, Journalisten,
                  Künstlern, Verlegern, Standespersonen, Freunden und Familienmitgliedern. – Vor dem
                  Hintergrund der Korrespondenz lässt sich über vierzig Jahre sein Selbstverständnis
                  als Gelehrter, als Philologe und als Schriftsteller sowie als Geschichtsschreiber
                  verfolgen, aber auch das Verhältnis von Zunft- und Privatgelehrtentum und die
                  Interferenzen von wissenschaftlicher Forschung und Zeitzeugenschaft.
                </p>
                <figure class="row justify-center">
                  <picture>
                    <img class="g-project-img" src="@/statics/img/colonna-bsb.jpg" />
                  </picture>
                  <figcaption class="text-caption">
                    Rom aus dem Garten der Colonna, Bleistift-Zeichnung von F. Gregorovius, BSB
                    München, Nachlass F. Gregorovius, Gregoroviusiana 11, Blatt 39
                  </figcaption>
                </figure>
                <p>
                  Auf der Basis einer systematischen Recherche in deutschen und italienischen
                  Archiven konnten bislang rund 3130 Briefe <b>von</b> und <b>an</b> Gregorovius in
                  etwa 50 Archiven und privaten Sammlungen nachgewiesen werden – die weitaus meisten
                  davon unpubliziert. Die „Gesammelten deutschen und italienischen Briefe“
                  erschließen eine repräsentative Auswahl von etwa 1000 Briefen von Ferdinand
                  Gregorovius als kritische digitale Edition in der jeweiligen Originalsprache mit
                  umfassenden Kommentaren. Die Metadaten <b>aller</b> Briefe <b>von</b> und
                  <b>an</b> Gregorovius wurden und werden in einer internen Datenbank erfasst, die
                  zum Projektende veröffentlicht wird. Die edierten Briefe werden, wo die
                  bestandshaltenden Sammlungen dies erlauben, nach und nach auch als digitale
                  Faksimiles der Originalhandschrift veröffentlicht. Die inhaltliche Erschließung
                  der Briefe erfolgt zusätzlich durch Regesten in Deutsch und Englisch.
                  Editionsarbeit und Kommentar stützen sich auf eine über viele Jahre entstandene
                  Personalbibliographie und ein gleichzeitig angelegtes Quellenarchiv, in dem neben
                  den gedruckten Briefen von und an Gregorovius auch erstmals das gesamte, oft
                  anonym in Periodika publizierte Werk, die Übersetzungen und die vollständige
                  Forschungsliteratur (inklusive zeitgenössischer Rezensionen) nachgewiesen und
                  zusammengetragen wurde.
                </p>
                <p class="text-bold">
                  Der aktuelle Stand der Arbeit an den Texten und Datensätzen wird als
                  <span class="text-green">Betaversion</span>
                  präsentiert, die in regelmäßigen Abständen aktualisiert und in den
                  Funktionalitäten weiterentwickelt wird.
                </p>
                <p>
                  Das Projekt des Deutschen Historischen Instituts in Rom wird seit 2017 von der
                  Deutschen Forschungsgemeinschaft (DFG) gefördert. Die digitale Erarbeitung der
                  Briefe findet in Zusammenarbeit mit der Berlin-Brandenburgischen Akademie der
                  Wissenschaften statt. Zudem wird das Projekt seit 2018 von der Gerda Henkel
                  Stiftung großzügig unterstützt.
                </p>
                <p>
                  Von Dr. Wiebke Fastenrath Vinattieri stammen die Rohtranskriptionen der Briefe von
                  Ferdinand Gregorovius an Michele Amari (20.10.1862 bis 7.4.1889), Guido Biagi
                  (2.11.1887), Angelo De Gubernatis (11.11.1883, 9.6.1884), Giuseppe De Leva
                  (29.7.1868, 21.8.1884, 12.10.1884, 26.12.1886), Emilia Viola Ferretti (4.5.1874,
                  28.6.1884), Tommaso Gar (25.8.1864 bis 4.6.1871), Raffaele Mariano (21.7.1873 bis
                  8.12.1877 und 30.11.1879), Ferdinand Martini (22.5.1885), Francesco Protonotari
                  (8.12.1872, 12.7.1874), Gustavo Strafforello (25.9.1858), Oreste Tommasini
                  (23.9.1877, 29.9.1877) und Filippo Zamboni (26.2.1876). Textherstellung und
                  Stellenkommentare vieler italienischer Briefe wurden von Dr. Frederike Neuber, Dr.
                  Katharina Weiger und Dr. Anna Maria Voci übernommen. Die jeweiligen
                  Zuständigkeiten sind in den einzelnen Briefen als Zitierhinweise angegeben. Anna
                  Maria Voci hat zudem sämtliche Transkriptionen der italienisch-sprachigen Briefe
                  an den Handschriften überprüft, wofür ihr an dieser Stelle noch einmal ein ganz
                  besonderer Dank ausgesprochen sei. Die technische Umsetzung der Edition lag in den
                  ersten zwei Jahren in den Händen von Theodor Costea, M. A. Die Weiterentwicklung
                  der Website verantwortet jetzt Oliver Pohl, M. A. Von Marlene Compton, M. A.
                  stammen die englischen (amerikanischen) Übersetzungen der Regesten. Eric Müller
                  und Raphael Stepken haben als wissenschaftliche Hilfskraft wesentliche, die
                  Edition vorbereitende und begleitende Arbeiten übernommen.
                </p>
              </div>
            </q-tab-panel>
            <q-tab-panel name="tec">
              <div class="text-body1">
                <p>
                  Die Dateneingabe erfolgt in Oxygen mit Hilfe von
                  <a href="http://www.bbaw.de/telota/software/ediarum">ediarum</a>. Das
                  ediarum.BASE-Framework wurde durch ein Addon ergänzt. Es wird laufend
                  weiterentwickelt und ermöglicht, komplexe projektspezifische Datenstrukturen über
                  eine benutzerfreundliche und für die Briefedition maßgeschneiderte Softwarelösung
                  einzugeben. Das TEI XML Datenmodell der Edition basiert zum Teil auf dem
                  <a href="http://www.deutschestextarchiv.de/doku/basisformat/"
                    >Basisformat des Deutschen Textarchivs (DTABf)</a
                  >, ein von der DFG empfohlener datentechnischer Standard. Die vorliegende Web-App
                  wurde auf Frontend-Ebene mit <a href="https://vuejs.org/">Vue.js</a> und
                  <a href="https://quasar.dev/">Quasar</a> gebaut. Die Daten werden in
                  <a href="https://exist-db.org/">eXist-db</a> gehalten und über ein Python- und
                  <a href="https://fastapi.tiangolo.com/">FastAPI</a>-basiertes Backend als
                  REST-Schnittstelle ausgegeben. Die Schnittstelle ist im OpenAPI-Format
                  <a href="http://gregorovius-edition.dhi-roma.it/api/docs">dokumentiert</a> und
                  steht interessierten NutzerInnen und EntwicklerInnen als Webservice zur Verfügung.
                </p>
                <p>
                  Weiterhin liegt eine
                  <a href="https://de.wikipedia.org/wiki/Wikipedia:BEACON">BEACON</a>-Schnittstelle
                  vor, welche eine Referenzliste aller mit einer
                  <a href="https://www.dnb.de/DE/Professionell/Standardisierung/GND/gnd_node.html"
                    >GND </a
                  >identifizierten Entitäten im Personenregister bereitstellt. Die
                  BEACON-Schnittstelle liegt vor für:
                </p>
                <ul>
                  <li>
                    <a href="https://gregorovius-edition.dhi-roma.it/api/beacon/all"
                      >Personen und Körperschaften</a
                    >
                  </li>
                  <li>
                    <a href="https://gregorovius-edition.dhi-roma.it/api/beacon/persons"
                      >Nur Personen</a
                    >
                  </li>
                  <li>
                    <a href="https://gregorovius-edition.dhi-roma.it/api/beacon/organizations"
                      >Nur Körperschaften</a
                    >
                  </li>
                </ul>
                <p>
                  Die Edition bezieht Daten vom
                  <a href="https://beacon.findbuch.de/">BEACON Findbuch</a>, um die Personen und
                  Körperschaften im Personenregister mit Referenzen in weiteren Datenquellen
                  anzureichern.
                </p>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "Project",
  data() {
    return {
      tab: "edi"
    };
  }
};
</script>

<style scoped>
.g-project-img {
  max-width: 100%;
}
a {
  text-decoration: none;
}
</style>
