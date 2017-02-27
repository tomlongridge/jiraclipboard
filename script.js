var key = document.location.pathname;
key = key.substring(key.lastIndexOf('/') + 1);
chrome.runtime.sendMessage(
  {
    "key": key,
    "title": $('#summary-val').text().trim(),
    "href": document.location.toString(),
    "status": $('#status-val').text().trim(),
    "assignee": $('#assignee-val').text().trim()
}, null);
