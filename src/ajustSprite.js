var Phaser = require('phaser');
var _ = require('lodash');

module.exports = function(lulu,game){
	var dragPointManager = require('./dragPoint')(game);

	var setDrag = function(sprite,group,options){
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
		var update = function(){
			group.x += sprite.x;
			group.y += sprite.y;
			sprite.x = 0;
			sprite.y = 0;
		}

		self.start = function(){
			clear();
			frames = game.make.group();
			frames.update = update;
		}

		self.stop = function(){
			clear();
		}

		sprite.events.onDragStart.add(function(){
			self.start();
		})

		sprite.events.onDragStop.add(function(){
			self.stop();
			update();
		})
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


		var group = game.add.group();
		sprite.parent.add(group);
		group.add(sprite);

		group.x = sprite.x;
		group.y = sprite.y;
		sprite.x = 0;
		sprite.y = 0;

		if(options.drag) setDrag(sprite,group,options);


		var folder = panel.addFolder('Ajust Object '+_.padStart(lulu.indAjust,3,'0'));

		var x = folder.add(group, 'x').step(1);
		var y = folder.add(group, 'y').step(1);
		if(options.angle) {
			var angle = folder.add(group, 'angle').step(1);
		}

		if(options.showToggle){
			folder.add(group, 'visible');
			// obj.visible = options.hide.visible;
		}

		if(options.scale){
			var scaleFolder = folder.addFolder('scale');
			var scaleX = scaleFolder.add(group.scale, 'x').step(0.05).onChange(function(val){
				group.scale.y = val;
			});
			// var scaleY = scaleFolder.add(obj.scale, 'y').step(1);
		}

		if(options.listen){
			x.listen();
			y.listen();
			if(options.angle) angle.listen();
		}

		var pointPivot = dragPointManager.create();
		group.add(pointPivot);

		if(options.open) folder.open();
		return folder;
	}
}
