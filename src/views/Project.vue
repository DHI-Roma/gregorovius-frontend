<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-md-8 col-12 q-py-xl q-gutter-y-lg">
        <q-card class="q-pa-xl" flat>
          <q-card-section>
            <div class="text-h6 text-center">Das Projekt</div>
            <div class="text-subtitle3 text-secondary"></div>
          </q-card-section>
          <q-separator dark/>
          <q-tabs v-model="tab" class="text-primary">
            <q-tab name="edi" label="Zur Edition"/>
            <q-tab name="tec" label="Eingesetzte Technologien"/>
          </q-tabs>
          <q-separator/>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="edi" class="text">
              <div class="text-body1">
                <p>
                  Ferdinand Gregorovius hat mehr als zwanzig Jahre in Rom gelebt und hier sein
                  Hauptwerk, die „Geschichte der Stadt Rom im Mittelalter“, geschrieben, das ihm
                  1876 die römische Ehrenbürgerwürde einbrachte. Auch wenn Gregorovius vor seinem
                  Tod viele der Briefe <b>an ihn</b> vernichtet hat und viele seiner vertrauten
                  Freunde veranlasst hat, seine Briefe <b>von ihm</b> zu vernichten, haben sich
                  neben seinem historiographischen und schriftstellerischen Œuvre mehrere Tausend
                  Briefe erhalten. Das Gregorovius-Briefkorpus ist wissenschafts-, zeit- und
                  kulturgeschichtlich von höchster Relevanz, weil er selbst sich als Grenzgänger
                  zwischen Geschichtsschreibung und Literatur verstand. Insbesondere die weitgehend
                  vollständig überlieferten Verlags-Briefe an und von Cotta sowie die an Brockhaus
                  erlauben einen konkreten Einblick in die Werkstatt dieses außerhalb akademischer
                  Strukturen schreibenden Historikers. Die Briefe dieses kritischen Beobachters
                  seiner Gegenwart ergänzen, begleiten und kommentieren gewissermaßen seine
                  Tagebuch-Aufzeichnungen, die eine Standardquelle des Risorgimento sind. Sie zeigen
                  sein transnationales Netzwerk mit Gelehrten, Schriftstellern, Journalisten,
                  Künstlern, Verlegern, Standespersonen, Freunden und Familienmitgliedern. – Vor dem
                  Hintergrund der Korrespondenz lässt sich über vierzig Jahre sein Selbstverständnis
                  als Gelehrter, als Philologe und als Schriftsteller sowie als Geschichtsschreiber
                  verfolgen, aber auch das Verhältnis von Zunft- und Privatgelehrtentum und die
                  Interferenzen von wissenschaftlicher Forschung und Zeitzeugenschaft.
                </p>
                <figure class="row justify-center">
                  <picture>
                    <img class="g-project-img" src="@/statics/img/colonna-bsb.jpg"/>
                  </picture>
                  <figcaption class="text-caption">
                    Rom aus dem Garten der Colonna, Bleistift-Zeichnung von F. Gregorovius, BSB
                    München, Nachlass F. Gregorovius, Gregoroviusiana 11, Blatt 39
                  </figcaption>
                </figure>
                <p>
                  Auf Basis systematischen Recherchen in deutschen und italienischen Archiven
                  konnten, neben zahlreichen nur im Druck überlieferten Schreiben, bislang mehr als
                  3300 Briefe <b>von</b> und <b>an</b> Gregorovius in nahezu 90 Archiven und (privaten) Sammlungen
                  nachgewiesen werden (siehe unten) – die weitaus meisten davon unpubliziert. Die
                  „Gesammelten deutschen und italienischen Briefe“ erschließen eine repräsentative
                  Auswahl von etwa 1000 Briefen von Ferdinand Gregorovius als kritische digitale
                  Edition in der jeweiligen Originalsprache mit umfassenden Kommentaren. Die
                  Metadaten <b>aller</b> Briefe <b>von</b> und <b>an</b> Gregorovius wurden und werden in
                  einer internen
                  Datenbank erfasst, die zum Projektende veröffentlicht wird. Die edierten Briefe
                  werden, wo die bestandshaltenden Sammlungen dies erlauben, nach und nach auch als
                  digitale Faksimiles der Originalhandschrift veröffentlicht. Die inhaltliche
                  Erschließung der Briefe erfolgt neben den Kommentaren zusätzlich durch Regesten in
                  Deutsch und Englisch. Editionsarbeit und Kommentar stützen sich auf eine über
                  viele Jahre entstandene Personalbibliographie und ein gleichzeitig angelegtes
                  Quellenarchiv der Projektleiterin Angela Steinsiek, in dem neben den gedruckten
                  Briefen von und an Gregorovius auch erstmals das gesamte, oft anonym in Periodika
                  publizierte Werk, die Übersetzungen und die vollständige Forschungsliteratur
                  (inklusive zeitgenössischer Rezensionen) nachgewiesen und zusammengetragen wurde.
                </p>
                <p class="text-bold">
                  Der aktuelle Stand der Arbeit an den Texten und Datensätzen wird als
                  <span class="text-green">Betaversion</span>
                  präsentiert, die in regelmäßigen Abständen aktualisiert und in den
                  Funktionalitäten weiterentwickelt wird.
                </p>
                <p>
                  Das Projekt des Deutschen Historischen Instituts in Rom wurde von dem
                  Institutsdirektor Professor Dr. Martin Baumeister initiiert, der es zusammen mit
                  Dr. Angela Steinsiek verantwortet. Seit 2017 wird es von der Deutschen
                  Forschungsgemeinschaft (DFG) gefördert. Die digitale Erarbeitung der Briefe findet
                  in Zusammenarbeit mit der Berlin-Brandenburgischen Akademie der Wissenschaften
                  statt. Zudem wird das Projekt seit 2018 von der Gerda Henkel Stiftung großzügig
                  unterstützt.
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
                  stammen die englischen (amerikanischen) Übersetzungen der Regesten.
                  Eric Müller, M. A. und Raphael Stepken haben als wissenschaftliche Hilfskraft
                  wesentliche, die Edition vorbereitende und begleitende Arbeiten übernommen.
                </p>
                <p>
                  Handschriftlich überlieferte Briefe <b>von</b> und <b>an</b> Gregorovius konnten in folgenden
                  Institutionen und Sammlungen nachgewiesen werden: Universitätsbibliothek
                  Amsterdam, Staatsbibliothek Bamberg, Privatbesitz, Erbengemeinschaft Wilhelm
                  (Basel), Universitätsbibliothek Basel, Ateneo di Scienze Lettere ed Arti di
                  Bergamo, Archiv der Berlin-Brandenburgischen Akademie der Wissenschaften,
                  Bundesarchiv Berlin, Deutsches Historisches Museum (Berlin), Geheimes Staatsarchiv
                  Berlin, Privatbesitz Angela Steinsiek (Berlin), Staatsbibliothek zu Berlin – PK,
                  Fondazione Sella (Biella), Heimatstube der Kreisgemeinschaft Neidenburg (Bochum),
                  Biblioteca dell’Archiginnasio (Bologna), Archivio della Deputazione di Storia
                  Patria per le Province di Romagna (Bologna), Universitäts- und Landesbibliothek
                  Bonn, Landesarchiv Nordrhein-Westfalen (Detmold), Sächsische Landesbibliothek –
                  Staats- und Universitätsbibliothek Dresden, Archivio di Stato di Firenze,
                  Biblioteca Nazionale Centrale di Firenze, Florenz, Privatarchiv Anrep (Florenz),
                  Universitätsbibliothek Johann Christian Senckenberg (Frankfurt), Bibliothèque de
                  Genève, Biblioteca-Civica „Vincenzo Bindi“ (Giulianova), Universitätsbibliothek
                  Greifswald, Staats- und Universitätsbibliothek Hamburg Carl von Ossietzky,
                  Stadtarchiv Hannover, Universitätsbibliothek Heidelberg, Biblioteca Comunale di
                  Imola, Generallandesarchiv Karlsruhe (Großherzogliches Familienarchiv), Museum für
                  Literatur am Oberrhein (Karlsruhe), Schleswig-Holsteinische Landesbibliothek Kiel,
                  Historisches Archiv Köln, Privatbesitz Klaus Bergdolt (Köln), Biblioteka
                  Jagiellońska Krakau (SBB-PK), Biblioteca Provinciale „Nicola Bernardini“ (Lecce),
                  Sächsisches Staatsarchiv Leipzig, Universitätsbibliothek Leipzig, Getty Research
                  Institute, Research Library (Los Angeles, CA), University of Southern California,
                  Lion Feuchtwanger papers (Los Angeles, CA), Ostpreußisches Landesmuseum
                  (Lüneburg), Archivio generale im Museo del Risorgimento (Mailand), Stadtbibliothek
                  Mainz, Deutsches Literaturarchiv Marbach, Hessisches Staatsarchiv Marburg,
                  Archivio dell’Abbazia (Montecassino), Bayerische Staatsbibliothek München,
                  Monacensia im Hildebrandhaus (München), Städtische Galerie im Lenbachhaus und
                  Kunstbau München, Privatbesitz Familie Peter Freude (Murnau am Staffelsee),
                  Archivio di Stato di Napoli, Biblioteca Nazionale Vittorio Emanuele III. (Neapel),
                  Yale University Library (New Haven, CT), Pierpont Morgan Library (Manhattan, NYC),
                  Germanisches Nationalmuseum Nürnberg, Sezione di Archivio di Stato di Orvieto
                  Crispino Ferri, Biblioteca Civica (Padua), Biblioteca Centrale della Regione
                  siciliana (Palermo), Biblioteca Oliveriana (Pesaro), Archives nationales
                  (Pierrefitte-sur-Seine), Biblioteca Roncioniana Prato, Stadtarchiv Schweinfurt,
                  Istitutione Biblioteca Classense del Comune di Ravenna, Archivio Accademico della
                  Accademia di San Luca (Rom), Archivio Camillo Caetani (Rom), Archivio Centrale
                  dello Stato (Rom), Archivio Storico Capitolino di Roma, Archivio Segreto Vaticano
                  (Rom), Biblioteca Apostolica Vaticana (Rom), Biblioteca Vallicelliana (Rom),
                  Deutsches Archäologisches Institut Rom, Städtisches Museum Schärding am Inn,
                  Mecklenburgisches Landeshauptarchiv Schwerin, Kantonsbibliothek Vadiana St.
                  Gallen, Württembergische Landesbibliothek Stuttgart, Archivio di Stato di Terni,
                  Archivio Storico dell’Accademia delle Scienze di Torino, Biblioteca Comunale di
                  Trento, Universitätsbibliothek Tübingen, Biblioteca Civica di Verona, Goethe- und
                  Schiller-Archiv Weimar, Landesarchiv Thüringen – Hauptstaatsarchiv Weimar
                  (Großherzogliches Hausarchiv), Österreichische Nationalbibliothek (Wien),
                  Wienbibliothek im Rathaus, Herzog-August-Bibliothek Wolfenbüttel,
                  Niedersächsisches Landesarchiv (Wolfenbüttel), Universität Würzburg,
                  Martin-von-Wagner-Museum.
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
