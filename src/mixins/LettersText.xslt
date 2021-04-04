<xsl:stylesheet 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:telota="http://www.telota.de" 
    xmlns:tei="http://www.tei-c.org/ns/1.0" 
    xmlns:v-bind="https://vuejs.org/v2/api/#v-bind"
    xmlns:v-on="https://vuejs.org/v2/api/#v-on"
    version="3.0" 
    exclude-result-prefixes="tei">

    <xsl:output method="xml" doctype-system="http://www.w3.org/TR/html4/strict.dtd" doctype-public="-//W3C//DTD HTML 4.01//EN"/>

    <xsl:template match="/">
        <xsl:apply-templates select="//tei:body"/>
    </xsl:template> 

    
</xsl:stylesheet>
