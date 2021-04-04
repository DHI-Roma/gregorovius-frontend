Die inhaltliche Erschließung der edierten Briefe erfolgt neben den [Sachanmerkungen](../sachanmerkung) und den [Regesten](../regest) durch ein Personenregister, ein Körperschaftenregister, ein Ortsregister und je ein Werkregister für die Werke von Gregorovius, für die Sekundärliteratur, für die Werke anderer Autoren sowie für zeitgenössische Quellenschriften (z. B. Pressemitteilungen).

## Personenregister

Die in der Gregorovius-Korrespondenz vorherrschende Schreibung von Personennamen bleibt in der Regel gewahrt.
Bei schwankender Schreibung werden Alternativschreibungen im Register mit aufgenommen (z. B. *Caetani*/*Gaetani*).
Die Namensangabe bei Frauen erfolgt nach dem letzten Personenstand (z. B. *Ottilie Gregorovius*, verh. *Elgnowski* unter *Elgnowski*); der Geburtsname wird zusätzlich aufgenommen:

```xml
<person xml:id="ed_o11_xfh_ikp">
    <idno type="uri">http://d-nb.info/gnd/116447591</idno>
    <persName type="reg">
        <surname>Elgnowski</surname>
        <forename>Ottilie</forename>
    </persName>
    <persName type="alt" subtype="birthname">
        <name>Gregorovius (bis 1855)</name>
    </persName>
    <birth>1834</birth>
    <death>1907</death>
</person>
```

Bei Angehörigen adliger Familien wird analog dazu der letzte geltende Titel genannt (z.B. *Arnim-Suckow, Harry Graf (ab 1870) von*, der zuvor geltende Name/Titel wird ggf. als Alternativname dokumentiert: *Arnim-Suckow, Harry von*):

```xml
<person xml:id="ed_pjr_p1z_m3b">
    <persName type="reg">
        <surname>Arnim-Suckow</surname>
        <forename>Harry Graf (ab 1870) von</forename>
    </persName>
    <persName type="alt">
        <surname>Arnim-Suckow</surname>
        <forename>Harry von</forename>
    </persName>
    <birth>1824</birth>
    <death>1881</death>
</person>
```

Regierende Herzöge und Fürsten werden unter ihrem Vornamen und der Angabe des Landes geführt (z. B. *Friedrich VIII., Herzog von Schleswig-Holstein*):

```xml
<person xml:id="ed_gqz_mjg_kgb">
    <idno type="uri">http://d-nb.info/gnd/121410013</idno>
    <persName type="reg">
        <name>Friedrich VIII.</name>
        <roleName>Herzog von Schleswig-Holstein</roleName>
    </persName>
    <birth>1829</birth>
    <death>1880</death>
</person>
```

Italienische Herzöge und Fürsten werden nach der italienischen Konvention unter ihrem Nach- und Vornamen mit nachgestelltem Titel unter Angabe des Landes verzeichnet:

```xml
<person xml:id="ed_eko_hym_aah">
    <idno type="uri">http://d-nb.info/gnd/116400617</idno>
    <idno type="uri">http://www.treccani.it/enciclopedia/michelangelo-caetani</idno>
    <persName type="reg">
        <surname>Caetani</surname>
        <forename>Michelangelo</forename> <roleName>duca di Sermoneta</roleName>
        </persName>
    <persName type="alt">
        <name>Gaetani</name>
    </persName>
    <birth>1804</birth>
    <death>1882</death>
</person>
```

Könige werden unter ihrem Vornamen, der Zählung und der Angabe des Landes geführt (*Margherita von Savoyen, Königin von Italien*):

```xml
<person xml:id="ed_jmv_ws3_xfb">
    <idno type="uri">http://d-nb.info/gnd/120736233</idno>
    <idno type="uri">http://www.treccani.it/enciclopedia/margherita-di-savoia-regina-d-italia</idno>
    <persName type="reg">
        <surname>Margherita von Savoyen</surname>
        <forename>Königin von Italien (seit 1878)</forename>
    </persName>
    <birth>1851</birth>
    <death>1926</death>
</person>
```

Akademische Titel oder Berufsbezeichnungen oder Verwandschaftsbeziehungen erscheinen ggf. dann, wenn der Vorname nicht ermittelt werden konnte:

```xml
<person xml:id="ed_ckj_znz_m3b">
    <persName type="reg">
        <surname>Collrepp</surname>
        <forename/>
    </persName>
    <birth>1827</birth>
    <death/>
    <note>Stiefbruder von Ferdinand Gregorovius</note>
</person>
```

Bei Pseudonymen kommt der Name entsprechend der Adressierung in die Titelzeile, im Register werden Pseudonyme nach Klarnamen aufgelöst:

```xml
<person xml:id="ed_3iq_1oq_eku">
    <idno type="uri">http://d-nb.info/gnd/118550772</idno>
    <persName type="reg">
        <surname>Heyse</surname>
        <forename>Paul</forename>
    </persName>
    <persName type="alt" subtype="pseudonym">
        <surname>Florentin</surname>
        <forename>Theodor</forename>
    </persName>
    <birth>1830</birth>
    <death>1914</death>
</person>
```
