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
                  1876 die römische Ehrenbürgerwürde einbrachte. Neben seinem historiographischen
                  und schriftstellerischen Œuvre hat er mehrere Tausend Briefe hinterlassen, in
                  denen er als Zeitzeuge die italienische und die deutsche Wissenschafts-, Zeit- und
                  Kulturgeschichte des 19. Jahrhunderts beleuchtet. Da die Verlags-Briefe an und von
                  Cotta sowie die an Brockhaus nahezu vollständig erhalten sind, erlauben diese
                  einen konkreten Blick auf die Arbeitsbedingungen und in die Werkstatt eines
                  außerhalb der akademischen Historiographie schreibenden Privatgelehrten und sind
                  damit wissenschaftsgeschichtlich von höchster Relevanz.
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
                  Archiven konnten insgesamt etwa 3000 Briefe <b>von</b> und <b>an</b> Gregorovius
                  in etwa 50 Archiven und privaten Sammlungen nachgewiesen werden – die weitaus
                  meisten davon unpubliziert. Die „Gesammelten deutschen und italienischen Briefe“
                  erschließen eine repräsentative Auswahl von 600 bis 700 Briefen von Ferdinand
                  Gregorovius als kritische digitale Edition in der jeweiligen Originalsprache mit
                  umfassenden Kommentaren. Die Metadaten <b>aller</b> Briefe wurden in einer
                  Projektdatenbank erfasst. Die edierten Briefe werden, wo die bestandshaltenden
                  Sammlungen dies erlauben, nach und nach auch als digitale Faksimiles der
                  Originalhandschrift veröffentlicht. Die inhaltliche Erschließung der Briefe
                  erfolgt zusätzlich durch Regesten in Deutsch, Italienisch und Englisch.
                  Editionsarbeit und Kommentar stützen sich auf eine über viele Jahre entstandene
                  Personalbibliographie und ein gleichzeitig angelegtes Quellenarchiv, in dem neben
                  den gedruckten Briefen von und an Gregorovius auch erstmals das gesamte, oft
                  anonym in Periodika publizierte Werk, die Übersetzungen und die vollständige
                  Forschungsliteratur (inklusive zeitgenössischer Rezensionen) nachgewiesen und
                  zusammengetragen wurde.
                </p>
                <p class="text-bold">
                  Der aktuelle Stand der Arbeit an den Texten und Datensätzen wird als Betaversion
                  präsentiert, die in regelmäßigen Abständen aktualisiert und in den
                  Funktionalitäten weiterentwickelt wird.
                </p>
                <p>
                  Das auf eine Laufzeit von vier Jahren angelegte Projekt des Deutschen Historischen
                  Instituts in Rom wird seit 2017 von der Deutschen Forschungsgemeinschaft (DFG)
                  gefördert. Die digitale Erarbeitung der Briefe findet in Zusammenarbeit mit der
                  Berlin-Brandenburgischen Akademie der Wissenschaften statt. Zudem wird das Projekt
                  seit 2018 für die Dauer von drei Jahren von der Gerda Henkel Stiftung großzügig
                  unterstützt.
                </p>
                <p>
                  Von Dr. Wiebke Fastenrath Vinattieri stammen Rohtranskriptionen und erste
                  Kommentargrundlagen der Briefe von Gregorovius an Michele Amari (11.7.1863 bis
                  7.7.1872), Emilia Viola Ferretti, Raffaele Mariano (21.7.1873 bis 8.12.1877 und
                  30.11.1879), Oreste Tommasini, Tommaso Gar und an Gustavo Strafforello. Frederike
                  Neuber verantwortet die Textherstellung und die Kommentare dieser Briefe. Die
                  Rohtranskriptionen der Briefe von Gregorovius an Aleardo Aleardi, Angelo de
                  Gubernatis, Giuseppe De Leva, Ferdinand Martini, Francesco Protonotari und an
                  Filippo Zamboni erstellte ebenfalls Dr. Wiebke Fastenrath-Vinattieri. Eric Müller
                  hat als wissenschaftliche Hilfskraft wesentliche, die Edition vorbereitende
                  Arbeiten übernommen.
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
                  <a href="https://exist-db.org/">eXist-db</a> gehalten und über ein
                  Python-basiertes Backend als REST-Schnittstelle ausgegeben. Die Schnittstelle ist
                  im OpenAPI-Format
                  <a href="http://gregorovius-edition.dhi-roma.it/api/docs">dokumentiert</a> und
                  steht interessierten NutzerInnen und EntwicklerInnen als Webservice zur Verfügung.
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
