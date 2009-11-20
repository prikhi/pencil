<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:p="http://www.evolus.vn/Namespace/Pencil"
    xmlns="http://www.w3.org/1999/xhtml">
<xsl:output method="html"/>

    <xsl:template match="/">
        <html>
            <head></head>
            <body>
                <xsl:apply-templates select="/p:Document/p:Pages/p:Page" />
            </body>
        </html>
    </xsl:template>
    <xsl:template match="p:Page">
        <div class="Page" id="page{p:Properties/p:Property[@name='id']/text()}">
            <h1>
                <xsl:value-of select="p:Properties/p:Property[@name='name']/text()"/>
            </h1>
            <div class="ImageContainer">
                <img src="{@rasterized}"
                    width="{p:Properties/p:Property[@name='width']/text()}"
                    height="{p:Properties/p:Property[@name='height']/text()}"
                    usemap="#map{p:Properties/p:Property[@name='id']/text()}"/>
            </div>
            <xsl:if test="p:Note">
                <p class="Notes">
                    <xsl:copy-of select="p:Note/node()"/>
                </p>
            </xsl:if>
            <map name="map{p:Properties/p:Property[@name='id']/text()}">
                <xsl:apply-templates select="p:Links/p:Link" />
            </map>
        </div>
    </xsl:template>
    <xsl:template match="p:Link">
        <area shape="rect"
            coords="{@x},{@y},{@x+@w},{@y+@h}" href="#page{@target}" title="Go to page '{@targetName}'"/>
    </xsl:template>
</xsl:stylesheet>
