window.Player = (function() {
	'use strict';

	var Controls = window.Controls;

	// All these constants are in em's, multiply by 10 pixels
	// for 1024x576px canvas.
	var MAX_VELOCITY = 30;
	var MIN_VELOCITY = -30;
	var JUMP_FORCE = 50;
	var WIDTH = 5;
	var HEIGHT = 5;
	var GRAVITY = -50;
	var INITIAL_POSITION_X = 30;
	var INITIAL_POSITION_Y = 25;

	var Player = function(el, game) {
		this.el = el;
		this.game = game;
		this.pos = { x: 0, y: 0 };
		this.velocity = 0;
		this.width = WIDTH;
		this.height = HEIGHT;
	};

	/**
	 * Resets the state of the player for a new game.
	 */
	Player.prototype.reset = function() {
		this.el.css('background-image', 'url("../images/player.png")');
		this.pos.x = INITIAL_POSITION_X;
		this.pos.y = INITIAL_POSITION_Y;
		this.velocity = 0;
	};

	Player.prototype.onFrame = function(delta) {
		if (Controls.isJumping()) {
			this.el.css('background-image', 'url("../images/player_flap.png")');
			this.el.css('animation', 'player-flap 0.25s linear 1 running');
			this.velocity = JUMP_FORCE;
		}
		this.velocity += delta * GRAVITY;
		
		if(this.velocity < MIN_VELOCITY)
		{
			this.velocity = MIN_VELOCITY;
		}
		else if(this.velocity > MAX_VELOCITY)
		{
			this.velocity = MAX_VELOCITY;
		}
		
		this.pos.y -= this.velocity * delta;

		// Update UI
		this.el.css('transform', 'translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)' + ' rotate(' + this.rotation(this.velocity) + 'deg)');
		if(this.velocity < 0)
		{
			this.el.css('background-image', 'url("../images/player.png")');
			this.el.css('animation', 'none');
		}
		
		this.checkCollisionWithBounds();
	};

	Player.prototype.checkCollisionWithBounds = function() {
		if (this.pos.y < 0 || this.pos.y + HEIGHT > (this.game.WORLD_HEIGHT - 2)) {
			this.el.css('background-image', 'url("../images/player_dead.png")');
			return this.game.gameover();
		}
	};
	
	Player.prototype.rotation = function(vel) {
		if(vel < 0)
		{
			return (vel / MIN_VELOCITY) * 45;
		}
		else
		{
			return -(vel / MAX_VELOCITY) * 45;
		}
	};

	return Player;

})();
