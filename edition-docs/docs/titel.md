Der Titel eines Briefes umfasst den Namen des Adressaten mit dem geläufigen Vor- und Familiennamen.
Ferner sind darin Schreibort und Abfassungsdatum des Briefes und, soweit ermittelbar, das Datum und der Ort des Empfangs verzeichnet.
Hat ein Brief zwei oder mehrere Empfänger, so werden in alphabetischer Reihenfolge alle aufgeführt.
Unsichere Empfänger sind durch ein Fragezeichen in runden Klammern hinter dem entsprechenden Namen markiert.

Bei schwankender Schreibung wird die vorherrschende Variante gewählt, im Zweifelsfall die modernere. 
Im Titel erfolgt die Namensangabe bei Frauen nach dem jeweils geltenden Personenstand; bei Angehörigen adliger Familien wird der jeweils geltende Titel genannt.

In den Briefmetadaten erfolgt, analog zum Personenregister, die Namensangabe nach dem jeweils letzten Personenstand und Adelstitel. 
Ort und Datum werden in den Metadaten analog zur Titelzeile und in standardisierter, maschinenlesbarer Form erfasst. 
Bei an verschiedenen Tagen verfassten Briefen ist das Schlussdatum ausschlaggebend, bei unsicher zu datierenden Briefen werden am Ende des in Frage kommenden Zeitraums verzeichnet.

```xml
<titleStmt>
    <title></title>
</titleStmt>
```

```xml
<correspDesc>
   <correspAction type="sent">
      <persName/>
      <placeName/>
      <date/>
   </correspAction>
   <correspAction type="received">
      <persName/>
      <placeName/>
   </correspAction>
   [...]
</correspDesc>
```
