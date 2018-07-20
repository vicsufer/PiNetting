module.exports = {
  mongo: null,
  app: null,
  init: function(app, mongo) {
    this.mongo = mongo;
    this.app = app;
  },

  registerDevice: function(device, funcionCallback) {
    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
      if (err) {
        funcionCallback(err);
      } else {
        var collection = db.collection('registered_devices');
        collection.insert(device, function(err, result) {
          if (err) {
            funcionCallback(err);
          } else {
            funcionCallback(null, result.ops[0]._id);
          }
          db.close();
        });
      }
    });
  },

  unregisterDevice: function(device, funcionCallback) {
    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
      if (err) {
        funcionCallback(err);
      } else {
        var collection = db.collection('registered_devices');
        collection.remove(device, function(err, result) {
          if (err) {
            funcionCallback(err);
          } else {
            funcionCallback(null, {message: "OK"});
          }
          db.close();
        });
      }
    });
  },

  updateRegisteredDevice: function(criteria, device, funcionCallback) {
    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
      if (err) {
        funcionCallback(err);
      } else {
        var collection = db.collection('registered_devices');
        collection.update(criteria, device, function(err, result) {
          if (err) {
            funcionCallback(err);
          } else {
            funcionCallback(null, {result:"OK"});
          }
          db.close();
        });
      }
    });
  },

  getRegisteredDevices: function(criterio, funcionCallback) {
    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
      if (err) {
        funcionCallback(err);
      } else {
        var collection = db.collection('registered_devices');
        collection.find(criterio)
          .toArray(function(err, devices) {
            if (err) {
              funcionCallback(err);
            } else {
              funcionCallback(null,devices);
            }
            db.close();
          });
      }
    });
  },

}
