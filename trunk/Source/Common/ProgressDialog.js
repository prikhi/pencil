var titleText = null;
var detailText = null;
var percent = null;
var jobStarter = null;
var jobName = null;

var returnValueHolder;
function handleOnload() {
    titleText = document.getElementById("titleText");
    detailText = document.getElementById("detailText");
    percent = document.getElementById("percent");

    jobName = window.arguments[0];
    jobStarter = window.arguments[1];

    //setup
    document.title = "Progress...";

    Dom.empty(titleText);
    titleText.appendChild(document.createTextNode(jobName + "..."));

    Dom.empty(detailText);

    var dialog = document.documentElement;

    try {
        debug("about to call starter");
        jobStarter({
            onProgressUpdated: function (currentTask, done, total) {
                Dom.empty(detailText);
                detailText.appendChild(document.createTextNode(currentTask));
                var p = Math.round(done * 100 / total);
                percent.setAttribute("value", p);
            },
            onTaskDone: function () {
                window.close();
            }
        });
    } catch(e) {
        error(e);
    }
}
window.addEventListener("load", handleOnload, false);

