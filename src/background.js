chrome.runtime.onInstalled.addListener(function() {
  // Initialise options
  chrome.storage.sync.get(['jiraURL', 'formatString'], function(options) {
    if (!options.jiraURL) {
      options.jiraURL = '';
    }
    if (!options.formatString) {
      options.formatString = '<a href="{href}">{key}</a>: {title} (<strong>{status}</strong> - {assignee})';
    }
    options.activeOnly = false;
    options.includeListPages = true;
    chrome.storage.sync.set(options);

    setPageRules(options.jiraURL);
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == 'options') {
    setPageRules(request.jiraURL);
  }
});

function setPageRules(jiraURL) {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      // If a URL is given, only enable extention if it matches the hostEquals
      // Otherwise always show so the options can be set
      if (jiraURL.length == 0) {
        chrome.declarativeContent.onPageChanged.addRules([
          {
            conditions: [
              new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { urlMatches: '.' },
              })
            ],
            actions: [ new chrome.declarativeContent.ShowPageAction() ]
          }
        ]);
      } else {
        chrome.declarativeContent.onPageChanged.addRules([
          {
            conditions: [
              new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { hostEquals: jiraURL },
              })
            ],
            actions: [ new chrome.declarativeContent.ShowPageAction() ]
          }
        ]);
      }
  });
}
