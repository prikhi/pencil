
function openClipartBrowser() {
    if (!Pencil._clipartShowing) {
        window.openDialog('../UI/ClipartBrowser.xul', 'ClipartBrowser' + Util.getInstanceToken(), 'alwaysRaised,chrome,centerscreen,resizable', Pencil.activeCanvas);
    }
}
