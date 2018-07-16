var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'info'
});

var indexName = "connected_devices";

/**
 * Delete an existing index
 */
function deleteIndex() {
  return elasticClient.indices.delete({
    index: indexName
  });
}
exports.deleteIndex = deleteIndex;

/**
 * create the index
 */
function initIndex() {
  return elasticClient.indices.create({
    index: indexName
  });
}
exports.initIndex = initIndex;

/**
 * check if the index exists
 */
function indexExists() {
  return elasticClient.indices.exists({
    index: indexName
  });
}
exports.indexExists = indexExists;


function initMapping() {
  return elasticClient.indices.putMapping({
    index: indexName,
    type: "document",
    body: {
      "properties": {
        "address": {
          "type": "keyword"
        },
        "cidr": {
          "type": "keyword"
        },
        "timestamp": {
          "type": "date"
        },
        "family": {
          "type": "keyword"
        },
        "mac": {
          "type": "keyword"
        },
        "netmask": {
          "type": "text"
        },
        "scopeid": {
          "type": "text"
        }
      }
    }
  });
}

exports.initMapping = initMapping;

function addDocument(document) {
  return elasticClient.index({
    "index": indexName,
    "type": "document",
    "body": {
      address: document.address,
      cidr: document.cidr,
      timestamp: Date.now(),
      family: document.family,
      mac: document.mac,
      netmask: document.netmask,
      scopeid: document.scopeid
    }
  });
}
exports.addDocument = addDocument;
