var $ = require('jQuery');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  if (request.type == 'send-issues') {

    var url = document.location.pathname;
    if ((url.indexOf('/browse/') > -1) &&
        $('#summary-val').length &&
        $('#status-val').length &&
        $('#assignee-val').length) {

      // Single issue page
      var key = url.substring(url.lastIndexOf('/') + 1);
      sendResponse({ newData: [
        {
          "type": 'new-issue',
          "key": key,
          "title": $('#summary-val').text().trim(),
          "status": $('#status-val').text().trim(),
          "assignee": $('#assignee-val').text().trim()
        }
      ]});

    } else if ((url.indexOf('/issues/') > -1) && request.includeListPages && $('#issuetable').length) {

      // Search page
      var issues = [];
      $('.issuerow').each(function() {
        issues.push(
          {
            "type": 'new-issue',
            "key": $(this).find('.issuekey').text().trim(),
            "title": $(this).find('.summary').text().trim(),
            "status": $(this).find('.status').text().trim(),
            "assignee": $(this).find('.assignee').text().trim()
          }
        );
      });

      sendResponse({newData: issues});

    }

  }

});
