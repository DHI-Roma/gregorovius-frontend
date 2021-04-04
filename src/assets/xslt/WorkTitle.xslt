<xsl:template match="/tei:bibl/tei:title">
    <xsl:apply-templates/>
</xsl:template> 

<xsl:template match="tei:hi[@rendition = '#i']">
    <i><xsl:apply-templates/></i>
</xsl:template> 

<xsl:template match="tei:hi[@rendition = '#b']">
    <b><xsl:apply-templates/></b>
</xsl:template> 

<xsl:template match="tei:hi[@rendition = '#i #b']">
    <i><b><xsl:apply-templates/></b></i>
</xsl:template> 

<xsl:template match="tei:hi[@rendition = '#s']">
    <sup><xsl:apply-templates/></sup>
</xsl:template> 

<xsl:template match="/tei:bibl/tei:note"/>