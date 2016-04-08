window.SoundManager = (function() {
	'use strict';
	
	// Taken from http://www.w3schools.com/games/game_sound.asp
	var SoundManager = function(el) {
		this.el = el;
		this.music = new window.Sound('../audio/music.mp3', el);
		this.flapsound = new window.Sound('../audio/flap.mp3', el);
		this.collect = new window.Sound('../audio/collect.mp3', el);
		this.deathsound = new window.Sound('../audio/death.mp3', el);
		this.gameover = new window.Sound('../audio/gameover.mp3', el);
	};
	
	return SoundManager;
	
})();