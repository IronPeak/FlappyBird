
window.Controls = (function() {
    'use strict';
	
	var SPACE = 32;

    /**
     * A singleton class which abstracts all player input,
     * should hide complexity of dealing with keyboard, mouse
     * and touch devices.
     * @constructor
     */
    var Controls = function() {
        this.keys = {};
		this.keydown = false;
		this.mousedown = false;
        $(window).on('mousedown', this._onMouseDown.bind(this));
		$(window).on('mouseup', this._onMouseUp.bind(this));
		$(window).on('keydown', this._onKeyDown.bind(this));
		$(window).on('keyup', this._onKeyUp.bind(this));
    };

    Controls.prototype._onMouseDown = function() {
        this.mousedown = true;
    };

    Controls.prototype._onMouseUp = function() {
		this.mousedown = false;
    };
	
	Controls.prototype._onKeyDown = function(e) {
        this.keydown = (e.keyCode === SPACE);
    };

    Controls.prototype._onKeyUp = function(e) {
		if(e.keyCode === SPACE)
		{
			this.keydown = false;
		}
    };

    /**
     * Only answers true once until a key is pressed again.
     */
    Controls.prototype.isJumping = function() {
		var answer = this.mousedown || this.keydown;
		this.mousedown = false;
		this.keydown = false;
        return answer;
    };
    
    // Export singleton.
    return new Controls();
})();
