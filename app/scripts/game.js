
window.Game = (function() {
	'use strict';
	
	var TIME_BETWEEN_WALLS = 3;

	/**
	 * Main game class.
	 * @param {Element} el jQuery element containing the game.
	 * @constructor
	 */
	var Game = function(el) {
		this.el = el;
		this.player = new window.Player(this.el.find('.Player'), this);
		this.isPlaying = false;
		this.calculateGameSize();
		// Cache a bound onFrame since we need it each frame.
		this.onFrame = this.onFrame.bind(this);
		this.lastWallSpawn = -1;
		this.walls = [];
		this.score = 0;
		this.highScore = 0;
		this.soundmanager = new window.SoundManager(this.el.find('#sound'));
		if(this.el.find('#sound') === undefined) console.log("WTF");
	};

	/**
	 * Runs every frame. Calculates a delta and allows each game
	 * entity to update itself.
	 */
	Game.prototype.onFrame = function() {
		this.soundmanager.music.play();
		
		// Check if the game loop should stop.
		if (!this.isPlaying) {
			return;
		}

		this.calculateGameSize();
		
		// Calculate how long since last frame in seconds.
		var now = +new Date() / 1000,
				delta = now - this.lastFrame;
		this.lastFrame = now;
		
		if(now > this.lastWallSpawn + TIME_BETWEEN_WALLS) {
			this.lastWallSpawn = now;
			var top = -Math.random() * 36 - 12;
			var bot = top + 67;
			this.createWall(100, bot);
			this.createWall(100, top);
		}
		
		// Update game entities.
		this.player.onFrame(delta);
		
		for(var i = 0; i < this.walls.length; i++) {
			if(this.walls[i] === undefined) {
				continue;
			}
			this.walls[i].onFrame(delta);
			if(this.walls[i].active === true)
			{
				if(this.walls[i].givePoint(this.player.pos.x) === true)
				{
					this.score++;
				}
				if(this.walls[i].collidedWithPlayer(this.player.pos.x, this.player.pos.y, this.player.width, this.player.height) === true)
				{
					this.gameover();
				}
			}
			else
			{
				if(this.walls[i].outOfBounds() === true)
				{
					this.walls[i].el.remove();
					delete this.walls[i];
				}
			}
		}

		// Request next frame.
		window.requestAnimationFrame(this.onFrame);
	};
	
	Game.prototype.createWall = function(x, y) {
		var wall = $('<div class="Wall"></div>');
		this.el.append(wall);
		for(var i = 0; i < this.walls.length; i++)
		{
			if(this.walls[i] === undefined)
			{
				this.walls[i] = new window.Wall(wall, this, x, y);
				return;
			}
		}
		this.walls.push(new window.Wall(wall, this, x, y));
	};

	/**
	 * Starts a new game.
	 */
	Game.prototype.start = function() {
		this.reset();
		
		// Restart the onFrame loop
		this.lastFrame = +new Date() / 1000;
		window.requestAnimationFrame(this.onFrame);
		this.isPlaying = true;
	};

	/**
	 * Resets the state of the game so a new game can be started.
	 */
	Game.prototype.reset = function() {
		this.player.reset();
		this.lastWallSpawn = -1;
		this.score = 0;
		for(var i = 0; i < this.walls.length; i++) {
			if(this.walls[i] !== undefined)
			{
				this.walls[i].el.remove();
				delete this.walls[i];
			}
		}
		this.walls = [];
	};

	/**
	 * Signals that the game is over.
	 */
	Game.prototype.gameover = function() {
		this.isPlaying = false;

		if(this.score > this.highScore)
		{
			this.highScore = this.score;
			this.el.find('#game_msg').text('New Highscore!');
		}
		else
		{
			this.el.find('#game_msg').text('Game Over!');
		}
		
		this.el.find('#score').text(this.score);
		this.el.find('#high_score').text(this.highScore);
		
		// Should be refactored into a Scoreboard class.
		var that = this;
		var scoreboardEl = this.el.find('.Scoreboard');
		scoreboardEl
			.addClass('is-visible')
			.find('.Scoreboard-restart')
				.one('click', function() {
					scoreboardEl.removeClass('is-visible');
					that.start();
				});
	};
	
	/**
	 * Calculates the correct size of the game canvas
	 */
	Game.prototype.calculateGameSize = function() {
		this.fontSize = Math.min(
			window.innerWidth / this.WORLD_WIDTH,
			window.innerHeight / this.WORLD_HEIGHT
		);
		this.el.css('fontSize', this.fontSize + 'px');
	};
	 
	/**
	 * Some shared constants.
	 */
	Game.prototype.WORLD_WIDTH = 102.4;
	Game.prototype.WORLD_HEIGHT = 57.6;

	return Game;
})();


