chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
  if request.msg is 'selection'
    sendResponse {word: window.getSelection().toString()}
