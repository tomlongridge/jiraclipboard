function saveOptions() {
  var jiraURL = $('#jiraURL').text();
  var formatString = $('#formatString').text();

  if (jiraURL.length === 0) {
    $('#jiraURL').css('border', '1px solid red');
  } else if (formatString.length === 0) {
    $('#formatString').css('border', '1px solid red');
  } else {
    chrome.storage.sync.set({
      jiraURL: jiraURL,
      formatString: formatString
    }, function() {
      // Update page action rules
      chrome.runtime.sendMessage({type: 'options', jiraURL: jiraURL}, null);

      var status = $('#message');
      status.text('Changes saved.');
      setTimeout(function() {
        status.text('');
      }, 2000);
    });
  }
}

function getOptions() {
  chrome.storage.sync.get({
    jiraURL: '',
    formatString: '<a href="{href}">{key}</a>: {title} (<strong>{status}</strong> - {assignee})'
  }, function(items) {
    $('#jiraURL').text(items.jiraURL);
    $('#formatString').text(items.formatString);
  });
}

$(document).ready(function() {
  $('#save').click(saveOptions);
  $('#jiraURL').text('items.jiraURL');
  $('#formatString').text('items.formatString');
  getOptions();
});
