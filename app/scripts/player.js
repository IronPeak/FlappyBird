window.Player = (function() {
	'use strict';

	var Controls = window.Controls;

	// All these constants are in em's, multiply by 10 pixels
	// for 1024x576px canvas.
	var MAX_VELOCITY = 30;
	var MIN_VELOCITY = -30;
	var JUMP_FORCE = 20;
	var WIDTH = 5;
	var HEIGHT = 5;
	var GRAVITY = -25;
	var INITIAL_POSITION_X = 30;
	var INITIAL_POSITION_Y = 25;

	var Player = function(el, game) {
		this.el = el;
		this.game = game;
		this.pos = { x: 0, y: 0 };
		this.velocity = 0;
	};

	/**
	 * Resets the state of the player for a new game.
	 */
	Player.prototype.reset = function() {
		this.pos.x = INITIAL_POSITION_X;
		this.pos.y = INITIAL_POSITION_Y;
		this.velocity = 0;
	};

	Player.prototype.onFrame = function(delta) {
		if (Controls.isJumping()) {
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

		this.checkCollisionWithBounds();

		// Update UI
		this.el.css('transform', 'translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
	};

	Player.prototype.checkCollisionWithBounds = function() {
		if (this.pos.y < 0 || this.pos.y + HEIGHT > (this.game.WORLD_HEIGHT - 2)) {
			return this.game.gameover();
		}
	};

	return Player;

})();
