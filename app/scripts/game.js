
window.Game = (function() {
	'use strict';
	
	var MIN_TIME_BETWEEN_WALLS = 1;
	var MAX_TIME_BETWEEN_WALLS = 3;
	var MIN_MAX_LERP_DURATION = 120;

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
		this.soundmanager = new window.SoundManager(this.el.find('#sound-settings'));
		this.gamestart = +new Date() / 1000;
		this.ground = new window.Ground(this.el.find('.Ground'), this);
		this.preloadGameImages();
		this.ingameScore = this.el.find('.ingame-score');
	};

	/**
	 * Runs every frame. Calculates a delta and allows each game
	 * entity to update itself.
	 */
	Game.prototype.onFrame = function() {
		this.calculateGameSize();
				
		// Check if the game loop should stop.
		if (!this.isPlaying) {
			return;
		}
		
		this.soundmanager.music.play();
		
		// Calculate how long since last frame in seconds.
		var now = +new Date() / 1000,
				delta = now - this.lastFrame;
		this.lastFrame = now;
		
		this.timebetweenwalls = this.GetTimeBetweenWalls(now);
		console.log(this.timebetweenwalls);
		
		if(now > this.lastWallSpawn + this.timebetweenwalls) {
			this.lastWallSpawn = now;
			var top = -Math.random() * 36 - 12;
			var bot = top + 67;
			this.createWall(100, bot, false);
			this.createWall(100, top, true);
		}
		
		// Update game entities.
		this.player.onFrame(delta);
		
		this.ground.onFrame(delta);
		
		for(var i = 0; i < this.walls.length; i++) {
			if(this.walls[i] === undefined) {
				continue;
			}
			this.walls[i].onFrame(delta);
			if(this.walls[i].active === true)
			{
				if(this.walls[i].givePoint(this.player.pos.x) === true)
				{
					this.soundmanager.collect.play();
					this.score++;
					this.ingameScore.text(this.score);
				}
				if(this.walls[i].collidedWithPlayer(this.player.pos.x, this.player.pos.y, this.player.width, this.player.height) === true)
				{
					this.soundmanager.deathsound.play();
					this.player.setDeath();
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
	
	Game.prototype.createWall = function(x, y, collectable) {
		var wall = $('<div class="Wall"></div>');
		this.el.append(wall);
		for(var i = 0; i < this.walls.length; i++)
		{
			if(this.walls[i] === undefined)
			{
				this.walls[i] = new window.Wall(wall, this, x, y, collectable);
				return;
			}
		}
		this.walls.push(new window.Wall(wall, this, x, y, collectable));
	};
	
	Game.prototype.GetTimeBetweenWalls = function(time) {
		var diff = MAX_TIME_BETWEEN_WALLS - MIN_TIME_BETWEEN_WALLS;
		var norm = (time - this.gamestart) / MIN_MAX_LERP_DURATION;
		return Math.min((1 - norm) * diff + MIN_TIME_BETWEEN_WALLS, MAX_TIME_BETWEEN_WALLS);
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
		this.gamestart = +new Date() / 1000;
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
		this.soundmanager.music.stop();
		this.soundmanager.gameover.play();
		if(this.score > this.highScore)
		{
			this.highScore = this.score;
			this.el.find('#game-msg').text('New Highscore!');
		}
		else
		{
			this.el.find('#game-msg').text('Game Over!');
		}
		
		this.el.find('#score').text(this.score);
		this.el.find('#high_score').text(this.highScore);
		this.el.find('.Ground').stop();
		
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
	 * Preloads images for the game so the user won't experiance delay
	 */
	Game.prototype.preloadGameImages = function() {
		var img = new Image();
		img.src = '../images/player_flap.png';
		
		img = new Image();
		img.src = '../images/player_dead.png';
	};
	 
	/**
	 * Some shared constants.
	 */
	Game.prototype.WORLD_WIDTH = 102.4;
	Game.prototype.WORLD_HEIGHT = 57.6;

	return Game;
})();


