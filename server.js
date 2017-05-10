var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

var server = app.listen(process.env.PORT || 8080, function(){
   var port = server.address().port;
    console.log("App is now running on port", port);
});

function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
};

app.get("/", function(req, res) {
    console.log("we are in base");
    res.status(200).json({"this is what we are expecting":"yep"});
});

app.get("/art", function(req, res) {

    console.log("we are in get art");
    res.status(200).json({"this is what we are expecting from art":"yep"});
});

