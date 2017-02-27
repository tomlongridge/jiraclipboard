function saveOptions() {
  chrome.storage.sync.set({
    jiraURL: document.getElementById('jiraURL').value
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('message');
    status.textContent = 'URL saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 2000);
  });
}

function getOptions() {
  chrome.storage.sync.get({
    jiraURL: ''
  }, function(items) {
    document.getElementById('jiraURL').value = items.jiraURL;
  });
}

document.addEventListener('DOMContentLoaded', getOptions);
document.getElementById('save').addEventListener('click', saveOptions);
