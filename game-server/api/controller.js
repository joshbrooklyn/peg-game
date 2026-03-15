'use strict';


var mongoose = require('mongoose'),
GameResult = mongoose.model('GameResult');

exports.listAllGames = function(req, res) {
  GameResult.find({}, function(err, gameResult) {
    if (err)
      res.send(err);
    res.json(gameResult);
  });
};

exports.listAggregateResults = function (req, res) {
	GameResult.aggregate([
		{ $group: {_id: "$name", total: { $sum: "$game_score"}, average: { $avg: "$game_score"}}}]
		, function(err,gameResult) {
	    if (err)
  	    res.send(err);
	    res.json(gameResult);
		}
	)
};

exports.addGameResult = function(req, res) {
  var newGameResult = new GameResult(req.body);
  newGameResult.save(function(err, gameResult) {
    if (err)
      res.send(err);
    res.json(gameResult);
  });
};