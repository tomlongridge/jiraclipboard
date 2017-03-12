var allData = new Map();
var formatString = null;
var jiraURL = null;

function setActiveOnly(enabled) {
  chrome.storage.sync.set({ activeOnly: enabled }, runInTabs);
}

function setIncludeListPages(include) {
  chrome.storage.sync.set({ includeListPages: include }, runInTabs);
}

function toggleLoading(on) {
  if(on) {
    $('#loadingPanel').show();
    $('#browsePanel').hide();
  } else {
    $('#loadingPanel').hide();
    $('#browsePanel').show();
  }
}

function runInTabs() {
  toggleLoading(true);
  allData.clear();
  chrome.storage.sync.get(["jiraURL", "activeOnly", "includeListPages"], function(options) {
    var tabQuery = {currentWindow: true, url: 'https://' + options.jiraURL + '/*'};
    if (options.activeOnly) {
      tabQuery.active = true;
    }
    chrome.tabs.query(tabQuery, function(tabs) {
      var tabResponseCount = 0;
      $.each(tabs, function(index, tab) {
        chrome.tabs.sendMessage(tab.id, {type: 'send-issues', includeListPages: options.includeListPages}, null, function(response) {
          if (typeof response !== "undefined") {
            $.each(response.newData, function(index, issue) {
              allData.set(issue.key, issue);
            });
          } else {
            console.error('Empty issue message from tab - possibly need to reload?');
          }
          tabResponseCount++;

          if (tabResponseCount == tabs.length) {
            render();
            toggleLoading(false);
            copyDataToClipboard();
          }
        });
      });
    });
  });
}

function getListItem(item) {
  return '<li>' + getSingleItem(item) + '</li>';
}

function getSingleItem(item) {
  return formatString.
    replace("{key}", item.key).
    replace("{href}", getIssueURL(item.key)).
    replace("{title}", item.title).
    replace("{status}", item.status).
    replace("{assignee}", item.assignee);
}

function getIssueURL(key) {
  return 'https://' + jiraURL + '/browse/' + key;
}

function render() {
  $('#jiraDataPlaceholder').html('');
  if (allData.size === 0) {
    $('#jiraDataPlaceholder').append('<p id="jiraData" class="jiraPara">No issues</p>');
  } else if (allData.size === 1) {
    $('#jiraDataPlaceholder').append('<p id="jiraData" class="jiraPara"></p>');
    $('#jiraData').append(getSingleItem(allData.values().next().value));
  } else {
    $('#jiraDataPlaceholder').append('<ul id="jiraData"></ul>');
    allData.forEach(function(item) {
      $('#jiraData').append(getListItem(item));
    });
  }
}

function copyDataToClipboard() {
  if (allData.size > 0) {
    var jiraData = document.querySelector('#jiraData');
    var range = document.createRange();
    window.getSelection().removeAllRanges();
    range.selectNode(jiraData);
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    $('#message').text("Copied to clipboard");
    setTimeout(function() {
      $('#message').text("");
    }, 2000);
  }
}

$(document).ready(function() {
  toggleLoading();
  chrome.storage.sync.get(["activeOnly", "includeListPages", "formatString", "jiraURL"], function(options) {
    $('#copySingleBtn').click(function() {
      setActiveOnly(true);
    });
    $('#copyListBtn').click(function() {
      setActiveOnly(false);
    });
    $('#includeListPages').change(function() {
      setIncludeListPages(this.checked);

    });
    $('#optionsLink').click(function() {
      chrome.runtime.openOptionsPage();
    });
    if (options.jiraURL.length > 0) {
      $('#noOptions').hide();
      $('#browsePanel').show();
      $('#includeListPages').prop('checked', options.includeListPages);
      formatString = options.formatString;
      jiraURL = options.jiraURL;
      runInTabs();
    } else {
      $('#noOptions').show();
      $('#browsePanel').hide();
    }
  });
});
