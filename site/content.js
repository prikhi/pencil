define(function() {
  var version = "2.0.11";
  var githubLink = "http://github.com/prikhi/pencil/";
  var releasesLink = githubLink + 'releases/';
  var releaseDownloadLink = releasesLink + "download/v" + version +
                            "/Pencil-" + version;

  // List of Features - each should contain a title, description & screenshot
  // newlines in descriptions mark paragraph boundaries
  var features = [
    {title: "Easy GUI Prototyping",
     description: [
      "Pencil provides various built-in shapes collection for drawing different ",
      "types of user interface ranging from desktop to mobile platforms, including Android and iOS UI stencils by default. ",
      "This makes it even easier to start protyping apps with a simple installation. ",
      "\n",
      "Popular drawing features are also implemented in Pencil to simplify the ",
      "drawing operations.",
     ],
     screenshot: "site/img/android-app.png"},
    {title: "Built-in Shape Collections",
     description: [
      "Starting from 2.0.2 Pencil has even more shape collections included ",
      "by default. The list of built-in collections now includes general-purpose ",
      "shapes, flowchart elements, desktop/web UI shapes, Android and iOS GUI shapes.",
      "\n",
      "There are also many other collections created by the community and are ",
      "distributed freely on the Internet. You can easily grab a collection and ",
      "install it into Pencil with a simple drag-and-drop operation.",
      "\n",
      "Some of the stencil collections that you can try are collected in the ",
      "download archive.",
     ],
     screenshot: "site/img/stencils.png"},
    {title: "Diagram Drawing Support",
     description: [
      "Pencil now supports connectors which can be used to 'wire' shapes together ",
      "in a diagram. A collection of flowchart shapes are also available for ",
      "drawing diagrams.",
     ],
     screenshot: "site/img/diagram.png"},
    {title: "Exporting to Different Output Formats",
     description: [
      "Pencil supports outputing the drawing document into different types of ",
      "formats. You can have your drawing exported as a set of rasterized PNG ",
      "files or as a web page that can be delivered to the viewers.",
     ],
     screenshot: "site/img/export.png"},
    {title: "Easily Find Clipart from the Internet",
     description: [
      "Pencil has a clipart browser tool that integrates with OpenClipart.org ",
      "to let users easily find cliparts by keywords and added them into the ",
      "drawing by a simple drag-and-drop operation. ",
      "\n",
      "Clipart listed by the tool are in vector format and hence good for users ",
      "in scaling to appropriate sizes.",
     ],
     screenshot: "site/img/clipart.png"},
    {title: "Inter-page Linking",
     description: [
      "Elements in a drawing can be linked to a specific page in the same ",
      "document. This helps user define the UI flow when creating application ",
      "or website mockups. ",
      "\n",
      "Linkings defined in a document are converted into HTML hyper-links when ",
      "the document is exported into web format. This process creates an ",
      "interactive version of the mockup in which viewers can see a simulated ",
      "flow when clicking on the UI elements.",
     ],
     screenshot: "site/img/linking.png"},
  ];
  features.forEach(function(feature) {
    feature.description = feature.description.join('');
  });

  return {
    version: version,

    // Copyright Info
    licenseName: "GPLv2",
    licenseLink: "https://www.gnu.org/licenses/gpl-2.0.html",
    copyrightAuthor: "Pencil Contributers",
    copyrightYear: "2015",

    // Source, Docs & Download Links
    githubLink: githubLink,
    docsLink: "http://pencil-prototyping.rtfd.org",
    releasesLink: releasesLink,
    firefoxLink: releaseDownloadLink + "-firefox.xpi",
    linuxLink: releaseDownloadLink + "-linux.tar.gz",
    osxLink: releaseDownloadLink + "-mac-osx.zip",
    windowsLink: releaseDownloadLink + "-win32.installer.exe",

    // General Project Information
    projectName: "Pencil",
    tagLine: "An Open Source GUI Prototyping Tool Available for All Platforms.",
    mainScreenshot: "http://pencil.evolus.vn/images/home-ss.jpg",
    shortDescription:
      "Pencil was created for the purpose of providing a free and open source " +
      "GUI prototyping & wireframing tool that people can easily install and " +
      "use to create mockups in popular desktop platforms.",

    features: features,
  };
});
