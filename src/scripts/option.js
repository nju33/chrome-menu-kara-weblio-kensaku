function saveOptions() {
  var type = document.getElementById('type').value;
  chrome.storage.sync.set({type}, () => {
    const status = document.getElementById('status');
    status.textContent = chrome.i18n.getMessage('status');
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restoreOptions() {
  document.getElementById('typeLabel').innerText =
    chrome.i18n.getMessage('formGroupType');
  chrome.storage.sync.get({
    type: 'tab',
  }, (items) => {
    document.getElementById('type').value = items.type;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
