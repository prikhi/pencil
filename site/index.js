require(['content', 'mercury'], function(content, hg){
'use strict';

var h = hg.h;

/* Set the page's State */
function App() {
  return hg.state(content);
}

/* Render the page */
App.render = function render(state) {
  return h('div',
    [bs.navbar(state),
     h('div#content.container',
       [bs.jumbotron(state)]
       .concat(bs.featureRows(state.features)))
    ]);
};


/* Bootstrap 3 Rendering Functions */
var bs = {};

/* Create the Navbar */
bs.navbar = function(state){
  var copyrightText = h('span', [
    'Copyright ', state.copyrightYear, ', ', state.copyrightAuthor, ' - ',
    h('a.navbar-link', {href: state.licenseLink, target: '_blank'}, state.licenseName), '.']);
  return h('nav.navbar.navbar-default',
    [h('div.container',
       [h('div.navbar-header',
          h('a.navbar-brand', {href: "#content"}, state.projectName)),
        h('div',
          [h('ul.nav.navbar-nav',
             [bs.navbarLink(state.docsLink, 'Docs'),
              bs.navbarLink(state.githubLink, 'Github'),
             ]),
           h('p.navbar-text.navbar-right', copyrightText),
          ])
       ])
    ]);
};

/* Create the Jumbotron */
bs.jumbotron = function(state) {
  var latestReleaseText = [
      'The latest stable release of ' + state.projectName + ' is version ',
      h('a', {href: state.releasesLink, target: '_blank'}, state.version), '.'
  ];
  return h('div.jumbotron',
    [h('div.container',
       [h('h1', state.projectName),
        h('h2', state.tagLine),
        h('div.col-md-5.text-center',
          [h('p', state.shortDescription),
           h('p', latestReleaseText),
           bs.downloadLink(state.firefoxLink, 'Firefox'),
           bs.downloadLink(state.linuxLink, 'GNU/Linux'),
           bs.downloadLink(state.osxLink, 'OS X'),
           bs.downloadLink(state.windowsLink, 'Windows'),
          ]),
        h('div.col-md-7',
          [bs.responsiveImage(state.projectName, state.mainScreenshot)]),
       ]),
    ]);
};

/* Create rows of features rendered in thumbnails */
bs.featureRows = function(features) {
  var cols =  features.map(function(feature) {
    return [
      h('div.col-md-6', [
        bs.responsiveImage(feature.title, feature.screenshot)
      ]),
      h('div.col-md-6', [
        h('h3', feature.title),
        h('div', bs.newlineParagraphBreaks(feature.description))
      ])
    ];
  });

  var groups = [];
  for (var i = 0; i < cols.length; i++) {
    if (i % 2 === 0) {
      groups.push([cols[i][0], cols[i][1]]);
    } else {
      groups.push([cols[i][1], cols[i][0]]);
    }
  }

  return groups.map(function(group) {
    return h('div.row', group);
  });
};

/* Create an External Link for the Navbar */
bs.navbarLink = function(linkLocation, linkText) {
  return h('li', [h('a', {href: linkLocation, target: '_blank'}, linkText)]);
};

/* Create a Download Button */
bs.downloadLink = function(linkLocation, systemName) {
  return h('button.btn.btn-sm.btn-primary',
           {'ev-click': function() { window.location.href = linkLocation; }},
           ['Download for ' + systemName]);
};

/* Create a Responsive Image */
bs.responsiveImage = function(altText, imgLocation) {
  return h('img.img-responsive', {alt: altText, src: imgLocation});
};

/* Create a Thumbnail with custom content */
bs.thumbnail = function(image, captionElements) {
  return h('div.thumbnail', [image, h('div.caption', captionElements)]);
};

/* Split a string at newlines and turn each part into a <p> element */
bs.newlineParagraphBreaks = function(text) {
  return text.split('\n').map(function(line) {
    return h('p', line);
  });
};


/* Initialize the application */
hg.app(document.body, App(), App.render);
})();
