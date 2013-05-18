module.exports = function(app, rdio) {

  /**
   * Compare two user's collections
   **/

  app.get('/compare', function(req, res) {
    var query = req.query,
        user1email = query.user1_email,
        user2email = query.user2_email,
        userEmails = [user1email, user2email],
        keys, collections;

    keys = getUserKeys(req, userEmails, function(keys) {
      collections = getUserCollections(req, keys, function(collections) {
        var formattedCollections = {};
        formattedCollections[user1email] = collections[0];
        formattedCollections[user2email] = collections[1];
        res.send({ collections: formattedCollections });
      });
    });
  });

  /**
   * Utils
   **/

  function getUserKeys(req, userEmails, callback) {
    var keys = [];

    for (var i = 0, len = userEmails.length; i < len; i++) {
      getUserKey(req, userEmails[i], function(key) {
        keys.push(key);
        if (keys.length === userEmails.length) callback(keys);
      });
    }
  }

  function getUserKey(req, email, callback) {
    makeRdioReq(req, {
      method: 'findUser',
      email: email
    }, function(data) {
      callback(data.key);
    });
  }

  function getUserCollections(req, keys, callback) {
    var collections = [];

    for (var i = 0, len = keys.length; i < len; i++) {
      getUserCollection(req, keys[i], function(collection) {
        collections.push(collection);
        if (collections.length === keys.length) callback(collections);
      });
    }
  }

  function getUserCollection(req, key, callback) {
    makeRdioReq(req, {
      method: 'getAlbumsInCollection',
      user: key
    }, function(data) {
      callback(data);
    });
  }

  function makeRdioReq(req, opts, callback) {
    rdio.api(
      req.session.oauth_access_token,
      req.session.oauth_access_token_secret,
      opts,
      function(err, data, response) {
        if (err) throw new Error(err);
        var data = JSON.parse(data);
        callback(data.result);
      }
    );
  }
}
