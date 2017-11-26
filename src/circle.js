var Phaser = require('phaser');
var _ = require('lodash');
var utils = require('./utils');

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

			body.drawCircle(midPoint.x,midPoint.y,data.radius*2)
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

	var setPoints = function(circle,folder,options){
		var {data} = circle;
		var radLine = circle.radLine = game.add.graphics(0,0);
		radLine.lineStyle(1,'0xFF0000',0.5);
		radLine.moveTo(0,0);
		radLine.lineTo(data.radius,0);
		circle.add(radLine);


		var radPoint = circle.radPoint = dragPointManager.create(circle,0,0,{
			vertical:false
		});
		radPoint.x = data.radius;
		radPoint.y = 0;

		radPoint.onChange.add(function(){
			circle.data.radius = utils.dist({x:0,y:0},radPoint);
			circle.onChange.dispatch();
		})

		circle.onChange.add(function(){
			radLine.clear();
			radLine.lineStyle(1,'0xFF0000',0.5);
			radLine.moveTo(0,0);
			radLine.lineTo(data.radius,0);

			radPoint.x = data.radius;
			radPoint.y = 0;
		});
	}

	var setData = function(circle,folder,options){
		var {data,points} = circle;
		var offset = {x:circle.x,y:circle.y};

		folder.add(circle,'x').listen().onChange(function(val){
			circle.onChange.dispatch();
		});

		folder.add(circle,'y').listen().onChange(function(val){
			circle.onChange.dispatch();
		});

		var radius = folder.add(circle.data,'radius').listen().onChange(function(val){
			circle.onChange.dispatch();
		});
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
			radius:60,
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

		setPoints(circle,folder,options);
		setMethods(circle,folder,options);
		setBody(circle,folder,options);
		setData(circle,folder,options);
		if(options.drag) setDrag(circle,folder,options);

		if(options.open) folder.open();

		return circle;
	}
}
