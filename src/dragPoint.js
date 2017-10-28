var Phaser = require('phaser');
var _ = require('lodash');
var utils = require('./utils');

module.exports = function(game){
	var self = {};

	var createCarret = function(size=3){
		var carret = game.add.group();

		var bkg = game.add.graphics(0,0)
		.beginFill('0x555555',1)
		// .drawCircle(0,0,size);
		.drawPolygon([
			{x:size/2,y:0},
			{x:size,y:size},
			{x:0,y:size},
			{x:size/2,y:0},
		]);

		bkg.x = -bkg.width/2;
		bkg.y = -bkg.height/2;

		carret.add(bkg);

		return carret;
	}

	var setBody = function(pointer,options){
		var size = 20;

		var bkg = pointer.bkg = game.add.graphics(0,0);
		bkg.beginFill('0xFFFFFF',1)
		.lineStyle(1,'0x2E2E2E',1)
		.drawCircle(0,0,size);
		pointer.add(bkg);

		_.times(4,function(i){
			var angle = 0 + ((360/4)*i);
			var pos = utils.radPos({x:0,y:0},angle-90,size-13)

			var carret = createCarret();
			carret.x = pos.x;
			carret.y = pos.y;
			carret.angle = angle;

			pointer.add(carret);
		})


		if(options.group) group.add(pointer);
	}

	var setBodyMini = function(pointer,options){
		var size = 7;

		var bkg = pointer.bkg = game.add.graphics(0,0);
		bkg.beginFill('0xFF0000',0.3)
		.lineStyle(0.5,'0xFF0000',0.8)
		.drawCircle(0,0,size);
		pointer.add(bkg);

		if(options.group) group.add(pointer);
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

			var diff = {
				x:game.input.x - pointer.worldPosition.x,
				y:game.input.y - pointer.worldPosition.y,
			}

			// var init = {
			// 	x:pointer.x,
			// 	y:pointer.y,
			// }

			// var initalWorldPos = {
			// 	x:pointer.worldPosition.x,
			// 	y:pointer.worldPosition.y,
			// }

			var multiplier = {
				x:pointer.x/pointer.worldPosition.x,
				y:pointer.y/pointer.worldPosition.y,
			}

			frames = game.make.group();
			frames.update = function(){
				pointer.x = (game.input.x - diff.x) * multiplier.x;
				pointer.y = (game.input.y - diff.y) * multiplier.y;
			};
		}

		self.stop = function(){
			clear();
		}

		utils.setBtnHold(bkg,function(){
			if(!pointer.active) return;

			valid = true;
			self.start();
		},function(){
			if(!valid) return;

			valid = false;
			self.stop();
		})
	}

	self.create = function(x=0,y=0,group=null,options={}){
		var defaults = {
			x,
			y,
			group,
			active:true,
			mini:true,
		}

		options = _.extend({},defaults,options);

		var pointer = game.add.group();
		pointer.active = options.active;

		if(!options.mini){
			setBody(pointer,options);
		} else {
			setBodyMini(pointer,options);
		}
		setDrag(pointer,options);

		pointer.x = options.x;
		pointer.y = options.y;

		return pointer;
	}

	return self;
}
