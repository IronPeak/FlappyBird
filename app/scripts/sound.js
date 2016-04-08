window.Sound = (function() {
	'use strict';
	
	// Taken from http://www.w3schools.com/games/game_sound.asp
	var Sound = function(src, el) {
		this.el = el;
		this.sound = document.createElement("audio");
		this.sound.src = src;
		this.sound.setAttribute("preload", "auto");
		this.sound.setAttribute("controls", "none");
		this.sound.style.display = "none";
		document.body.appendChild(this.sound);
		this.play = function(){
			if(this.el.is(':checked'))
			{
				this.sound.play();
			}
		}
		this.stop = function(){
			if(this.el.checked)
			{
				this.pause.play();
			}
		}
	}
	
	return Sound;
	
})();