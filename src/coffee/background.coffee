config =
  CONTEXTMENU_TEXT: '選択範囲をWeblioで検索'
  CONTEXTS: ['selection']
  SEND_MSG: {msg: 'selection'}
  DIR_URL: 'http://ejje.weblio.jp/content/'
  QUERY_FOR_WEBLIO:
    currentWindow: true
    url: 'http://ejje.weblio.jp/content/*'

f =
  getSelectionWord: (info, tab) ->
    deferred = Q.defer()
    chrome.tabs.query {active: true, currentWindow: true}, (tabs) ->

      chrome.tabs.sendMessage tabs[0].id, config.SEND_MSG, (response) ->
        searchUrl = "#{config.DIR_URL}#{response.word}"
        deferred.resolve searchUrl

    deferred.promise

  hasAlreadyWeblio: ->
    deferred = Q.defer()
    chrome.tabs.query config.QUERY_FOR_WEBLIO, (tabs) ->
      if tabs.length > 0
        deferred.resolve tabs[0]
      else
        deferred.reject()
    deferred.promise

  openSelection: (id, url) ->
    deferred = Q.defer()
    query =
      url: url
      active: true
    if id?
      chrome.tabs.update id, query, ->
        deferred.resolve()
    else
      chrome.tabs.create query, ->
        deferred.resolve()
    deferred.promise

  searchWeblio: ->
    f.getSelectionWord()

    .then (url) ->
      f.hasAlreadyWeblio()

      .then (tab) ->
        f.openSelection tab.id, url
      , () ->
        f.openSelection null, url

      .done()


chrome.contextMenus.create
  title: config.CONTEXTMENU_TEXT
  contexts: config.CONTEXTS
  onclick: f.searchWeblio

