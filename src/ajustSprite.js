var Phaser = require('phaser');
var _ = require('lodash');

module.exports = function(lulu,game){
	var dragPointManager = require('./dragPoint')(game);

	var setDrag = function(sprite,options,folder){
		if(!sprite.inputEnabled) sprite.inputEnabled = true;
		if(sprite.input && sprite.input.enableDrag){
			options.listen = true;
			sprite.input.enableDrag();
		}

		var frames = null;
		var clear = function(){
			if(frames) frames.pendingDestroy = true;
			frames = null;
		}

		var self = {};
		// var update = function(){
		// 	sprite.x += sprite.x;
		// 	sprite.y += sprite.y;
		// 	sprite.x = 0;
		// 	sprite.y = 0;
		// }

		self.start = function(){
			clear();
			// frames = game.make.group();
			// frames.update = update;
		}

		self.stop = function(){
			clear();
		}

		sprite.events.onDragStart.add(function(){
			self.start();
		})

		sprite.events.onDragStop.add(function(){
			self.stop();
			// update();
		})
	}

	var setPivoter = function(sprite,options,folder){
		var pivoter = dragPointManager.create();
		sprite.addChild(pivoter);
		var init = {x:0,y:0};
		var toggle = {visible:false};

		pivoter.onChange.add(function(){
		})

		pivoter.onPress.add(function(){
			init = {x:pivoter.x,y:pivoter.y};
		})

		pivoter.onRelease.add(function(){
			var diff = {
				x:init.x-pivoter.x,
				y:init.y-pivoter.y,
			};

			sprite.pivot.x = pivoter.x;
			sprite.pivot.y = pivoter.y;
			sprite.x -= diff.x;
			sprite.y -= diff.y;
		})

		var pivotFolder = folder.addFolder('pivot');
		var x = pivotFolder.add(sprite.pivot, 'x')
		var y = pivotFolder.add(sprite.pivot, 'y')

		x.listen();
		y.listen();

		pivotFolder.add(toggle, 'visible').onChange(function(val){
			pivoter.visible = val;
		});
		pivoter.visible = toggle.visible;
	}

	var setScale = function(sprite,options,folder){
		var scaleFolder = folder.addFolder('scale');
		var scaleX = scaleFolder.add(sprite.scale, 'x').step(0.05).onChange(function(val){
			sprite.scale.y = val;
		});
			// var scaleY = scaleFolder.add(obj.scale, 'y').step(1);
	}

	var setBasics = function(sprite,options,folder){
		var x = folder.add(sprite, 'x').step(1);
		var y = folder.add(sprite, 'y').step(1);
		var color = {tint:'#FFFFFF'}
		if(options.angle) {
			var angle = folder.add(sprite, 'angle').step(1);
		}

		folder.addColor(color, 'tint').onChange(function(val){
			sprite.tint = val.replace('#','0x');
		});

		if(options.showToggle){
			folder.add(sprite, 'visible');
		}

		if(options.listen){
			x.listen();
			y.listen();
			if(options.angle) angle.listen();
		}

		folder.add(sprite, 'alpha',0,1).step(0.05);
	}

	return function(sprite,options,subfolder){
		lulu.new();
		var panel = lulu.checkSubfolder(subfolder);
		lulu.indAjust++;

		var defaults = {
			x:0,
			y:0,
			angle:true,
			listen:true,
			open:true,
			drag:true,
			scale:true,
			showToggle:true,
		};

		options = _.extend({},options,defaults);

		var folder = panel.addFolder('Ajust Object '+_.padStart(lulu.indAjust,3,'0'));

		setBasics(sprite,options,folder);
		if(options.drag) setDrag(sprite,options,folder);
		if(options.scale) setScale(sprite,options,folder);
		setPivoter(sprite,options,folder);

		if(options.open) folder.open();

		return folder;
	}
}
