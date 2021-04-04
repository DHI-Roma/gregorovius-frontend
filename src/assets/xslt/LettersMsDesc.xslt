<xsl:strip-space elements="*" />

<!-- Select source description element -->
<xsl:template match="/">
    <xsl:apply-templates select="//tei:teiHeader/tei:fileDesc/tei:sourceDesc"/>
    <xsl:apply-templates select="//tei:teiHeader/tei:profileDesc/tei:correspDesc/tei:correspContext"/>
</xsl:template>

<!-- Render manuscript (Handschrift) -->
<xsl:template match="tei:fileDesc/tei:sourceDesc/tei:msDesc/tei:msIdentifier">
    <xsl:choose>
        <xsl:when test="string()">
            <div>
                <b>H</b>: 
                <xsl:for-each select="./*">
                    <xsl:value-of select="."/>
                    <xsl:if test="position() != last()">, </xsl:if>
                </xsl:for-each>
            </div>
        </xsl:when>
        <xsl:otherwise>
            <xsl:apply-templates/>
        </xsl:otherwise>
    </xsl:choose>
</xsl:template> 

<!-- Render physical description and supplements -->
<xsl:template match="//tei:teiHeader/tei:fileDesc/tei:sourceDesc/tei:msDesc/tei:physDesc">
    <xsl:choose>
        <xsl:when test="tei:p[2]">
            <div><xsl:apply-templates select="tei:p[1]"/></div>
            <div class="text-bold q-pt-md">Beilagen</div>
            <div class="q-mb-md"><xsl:apply-templates select="tei:p[2]"/></div>
        </xsl:when>
        <xsl:otherwise>
            <div><xsl:apply-templates select="tei:p[1]"/></div>
        </xsl:otherwise>
    </xsl:choose>
</xsl:template> 

<!-- Render copies (Abschriften) -->
<xsl:template match="tei:fileDesc/tei:sourceDesc/tei:listWit//tei:witness/tei:msDesc[@type='copy']">
    <xsl:choose>
        <xsl:when test="string()">
            <div class="q-pt-md">
                <b>h</b>: 
                <xsl:for-each select="./*/*">
                    <xsl:value-of select="."/>
                    <xsl:if test="position() != last()">, </xsl:if>
                </xsl:for-each>
            </div>
        </xsl:when>
        <xsl:otherwise>
            <xsl:apply-templates/>
        </xsl:otherwise>
    </xsl:choose>
</xsl:template> 

<!-- Render prints (Drucke) -->
<xsl:template match="tei:fileDesc/tei:sourceDesc/tei:listWit//tei:witness/tei:bibl[@type='print']">
    <xsl:choose>
        <xsl:when test="string()">
            <div class="q-pt-md">
                <b>D</b>: 
                <xsl:for-each select="text()"><xsl:value-of select="."/></xsl:for-each>
            </div>
        </xsl:when>
        <xsl:otherwise>
            <xsl:apply-templates/>
        </xsl:otherwise>
    </xsl:choose>
</xsl:template> 

<!-- Render concepts (Konzepte) -->
<xsl:template match="tei:fileDesc/tei:sourceDesc/tei:listWit//tei:witness/tei:msDesc[@type='concept']">
    <xsl:choose>
        <xsl:when test="text()">
            <div class="q-pt-md">
                <b>K</b>: 
                <xsl:apply-templates/>
            </div>
        </xsl:when>
        <xsl:otherwise>
            <xsl:apply-templates/>
        </xsl:otherwise>
    </xsl:choose>
</xsl:template> 

<xsl:template match="tei:fileDesc/tei:sourceDesc/tei:listWit//tei:witness[@select='#this']">
    <div><q-tooltip anchor="center left" self="center right">Textgrundlage <q-icon name="arrow_right"/></q-tooltip><b><xsl:apply-templates/></b></div> 
</xsl:template> 

<xsl:template match="tei:correspContext">
    <div class="q-pt-md text-bold">Korrespondenzkontext</div>
    <xsl:apply-templates/>
</xsl:template> 

<xsl:template match="tei:correspContext/tei:ref">
    <xsl:choose>
        <xsl:when test="@type='next'">
            <div>
                <b>A</b>: 
                <xsl:for-each select="text()"><xsl:value-of select="."/></xsl:for-each>
            </div>
        </xsl:when>
        <xsl:when test="@type='prev'">
            <div>
                <b>B</b>: 
                <xsl:for-each select="text()"><xsl:value-of select="."/></xsl:for-each>
            </div>
        </xsl:when>
        <xsl:otherwise>
            <xsl:apply-templates/>
        </xsl:otherwise>
    </xsl:choose>
</xsl:template>