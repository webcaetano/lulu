// var Phaser = require('phaser');

var self = {};

self.radPos = function(point,angle,range){
	var a = angle * (Math.PI / 180);
	return {
		x:point.x + (Math.cos(a) * range),
		y:point.y + (Math.sin(a) * range)
	}
}

self.dist = function(obj1,obj2){
	return Math.sqrt(Math.pow(obj1.x-obj2.x,2)+Math.pow(obj1.y-obj2.y,2));
}

self.setBtn = function(obj,callback){
	if(callback===undefined) callback=null;
	if(!obj) return;
	if(!obj.inputEnabled) obj.inputEnabled = true;
	if(!obj.input) return;
	obj.input.useHandCursor = true;
	if(callback){
		obj.events.onInputUp.add(function(e){
			callback(e);
		});
	}
	return obj;
}

self.setBtnHold = function(obj,callback,callback2){
	if(callback===undefined) callback=null;
	if(!obj) return;
	if(!obj.inputEnabled) obj.inputEnabled = true;
	if(!obj.input) return;
	obj.input.useHandCursor = true;

	if(callback){
		obj.events.onInputDown.add(function(e){
			callback(e);
		});
	}
	if(callback2){
		obj.events.onInputUp.add(function(e){
			callback2(e);
		});
	}
	return obj;
}

// self.setHover = function(obj,callback,callback2){
// 	if(callback===undefined) callback=null;
// 	if(callback2===undefined) callback2=null;

// 	if(!obj) return;
// 	if(!obj.inputEnabled) obj.inputEnabled = true;
// 	if(!obj.input) return;
// 	obj.input.useHandCursor = true;
// 	if(callback){
// 		obj.events.onInputOver.add(function(e){
// 			callback(e);
// 		});
// 	}
// 	if(callback2){
// 		obj.events.onInputOut.add(function(e){
// 			callback2(e);
// 		});
// 	}
// 	return obj;
// }

module.exports = self;
