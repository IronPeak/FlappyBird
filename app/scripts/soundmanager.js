window.SoundManager = (function() {
	'use strict';
		
	// Taken from http://www.w3schools.com/games/game_sound.asp
	var SoundManager = function(el) {
		this.el = el;
		this.musicel = this.el.find('#music');
		this.soundsel = this.el.find('#sounds');
		this.music = new window.Sound('../audio/music.mp3', this.musicel);
		this.flapsound = new window.Sound('../audio/flap.mp3', this.soundsel);
		this.collect = new window.Sound('../audio/collect.mp3', this.soundsel);
		this.deathsound = new window.Sound('../audio/death.mp3', this.soundsel);
		this.gameover = new window.Sound('../audio/gameover.mp3', this.musicel);
	};
	
	return SoundManager;
	
})();