
window.Controls = (function() {
    'use strict';

    /**
     * A singleton class which abstracts all player input,
     * should hide complexity of dealing with keyboard, mouse
     * and touch devices.
     * @constructor
     */
    var Controls = function() {
        this.keys = {};
		this.mousedown = false;
        $(window).on('mousedown', this._onMouseDown.bind(this));
		$(window).on('mouseup', this._onMouseUp.bind(this));
    };

    Controls.prototype._onMouseDown = function() {
        this.mousedown = true;
    };

    Controls.prototype._onMouseUp = function() {
		this.mousedown = false;
    };

    /**
     * Only answers true once until a key is pressed again.
     */
    Controls.prototype.isJumping = function() {
		var answer = this.mousedown;
		this.mousedown = false;
        return answer;
    };
    
    // Export singleton.
    return new Controls();
})();
