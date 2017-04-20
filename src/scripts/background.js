const ENDPOINT = 'http://ejje.weblio.jp/content';
let currentWin = null;

async function getType() {
  return new Promise(resolve => {
    chrome.storage.sync.get({type: 'tab'}, items => resolve(items.type));
  });
}

async function createTab(url) {
  return new Promise(resolve => {
    chrome.tabs.create({
      url
    }, () => resolve());
  });
}

async function createWindow(url) {
  return new Promise(resolve => {
    chrome.windows.create({
      url,
      type: 'popup',
      width: 517,
      height: 320
    }, win => resolve(win));
  });
}

async function search(selectionText) {
  const type = await getType();
  if (type === 'tab') {
    await createTab(`${ENDPOINT}/${selectionText}`);
  } else if (type === 'popup') {
    const popupFilename = chrome.runtime.getURL('popup.html');
    const win = await createWindow(`${popupFilename}#${selectionText}`);
    currentWin = win;
  }
}

chrome.windows.onFocusChanged.addListener(wid => {
  if (currentWin === null) {
    return;
  }
  if (currentWin.id === wid) {
    chrome.windows.remove(currentWin.id, () => {
      currentWin = null;
    });
  }
});

chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id: chrome.i18n.getMessage('appName'),
    title: chrome.i18n.getMessage('contextTitle'),
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener(({menuItemId, selectionText}) => {
  if (menuItemId === chrome.i18n.getMessage('appName')) {
    search(selectionText);
  }
});
