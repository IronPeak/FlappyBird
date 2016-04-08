window.SoundManager = (function() {
	'use strict';
	
	// Taken from http://www.w3schools.com/games/game_sound.asp
	var SoundManager = function() {
		this.flapsound = new window.Sound('../audio/flap.mp3');
	}
	
	return SoundManager;
	
})();