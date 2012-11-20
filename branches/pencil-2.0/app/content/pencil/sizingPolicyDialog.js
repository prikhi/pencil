var xPolicy;
var yPolicy;
var wPolicy;
var hPolicy;
var widthStartEndItem;
var heightStartEndItem
var valueHolder;

function handleOnload() {
    try {
        handleOnloadImpl();
    } catch (e) {
        Console.dumpError(e, "stdout");
    }
}
function validateWidthPolicySelection() {
	if (xPolicy.value == "start") {
		widthStartEndItem.disabled = false;
	} else {
		widthStartEndItem.disabled = true;
		if (wPolicy.value == "start-end") {
			wPolicy.value = "fixed";
		}
	}
}
function validateHeightPolicySelection() {
	if (yPolicy.value == "start") {
		heightStartEndItem.disabled = false;
	} else {
		heightStartEndItem.disabled = true;
		if (hPolicy.value == "start-end") {
			hPolicy.value = "fixed";
		}
	}
}
function handleOnloadImpl() {
    xPolicy = document.getElementById("xPolicy");
    yPolicy = document.getElementById("yPolicy");
    wPolicy = document.getElementById("wPolicy");
    hPolicy = document.getElementById("hPolicy");
    
    widthStartEndItem = document.getElementById("widthStartEndItem");
    heightStartEndItem = document.getElementById("heightStartEndItem");
    
    valueHolder = window.arguments[0];
    
    xPolicy.value = valueHolder.input.xPolicy;
    yPolicy.value = valueHolder.input.yPolicy;
    wPolicy.value = valueHolder.input.wPolicy;
    hPolicy.value = valueHolder.input.hPolicy;
    
    validateWidthPolicySelection();
    validateHeightPolicySelection();
}
function handleDialogAccept() {
	valueHolder.output = {
		xPolicy: xPolicy.value,
		yPolicy: yPolicy.value,
		wPolicy: wPolicy.value,
		hPolicy: hPolicy.value
	};
	
    return true;
}
window.addEventListener("load", handleOnload, false);

