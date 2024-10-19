<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-md-8 col-12 q-py-xl q-gutter-y-lg">
        <q-card
          class="q-pa-xl"
          flat
        >
          <q-card-section>
            <div class="text-h6 text-center">Das Projekt</div>
            <div class="text-subtitle3 text-secondary"></div>
          </q-card-section>
          <q-separator dark />
          <q-tabs
            v-model="tab"
            class="text-primary"
          >
            <q-tab
              name="edi"
              label="Zur Edition"
            />
            <q-tab
              name="tec"
              label="Eingesetzte Technologien"
            />
          </q-tabs>
          <q-separator />
          <q-tab-panels
            v-model="tab"
            animated
          >
            <q-tab-panel
              name="edi"
              class="text"
            >
              <div class="text-body1">
                <p>
                  Die Briefe des Historikers und Schriftstellers Ferdinand Gregorovius (1821–1891)
                  in einem größeren Zusammenhang zu veröffentlichen und wissenschaftlich zu
                  erschließen, war in vielerlei Hinsicht eines der großen Desiderata für die
                  Geschichts- wie für die Literaturwissenschaft. Ist Gregorovius doch einer der
                  wichtigsten Historiker des 19. Jahrhunderts im deutsch-italienischen Kontext, der
                  1852 aus Ostpreußen nach Italien ging und nach mehr als zwanzig Jahren hoch
                  geehrter deutsch-italienischer Historiker und Erfolgsautor nach Deutschland
                  zurückkehrte. Auch wenn Gregorovius vor seinem Tod viele der Briefe an ihn
                  vernichtet hat und viele seiner Korrespondenten veranlasst hat, die Briefe von ihm
                  zu verbrennen, haben sich mehrere Tausend Briefe erhalten. Das Forschungsprojekt
                  erschließt rund 1.100 zuvor in der großen Mehrzahl unedierte deutsche und
                  italienische Briefe der Jahre 1852 bis 1891. Sie relativieren und korrigieren
                  frühere Forschungsergebnisse und geben Anlass zu zahlreichen neuen
                  Fragestellungen.
                </p>
                <p>
                  In seiner Korrespondenz lässt sich sein Aufstieg zum Erfolgsautor verfolgen, mit
                  dem Aufbau seines internationalen Gelehrtennetzwerks zudem seine Entwicklung vom
                  Schriftsteller zum Historiker. Für sein achtbändiges Hauptwerk, die „Geschichte
                  der Stadt Rom im Mittelalter“, wurde er 1876 zum römischen Ehrenbürger ernannt.
                  Für Gregorovius, der sich selbst vor allem als Schriftsteller verstand, war Klio
                  eine Muse. Er war als Historiker Schriftsteller und als Reiseschriftsteller,
                  Romancier, Dramatiker und Lyriker auch immer Historiker. Dabei war Gregorovius
                  auch ohne einen Lehrstuhl, der ihm mehrfach erfolglos angeboten wurde, bereits vor
                  dem Abschluss seines Hauptwerks hochangesehenes Mitglied der Bayerischen Akademie
                  der Wissenschaften und der namhaftesten italienischen Akademien – und er wurde
                  regelmäßig von Verlagen um Gutachten und von Gelehrten um Expertisen zu aktuellen
                  Fachfragen ersucht. Seine in den Briefen verhandelte Methodik als Historiker wie
                  als Philologe ist oft von staunenswerter Modernität, sein zeitpolitisches Urteil
                  hochreflektiert. Seine Briefe begleiten und kommentieren seine
                  Tagebuch-Aufzeichnungen, die eine Standardquelle des Risorgimento sind, das
                  Gregorovius als Hegel-Schüler zweiter Generation und enttäuschter Revolutionär vor
                  dem Hintergrund der deutschen Reichgründung verfolgte.
                </p>
                <p>
                  Als frei schaffender Autor wählte Gregorovius seine Publikationsorgane und Verlage
                  mit Bedacht und verhandelte seine Verlagsverträge bis ins Kleinste mit großem
                  Geschäftssinn und äußerster Hartnäckigkeit. Eine repräsentative Auswahl seiner
                  umfangreichen Verlagskorrespondenz mit Cotta liegt nun ungekürzt und unter
                  Berücksichtigung der Gegenbriefe vor – im Erstdruck (1921) waren die Briefe
                  einseitig sowie regelmäßig um die finanziellen und persönlichen Angelegenheiten
                  gekürzt veröffentlicht worden. Zusammen mit den erstmals edierten Briefen an den
                  F. A. Brockhaus Verlag und den italienischen Verlagsbriefen geben sie mit den für
                  die Kommentare herangezogenen Gegenbriefen einen detaillierten Einblick in
                  Entstehung und Produktionsbedingungen seiner großen Werke wie kleiner Schriften
                  sowie von deren Übersetzungen. Gemeinsam mit der Korrespondenz aus der
                  Personalakte des preußischen und italienischen Kulturministeriums liefern sie
                  überraschende Einblicke in die Verlagsarbeit und die Kulturpolitik von der Mitte
                  bis zum Ende des 19. Jahrhunderts.
                </p>

                <p>
                  Die vorliegende Briefedition erschließt mit ausführlichen wissenschaftlichen
                  Kommentaren viele neue Facetten des 19. Jahrhunderts: Seine Korrespondenzen mit
                  Gelehrten, Adeligen, Politikern, Schriftstellern, Künstlern, Übersetzern,
                  Verlegern, Familie und Freunden, darunter auch die Briefe von seiner Orientreise
                  im Jahr 1882, stellen ein einzigartiges Dokument der europäischen Zeit-, Kultur-,
                  Verlags- und Wissenschaftsgeschichte dar.
                </p>

                <figure class="row justify-center">
                  <picture>
                    <img
                      class="g-project-img"
                      src="@/statics/img/colonna-bsb.jpg"
                    />
                  </picture>
                  <figcaption class="text-caption">
                    Rom aus dem Garten der Colonna, Bleistift-Zeichnung von F. Gregorovius, BSB
                    München, Nachlass F. Gregorovius, Gregoroviusiana 11, Blatt 39
                  </figcaption>
                </figure>
                <p>
                  Auf der Basis systematischer Recherchen, insbesondere in deutschen und
                  italienischen Archiven, konnten inklusive der nur im Druck überlieferten Schreiben
                  mehr als 3.340 Briefe <b>von</b> und <b>an</b> Gregorovius in nahezu 90 Archiven und (privaten)
                  Sammlungen nachgewiesen werden (Stand Dezember 2023) – die weitaus meisten davon
                  unpubliziert. Die „Gesammelten deutschen und italienischen Briefe“ erschließen
                  eine repräsentative Auswahl von rund 1.100 Briefen von Ferdinand Gregorovius als
                  kritische digitale Edition in der jeweiligen Originalsprache mit umfassenden
                  Kommentaren, für die ggf. auch die Gegenbriefe und die nicht edierten Briefe
                  herangezogen wurden. Die edierten Briefe sind, wo die bestandshaltenden Archive
                  und Besitzer dies erlauben, durch digitale Faksimiles der Handschriften ergänzt.
                  Die inhaltliche Erschließung der Briefe erfolgt neben den Kommentaren und
                  verschiedenen Registern (inkl. Normdaten) zusätzlich durch Regesten in Deutsch und
                  Englisch.
                </p>
                <p>
                  Ergänzend und begleitend zur Edition wurde eine durchsuchbare „Gesamtdatenbank der
                  Korrespondenz“ erarbeitet und auf der Website veröffentlicht, die die Metadaten
                  aller weltweit ermittelten Briefe <b>von</b> und <b>an</b> Gregorovius mit Aufbewahrungsorten
                  und ggf. mit allen Drucken nachweist. Editionsarbeit, Kommentar und
                  Gesamtdatenbank stützen sich auf eine über viele Jahre entstandene
                  Personalbibliographie und ein gleichzeitig angelegtes Quellenarchiv der
                  Projektleiterin Dr. Angela Steinsiek, in dem neben den gedruckten Briefen von und
                  an Gregorovius auch erstmals das gesamte, oft anonym in Periodika publizierte
                  Werk, die Übersetzungen und die vollständige Forschungsliteratur (inklusive
                  zeitgenössischer Rezensionen) nachgewiesen und zusammengetragen wurde. Es konnte
                  durch die Erkenntnisse aus der Erarbeitung der Briefedition noch einmal wesentlich
                  erweitert werden.
                </p>
                <p><b>Feedback</b></p>
                <p>
                  <b>
                    Hinweise und Ergänzungen zur digitalen Edition und zu den Datenbeständen werden
                    dankbar entgegengenommen. Bitte schreiben Sie an
                    <a href="mailto:angela.steinsiek@posteo.de">
                      angela.steinsiek@posteo.de
                    </a>
                  </b>
                </p>
                <p>
                  Das Projekt des Deutschen Historischen Instituts in Rom wurde von der
                  Projektleiterin Dr. Angela Steinsiek zusammen Professor Dr. Martin Baumeister, dem
                  Institutsdirektor, initiiert. 2017 bis 2023 wurde es von der Deutschen
                  Forschungsgemeinschaft (DFG) finanziert. Die digitale Präsentation der Briefe fand
                  in den ersten zwei Jahren in Zusammenarbeit mit der Berlin-Brandenburgischen
                  Akademie der Wissenschaften statt. Zudem wurde das Projekt 2018 bis 2023 von der
                  Gerda Henkel Stiftung großzügig gefördert.
                </p>
                <p>
                  Im ersten Projektjahr wurden von Dr. Wiebke Fastenrath Vinattieri
                  Rohtranskriptionen von rund 100 Briefen von Gregorovius an italienische
                  Korrespondenten erstellt. Textherstellung und Stellenkommentare vieler
                  italienischer Briefe wurden von Dr. Frederike Neuber, Dr. Katharina Weiger und Dr.
                  Anna Maria Voci übernommen. Die jeweiligen Zuständigkeiten sind in den einzelnen
                  Briefen angegeben und in den Zitierhinweisen hinterlegt. Anna Maria Voci hat zudem
                  sämtliche Transkriptionen der italienisch-sprachigen Briefe an den Handschriften
                  überprüft, wofür ihr an dieser Stelle noch einmal ein ganz besonderer Dank
                  ausgesprochen sei. Die technische Umsetzung der Edition lag in den ersten zwei
                  Jahren in den Händen von Theodor Costea, M. A. Die Weiterentwicklung und
                  endgültige Gestaltung der Website hat Oliver Pohl, M. A. umgesetzt. Von Marlene
                  Compton, M. A. stammen die englischen (amerikanischen) Übersetzungen der Regesten.
                  Eric Müller, M. A. und Raphael Stepken, B. A. haben als wissenschaftliche
                  Hilfskraft die Edition vorbereitende und begleitende Arbeiten übernommen. Ab
                  September 2020 hat Mariana Ramazzotti, M. A. als wissenschaftliche Hilfskraft die
                  Projektarbeit in allen Belangen mit Engagement unterstützt.
                </p>
              </div>
            </q-tab-panel>
            <q-tab-panel name="tec">
              <div class="text-body1">
                <p>
                  Die Dateneingabe erfolgte in Oxygen mit Hilfe von
                  <a href="http://www.bbaw.de/telota/software/ediarum">ediarum</a>. Das
                  ediarum.BASE-Framework wurde durch ein Addon ergänzt. Es wurde laufend
                  weiterentwickelt und ermöglichte, komplexe projektspezifische Datenstrukturen über
                  eine benutzerfreundliche und für die Briefedition maßgeschneiderte Softwarelösung
                  einzugeben. Das TEI XML Datenmodell der Edition basiert zum Teil auf dem
                  <a href="http://www.deutschestextarchiv.de/doku/basisformat/">Basisformat des
                    Deutschen Textarchivs (DTABf)</a
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
                  <a
                    href="https://www.dnb.de/DE/Professionell/Standardisierung/GND/gnd_node.html"
                  >GND </a
                  >identifizierten Entitäten im Personenregister bereitstellt. Die
                  BEACON-Schnittstelle liegt vor für:
                </p>
                <ul>
                  <li>
                    <a
                      href="https://gregorovius-edition.dhi-roma.it/api/beacon/all"
                    >Personen und Körperschaften</a
                    >
                  </li>
                  <li>
                    <a
                      href="https://gregorovius-edition.dhi-roma.it/api/beacon/persons"
                    >Nur Personen</a
                    >
                  </li>
                  <li>
                    <a
                      href="https://gregorovius-edition.dhi-roma.it/api/beacon/organizations"
                    >Nur Körperschaften</a
                    >
                  </li>
                </ul>
                <p>
                  Die Edition bezieht Daten vom
                  <a href="https://beacon.findbuch.de/seealso/pnd-aks">BEACON Findbuch</a>, um die
                  Personen und Körperschaften im Personenregister mit Referenzen in weiteren
                  Datenquellen anzureichern.
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
