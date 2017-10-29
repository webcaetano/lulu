var Phaser = require('phaser');
var _ = require('lodash');
var utils = require('./utils');

module.exports = function(game){
	var self = {};

	var createCarret = function(size=3){
		var carret = game.add.graphics(0,0)
		.beginFill('0x555555',1)
		// .drawCircle(0,0,size);
		.drawPolygon([
			{x:size/2,y:0},
			{x:size,y:size},
			{x:0,y:size},
			{x:size/2,y:0},
		]);

		carret.pivot.x = size/2;
		carret.pivot.y = size/2;

		return carret;
	}

	var setBody = function(pointer,options){
		var size = 20;
		var bkg = game.add.graphics(0,0)

		bkg.beginFill('0xFFFFFF',1)
		.lineStyle(1,'0x2E2E2E',1)
		.drawCircle(0,0,size);

		_.times(4,function(i){
			var angle = 0 + ((360/4)*i);

			var pos = utils.radPos({x:0,y:0},angle-90,size-13)

			var carret = createCarret();
			carret.x = pos.x;
			carret.y = pos.y;
			carret.angle = angle;

			bkg.addChild(carret);
		});

		pointer.addChild(bkg);
	}

	var setBodyMini = function(pointer,options){
		var size = 7;
		var bkg = game.add.graphics(0,0)

		bkg.beginFill('0xFF0000',0.3)
		.lineStyle(0.5,'0xFF0000',0.8)
		.drawCircle(0,0,size);

		pointer.addChild(bkg);
	}

	var setDrag = function(pointer,options){
		var {bkg} = pointer;
		var self = pointer.drag = {};
		var valid = false;

		var frames = null;
		var clear = function(){
			if(frames) {
				frames.pendingDestroy = true;
				frames.update = function(){};
			}
			frames = null;
		}

		self.start = function(){
			clear();

			frames = game.make.group();
			frames.update = function(){
				pointer.onChange.dispatch();
			};
		}

		self.stop = function(){
			clear();
		}

		if(!pointer.inputEnabled) pointer.inputEnabled = true;
		if(pointer.input && pointer.input.enableDrag){
			pointer.input.enableDrag();
		}

		utils.setBtnHold(pointer,function(){
			if(!pointer.active) return;

			valid = true;
			self.start();
			pointer.onPress.dispatch();
		},function(){
			if(!valid) return;

			valid = false;
			self.stop();
			pointer.onRelease.dispatch();
		});
	}

	self.create = function(group=null,x=0,y=0,options={}){
		var defaults = {
			x,
			y,
			group,
			active:true,
			mini:true,
		}

		options = _.extend({},defaults,options);

		var pointer = game.add.sprite(0,0);
		pointer.onPress = new Phaser.Signal;
		pointer.onRelease = new Phaser.Signal;
		pointer.onChange = new Phaser.Signal;
		pointer.active = options.active;

		if(!options.mini){
			setBody(pointer,options);
		} else {
			setBodyMini(pointer,options);
		}
		setDrag(pointer,options);

		pointer.x = options.x;
		pointer.y = options.y;

		if(options.group) options.group.add(pointer);

		pointer.setScaleMinMax(1,1);

		return pointer;
	}

	return self;
}
