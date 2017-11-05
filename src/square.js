var Phaser = require('phaser');
var _ = require('lodash');

module.exports = function(lulu,game){
	var dragPointManager = require('./dragPoint')(game);


	var setPoints = function(square,folder,options){
		var {data} = square;
		var points = square.points = _.map([
			{
				x:0,
				y:0,
				link:{
					'1':'y',
					'3':'x',
				}
			},
			{
				x:data.width,
				y:0,
				link:{
					'0':'y',
					'2':'x',
				}
			},
			{
				x:data.width,
				y:data.height,
				link:{
					'3':'y',
					'1':'x',
				}
			},
			{
				x:0,
				y:data.height,
				link:{
					'0':'x',
					'2':'y',
				}
			}
		],function(val,i){
			var point = dragPointManager.create(square);
			point.x = val.x;
			point.y = val.y;
			point.links = val.link;

			// point.onChange.add(function(){
			// 	console.log('x')
			// });

			return point;
		});


		_.each(points,function(point){
			_.each(point.links,function(attr,linkID){
				point.onChange.add(function(){
					var p = points[linkID];
					p[attr] = point[attr];

					square.onChange.dispatch();
				});
			});
		});
	}


	return function(sprite,options,subfolder){
		lulu.new();
		var panel = lulu.checkSubfolder(subfolder);
		lulu.indAjust++;

		var defaults = {
			x:0,
			y:0,
			width:100,
			height:100,
			open:true,
		};

		options = _.extend({},options,defaults);

		var square = game.add.group();
		square.onChange = new Phaser.Signal;

		var data = square.data = {
			width:options.width,
			height:options.height,
		}

		var folder = square.folder = panel.addFolder('Ajust Object '+_.padStart(lulu.indAjust,3,'0'));

		setPoints(square,folder,options);

		if(options.open) folder.open();

		return square;
	}
}
