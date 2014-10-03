(function() {
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.msg === 'selection') {
      return sendResponse({
        word: window.getSelection().toString()
      });
    }
  });

}).call(this);
