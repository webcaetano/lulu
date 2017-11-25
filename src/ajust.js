var Phaser = require('phaser');
var _ = require('lodash');

module.exports = function(lulu,game){
	var dragPointManager = require('./dragPoint')(game);

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
		if(options.scale) setScale(sprite,options,folder);

		if(options.open) folder.open();

		return folder;
	}
}
