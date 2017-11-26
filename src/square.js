var Phaser = require('phaser');
var _ = require('lodash');

module.exports = function(lulu,game){
	var dragPointManager = require('./dragPoint')(game);

	var setBody = function(square,folder,options){
		var {data,points} = square;

		var body = square.body = game.add.graphics();

		body.parent.sendToBack(body);

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

	var setDrag = function(square,options,folder){
		var {body,data} = square;
		var midPoint = square.midPoint = dragPointManager.create(square,0,0,{
			mini:false
		});

		midPoint.x = data.width/2;
		midPoint.y = data.height/2;


		midPoint.onChange.add(function(){
			var {data} = square;
			square.x = square.x + (midPoint.x-(data.width/2));
			square.y = square.y + (midPoint.y-(data.height/2));

			// midPoint.x = data.width/2;
			// midPoint.y = data.height/2;

			square.updateData();
			square.onChange.dispatch(square.data);
		});

		midPoint.onPress.add(()=> square.onDragStart.dispatch());
		midPoint.onRelease.add(()=> square.onDragStop.dispatch());
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
				},
			},
			{
				x:data.width,
				y:0,
				link:{
					'0':'y',
					'2':'x',
				},
			},
			{
				x:data.width,
				y:data.height,
				link:{
					'3':'y',
					'1':'x',
				},
			},
			{
				x:0,
				y:data.height,
				link:{
					'0':'x',
					'2':'y',
				},
			}
		],function(val,i){
			var point = dragPointManager.create(square);
			point.id = i;
			point.x = val.x;
			point.y = val.y;
			point.links = val.link;

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
		var offset = {x:square.x,y:square.y};

		var updatePoints = function(){
			_.each(points,function(point){
				_.each(point.links,function(attr,linkID){
					var p = points[linkID];
					p[attr] = point[attr];
				});
			});
		}

		folder.add(square,'x').listen().onChange(function(val){
			updatePoints();
			square.onChange.dispatch();
		});

		folder.add(square,'y').listen().onChange(function(val){
			updatePoints();
			square.onChange.dispatch();
		});

		var width = folder.add(square.data,'width').listen().onChange(function(val){
			points[1].x = val;
			points[2].x = val;

			updatePoints();
			square.onChange.dispatch();
		});

		var height = folder.add(square.data,'height').listen().onChange(function(val){
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
			var bottomRightPoint = getPoint.bottomRight();

			square.data.width = topRightPoint.x-topLeftPoint.x;
			square.data.height = bottomLeftPoint.y-topLeftPoint.y;

			square.x = topLeftPoint.x+square.x;
			square.y = topLeftPoint.y+square.y;

			topLeftPoint.x = 0;
			topLeftPoint.y = 0;

			topRightPoint.x = square.data.width;
			topRightPoint.y = 0;

			bottomLeftPoint.x = 0;
			bottomLeftPoint.y = square.data.height;

			bottomRightPoint.x = square.data.width;
			bottomRightPoint.y = square.data.height;

			square.data.x = square.x;
			square.data.y = square.y;

			if(square.midPoint){
				square.midPoint.x = square.data.width/2;
				square.midPoint.y = square.data.height/2;
			}
		}
	}

	return function(options,subfolder){
		lulu.new();
		var panel = lulu.checkSubfolder(subfolder);
		lulu.indAjust++;

		var defaults = {
			x:0,
			y:0,
			width:100,
			height:100,
			open:true,
			drag:true,
		};

		options = _.extend({},defaults,options);

		var square = game.add.group();
		square.onChange = new Phaser.Signal;
		square.onDragStart = new Phaser.Signal;
		square.onDragStop = new Phaser.Signal;

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
		if(options.drag) setDrag(square,folder,options);

		if(options.open) folder.open();

		return square;
	}
}
