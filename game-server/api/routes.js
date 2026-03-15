'use strict';
module.exports = function(app) {
  var gameResult = require('./controller');

  app.route('/game_results')
    .get(gameResult.listAllGames)
    .post(gameResult.addGameResult);
    
	app.route('/aggregate_results')
		.get(gameResult.listAggregateResults);
};