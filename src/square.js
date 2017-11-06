var Phaser = require('phaser');
var _ = require('lodash');

module.exports = function(lulu,game){
	var dragPointManager = require('./dragPoint')(game);

	var setBody = function(square,folder,options){
		var {data,points} = square;

		var body = square.body = game.add.graphics();

		var updateRect = function(){
			body.clear();

			body.beginFill('0xFF0000',0.1)
			.lineStyle(1,'0xFF0000',0.5);

			body.drawRect(points[0].x,points[0].y,points[1].x-points[0].x,points[3].y-points[0].y)
		}

		updateRect();

		square.add(body);

		square.onChange.add(function(data){
			updateRect();
		},null,1);
	}

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
			point.onChange.add(function(){
				_.each(point.links,function(attr,linkID){
					var p = points[linkID];
					p[attr] = point[attr];
				});

				square.updateData();
				square.onChange.dispatch(square.data);
			});
		});
	}

	var setData = function(square,folder,options){
		var {data,points} = square;

		var updatePoints = function(){
			_.each(points,function(point){
				_.each(point.links,function(attr,linkID){
					var p = points[linkID];
					p[attr] = point[attr];
				});
			});
		}

		square.onChange.add(function(){
			data.height = points[3].y-points[0].y;
		});

		folder.add(data,'x').listen().onChange(function(val){

			updatePoints();
			square.onChange.dispatch();
		});

		folder.add(data,'y').listen().onChange(function(val){

			updatePoints();
			square.onChange.dispatch();
		});

		folder.add(data,'width').listen().onChange(function(val){
			points[1].x = val;
			points[2].x = val;

			updatePoints();
			square.onChange.dispatch();
		});

		folder.add(data,'height').listen().onChange(function(val){
			points[3].y = val;
			points[2].y = val;

			updatePoints();
			square.onChange.dispatch();
		});
	}

	var setMethods = function(square,folder,options){
		var {data,points} = square;

		var getPoint = square.getPoint = {
			topLeft(){
				var current = null;
				_.each(points,function(point,i){
					if(current===null || (point.x<current.x || point.y<current.y)){
						current = point;
					}
				});

				return current;
			},
			topRight(){
				var current = null;
				_.each(points,function(point,i){
					if(current===null || (point.x>current.x || point.y<current.y)){
						current = point;
					}
				});

				return current;
			},
			bottomLeft(){
				var current = null;
				_.each(points,function(point,i){
					if(current===null || (point.x<current.x || point.y>current.y)){
						current = point;
					}
				});

				return current;
			},
			bottomRight(){
				var current = null;
				_.each(points,function(point,i){
					if(current===null || (point.x>current.x || point.y>current.y)){
						current = point;
					}
				});

				return current;
			}
		}

		square.updateData = function(){
			var topLeftPoint = getPoint.topLeft();
			var topRightPoint = getPoint.topRight();
			var bottomLeftPoint = getPoint.bottomLeft();

			square.data = {
				x:square.x+topLeftPoint.x,
				y:square.y+topLeftPoint.y,
				width:topRightPoint.x-topLeftPoint.x,
				height:bottomLeftPoint.y-topLeftPoint.y,
			};
		}
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
			x:0,
			y:0,
			width:options.width,
			height:options.height,
		}

		var folder = square.folder = panel.addFolder('Ajust Object '+_.padStart(lulu.indAjust,3,'0'));

		setPoints(square,folder,options);
		setMethods(square,folder,options);
		setBody(square,folder,options);
		setData(square,folder,options);

		if(options.open) folder.open();

		return square;
	}
}
