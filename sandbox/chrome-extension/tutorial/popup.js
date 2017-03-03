// get current url
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];

    var url = tab.url;

    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url)

  })
}

function getImageUrl(searchTerm, callback, errorCallback) {
  var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
  '?v=1.0&q=' + encodeURIComponent(searchTerm);

  var xhr = new XMLHttpRequest();

  xhr.open('GET', searchUrl);

  xhr.responseType = 'json';

  xhr.onload = function() {

    var res = xhr.response;

    if (!res || !res.responseData || !res.responseData.results ||
      res.responseData.results.length === 0) {
        errorCallback('No response from Google Image Search!');
        return
      }

    var firstResult = res.responseData.results[0];

    var imageUrl = firstResult.tbUrl; // thumbnail url
    var width = parseInt(firstResult.tbWidth);
    var height = parseInt(firstResult.tbHeight);

    console.assert(
      typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
      'Unexpected response from the Google Image Search API!'
    );

    callback(imageUrl, width, height)

  }

  xhr.onerror = function() {
    errorCallback('Network error.')
  }

  xhr.send();
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {

    renderStatus('Performing Google Image search for ' + url);

    getImageUrl(url, function(imageUrl, width, height) {

      renderStatus('Search term: ' + url + '\n' +
        'Google Image search result: ' + imageUrl
    );

    var imageResult = document.getElementById('image-result');

    imageResult.width = width;
    imageResult.height = height;
    imageResult.src = imageUrl;
    imageResult.hidden = false;


    }, function(errorMessage) {
      renderStatus('Cannot display image. ' + errorMessage)
    })
  })

})
