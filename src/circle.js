var Phaser = require('phaser');
var _ = require('lodash');

module.exports = function(lulu,game){
	var dragPointManager = require('./dragPoint')(game);

	var setBody = function(circle,folder,options){
		var {data,points} = circle;

		var midPoint = circle.midPoint = dragPointManager.create(circle,0,0,{
			mini:false
		});

		var body = circle.body = game.add.graphics();

		body.parent.sendToBack(body);

		var updateCircle = function(){
			body.clear();

			body.beginFill('0xFF0000',0.1)
			.lineStyle(1,'0xFF0000',0.5);

			body.drawCircle(midPoint.x,midPoint.y,data.radius)
		}

		updateCircle();

		circle.add(body);

		circle.onChange.add(function(data){
			updateCircle();
		},null,1);
	}

	var setDrag = function(circle,options,folder){
		var {body,data,midPoint} = circle;

		midPoint.onChange.add(function(){
			var {data} = circle;
			circle.x = circle.x + midPoint.x;
			circle.y = circle.y + midPoint.y;

			circle.updateData();
			circle.onChange.dispatch(circle.data);
		});

		midPoint.onPress.add(()=> circle.onDragStart.dispatch());
		midPoint.onRelease.add(()=> circle.onDragStop.dispatch());
	}

	// var setPoints = function(circle,folder,options){
	// 	var {data} = circle;
	// 	var points = circle.points = _.map([
	// 		{
	// 			x:0,
	// 			y:0,
	// 			link:{
	// 				'1':'y',
	// 				'3':'x',
	// 			},
	// 		},
	// 		{
	// 			x:data.width,
	// 			y:0,
	// 			link:{
	// 				'0':'y',
	// 				'2':'x',
	// 			},
	// 		},
	// 		{
	// 			x:data.width,
	// 			y:data.height,
	// 			link:{
	// 				'3':'y',
	// 				'1':'x',
	// 			},
	// 		},
	// 		{
	// 			x:0,
	// 			y:data.height,
	// 			link:{
	// 				'0':'x',
	// 				'2':'y',
	// 			},
	// 		}
	// 	],function(val,i){
	// 		var point = dragPointManager.create(circle);
	// 		point.id = i;
	// 		point.x = val.x;
	// 		point.y = val.y;
	// 		point.links = val.link;

	// 		return point;
	// 	});

	// 	_.each(points,function(point){
	// 		point.onChange.add(function(){
	// 			_.each(point.links,function(attr,linkID){
	// 				var p = points[linkID];
	// 				p[attr] = point[attr];
	// 			});

	// 			circle.updateData();
	// 			circle.onChange.dispatch(circle.data);
	// 		});
	// 	});
	// }

	var setData = function(circle,folder,options){
		var {data,points} = circle;
		var offset = {x:circle.x,y:circle.y};

		// var updatePoints = function(){
		// 	_.each(points,function(point){
		// 		_.each(point.links,function(attr,linkID){
		// 			var p = points[linkID];
		// 			p[attr] = point[attr];
		// 		});
		// 	});
		// }

		folder.add(circle,'x').listen().onChange(function(val){
			// updatePoints();
			circle.onChange.dispatch();
		});

		folder.add(circle,'y').listen().onChange(function(val){
			// updatePoints();
			circle.onChange.dispatch();
		});

		// var width = folder.add(circle.data,'width').listen().onChange(function(val){
		// 	points[1].x = val;
		// 	points[2].x = val;

		// 	updatePoints();
		// 	circle.onChange.dispatch();
		// });

		// var height = folder.add(circle.data,'height').listen().onChange(function(val){
		// 	points[3].y = val;
		// 	points[2].y = val;

		// 	updatePoints();
		// 	circle.onChange.dispatch();
		// });
	}

	var setMethods = function(circle,folder,options){
		var {data,points} = circle;

		circle.updateData = function(){
			circle.midPoint.x = 0;
			circle.midPoint.y = 0;

			circle.data.x = circle.x;
			circle.data.y = circle.y;
		}
	}

	return function(options,subfolder){
		lulu.new();
		var panel = lulu.checkSubfolder(subfolder);
		lulu.indAjust++;

		var defaults = {
			x:0,
			y:0,
			radius:100,
			open:true,
			drag:true,
		};

		options = _.extend({},defaults,options);

		var circle = game.add.group();
		circle.onChange = new Phaser.Signal;
		circle.onDragStart = new Phaser.Signal;
		circle.onDragStop = new Phaser.Signal;

		var data = circle.data = {
			x:0,
			y:0,
			radius:options.radius,
		}

		var folder = circle.folder = panel.addFolder('Ajust Object '+_.padStart(lulu.indAjust,3,'0'));

		// setPoints(circle,folder,options);
		setMethods(circle,folder,options);
		setBody(circle,folder,options);
		setData(circle,folder,options);
		if(options.drag) setDrag(circle,folder,options);

		if(options.open) folder.open();

		return circle;
	}
}
