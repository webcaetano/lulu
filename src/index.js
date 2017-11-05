var Phaser = require('phaser');
var _ = require('lodash');
var version = require('./version.json');

console.log('%c  Lulu '+version+'  ', 'font-size: 12px; font-weight:bold; background: #000000; color: #FF00AE');

module.exports = function(game){
	var lulu = {
		indAjust:0,
	};
	var dragPointManager = require('./dragPoint')(game);

	lulu.new = function(){
		if(lulu.dat) return;
		lulu.dat = new dat.GUI({autoPlace:false});

		var closeButton = lulu.dat.domElement.getElementsByClassName('close-button')[0];
		closeButton.style.display = 'none';

		var div = document.createElement("div");
		div.style.position = "absolute";
		div.style.bottom = "20px";
		div.style.left = "10px";
		div.appendChild(lulu.dat.domElement);
		document.body.appendChild(div);

		return lulu.dat;
	}

	lulu.newFolder = function(name='Folder',options){
		lulu.new();

		var defaults = {
			open:false,
		};

		options = _.defaultsDeep({},options,defaults);

		var folder = lulu.dat.addFolder(name);
		if(options.open) folder.open();

		return folder;
	}

	lulu.checkSubfolder = function(subfolder){
		if(_.isString(subfolder)){
			return lulu.dat.addFolder(subfolder)
		} else if(_.isObject(subfolder)) {
			return subfolder;
		} else {
			return lulu.dat;
		}
	}

	lulu.ajustSprite = require('./ajustSprite')(lulu,game);

	lulu.square = require('./square')(lulu,game)

	/*/
	//TEST

	var g1 = game.add.group();
	var g2 = game.add.group();

	// g2.add(g1);

	g1.scale.set(0.7);
	g2.scale.set(1.1);

	g1.x = 100;
	g1.y = 200;

	var point = dragPointManager.create(g1);
	point.x = 300;
	point.y = 300;
	/**/


	return lulu;
}
