(function() {
  var config, f;

  config = {
    CONTEXTMENU_TEXT: '選択範囲をWeblioで検索',
    CONTEXTS: ['selection'],
    SEND_MSG: {
      msg: 'selection'
    },
    DIR_URL: 'http://ejje.weblio.jp/content/',
    QUERY_FOR_WEBLIO: {
      currentWindow: true,
      url: 'http://ejje.weblio.jp/content/*'
    }
  };

  f = {
    getSelectionWord: function(info, tab) {
      var deferred;
      deferred = Q.defer();
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabs) {
        return chrome.tabs.sendMessage(tabs[0].id, config.SEND_MSG, function(response) {
          var searchUrl;
          searchUrl = "" + config.DIR_URL + response.word;
          return deferred.resolve(searchUrl);
        });
      });
      return deferred.promise;
    },
    hasAlreadyWeblio: function() {
      var deferred;
      deferred = Q.defer();
      chrome.tabs.query(config.QUERY_FOR_WEBLIO, function(tabs) {
        if (tabs.length > 0) {
          return deferred.resolve(tabs[0]);
        } else {
          return deferred.reject();
        }
      });
      return deferred.promise;
    },
    openSelection: function(id, url) {
      var deferred, query;
      deferred = Q.defer();
      query = {
        url: url,
        active: true
      };
      if (id != null) {
        chrome.tabs.update(id, query, function() {
          return deferred.resolve();
        });
      } else {
        chrome.tabs.create(query, function() {
          return deferred.resolve();
        });
      }
      return deferred.promise;
    },
    searchWeblio: function() {
      return f.getSelectionWord().then(function(url) {
        return f.hasAlreadyWeblio().then(function(tab) {
          return f.openSelection(tab.id, url);
        }, function() {
          return f.openSelection(null, url);
        }).done();
      });
    }
  };

  chrome.contextMenus.create({
    title: config.CONTEXTMENU_TEXT,
    contexts: config.CONTEXTS,
    onclick: f.searchWeblio
  });

}).call(this);
