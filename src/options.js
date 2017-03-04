function saveOptions() {
  var jiraURL = document.getElementById('jiraURL').value;
  var formatString = document.getElementById('formatString').value;

  if (jiraURL.length == 0) {
    $('#jiraURL').css('border', '1px solid red');
  } else if (formatString.length == 0) {
    $('#formatString').css('border', '1px solid red');
  } else {
    chrome.storage.sync.set({
      jiraURL: jiraURL,
      formatString: formatString
    }, function() {
      // Update page action rules
      chrome.runtime.sendMessage({type: 'options', jiraURL: jiraURL}, null);

      var status = document.getElementById('message');
      status.textContent = 'Changes saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 2000);
    });
  }
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
