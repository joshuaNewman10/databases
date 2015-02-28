// set up data storage
var readLog = function(callback){
  fs.readFile('./data/data.json', 'utf8', function(err, data) {
    if (err) throw err ;
    callback(JSON.parse(data));
  });
};

var writeLog = function(message, callback) {
  readLog(function(log) {
    message.objectId = log.objIdCounter;
    message.createdAt = new Date();
    log.messages.unshift(message);
    log.objIdCounter++;
    fs.writeFile('./data/data.json', JSON.stringify(log), 'utf8', function(err) {
      if (err) console.log( err );
      callback(message);
    });
  });

};
