function saveOptions() {
  chrome.storage.sync.set({
    jiraURL: document.getElementById('jiraURL').value,
    formatString: document.getElementById('formatString').value
  }, function() {
    var status = document.getElementById('message');
    status.textContent = 'Changes saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 2000);
  });
}

function getOptions() {
  chrome.storage.sync.get({
    jiraURL: '',
    formatString: '<a href="{href}">{key}</a>: {title} (<strong>{status}</strong> - {assignee})'
  }, function(items) {
    document.getElementById('jiraURL').value = items.jiraURL;
    document.getElementById('formatString').value = items.formatString;
  });
}

document.addEventListener('DOMContentLoaded', getOptions);
document.getElementById('save').addEventListener('click', saveOptions);
