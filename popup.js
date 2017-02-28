var allData = new Map();
var activeData = null;
var modeActiveOnly = false;
var formatString = null;

function executeScript(tabId = null) {
  chrome.tabs.executeScript(tabId, {file: "script.js"});
}

function setActiveOnly(enabled) {
  modeActiveOnly = enabled;
  if (enabled) {
    allData.clear();
  } else {
    activeData = null;
  }
  chrome.storage.sync.set({ activeOnly: enabled }, null);
}

function runAllTabs() {
  setActiveOnly(false);
  chrome.storage.sync.get("jiraURL", function(options) {
    chrome.tabs.query({currentWindow: true, url: 'https://' + options.jiraURL + '/*'}, function(tabs) {
      for (var i = 0; i < tabs.length; i++) {
        executeScript(tabs[i].id);
      }
    });
  });
}

function runActiveTab() {
  setActiveOnly(true);
  executeScript();
}

function getListItem(item) {
  return '<li>' + getSingleItem(item) + '</li>';
}

function getSingleItem(item) {
  return formatString.
    replace("{key}", item.key).
    replace("{href}", item.href).
    replace("{title}", item.title).
    replace("{status}", item.status).
    replace("{assignee}", item.assignee);
}

function addData(newData) {
  if (newData.title.length > 0) {
    if (modeActiveOnly) {
      activeData = newData;
    } else {
      allData.set(newData.key, newData);
    }
  }
  render();
  copyDataToClipboard();
}

function render() {
  $('#jiraDataPlaceholder').html('');
  if (activeData) {
    $('#jiraDataPlaceholder').append('<p id="jiraData" class="jiraPara"></p>');
    $('#jiraData').append(getSingleItem(activeData));
  } else if (allData.size > 0) {
    $('#jiraDataPlaceholder').append('<ul id="jiraData"></ul>');
    allData.forEach(function(item) {
      $('#jiraData').append(getListItem(item));
    });
  } else {
    $('#jiraDataPlaceholder').append('<p id="jiraData" class="jiraPara">No issues</p>');
  }
}

function copyDataToClipboard() {
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

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('copySingleBtn').addEventListener('click', runActiveTab);
  document.getElementById('copyListBtn').addEventListener('click', runAllTabs);
  chrome.storage.sync.get(["activeOnly", "formatString"], function(options) {
    setActiveOnly(options.activeOnly);
    formatString = options.formatString;
    if (modeActiveOnly) {
      runActiveTab();
    } else {
      runAllTabs();
    }
  });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    addData(request);
  });
});
