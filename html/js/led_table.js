function LedDot(x, y, baseColor, size, onRadius, offRadius) {
	this.state = false;
	this.size = size;
	this.onColor = baseColor;
	this.offColor = colorLuminance(baseColor, -.5);
	this.onRadius = onRadius;
	this.offRadius = offRadius;
	this.coordinates = {
		x: x,
		y: y
	}
}
LedDot.prototype = {
	state: false,
	setState: function(bool) {
		this.state = bool;
	},
	getState: function() {
		return this.state;
	},
	setColor: function(color) {
		this.onColor = color;
		this.offColor = colorLuminance(color, -.5);
	},
	render: function(canvas) {
		canvas.clearRect(this.coordinates.x, this.coordinates.y, this.size, this.size);
		canvas.beginPath();
		if (this.state) {
			canvas.arc(
					this.coordinates.x + this.size / 2,
					this.coordinates.y + this.size / 2,
				this.onRadius, 0, 360, false
			);
			canvas.fillStyle = this.onColor;
			canvas.fill();
		}
		canvas.arc(
				this.coordinates.x + this.size / 2,
				this.coordinates.y + this.size / 2,
			this.offRadius, 0, 360, false
		);
		canvas.strokeStyle = this.offColor;
		canvas.stroke();
	}
};

function LedChar(x, y, baseColor, size, onRadius, offRadius) {
	var i, j;
	this.width = 7;
	this.height = 9;
	this.charSoul = [];
	this.matrix = [];
	for (j = 0; j < this.height; j++) {
		for (i = 0; i < this.width; i++) {
			this.matrix.push(new LedDot(x + i * size, y + j * size, baseColor, size, onRadius, offRadius));
		}
	}
}
LedChar.prototype = {
	setChar: function(charKey, charSoul) {
		this.charSoul = charSoul;
		this.charKey = charKey;
	},
	show: function(canvas) {
		var i;
		if (this.charSoul) {
			for (i = 0; i < this.matrix.length; i++) {
				this.matrix[i].setState(!!this.charSoul[i]);
			}
		}
		this.render(canvas);
	},
	hide: function(canvas) {
		var i;
		for (i = 0; i < this.matrix.length; i++) {
			this.matrix[i].setState(false);
		}
		this.render(canvas);
	},
	render: function(canvas) {
		var i;
		for (i = 0; i < this.matrix.length; i++) {
			this.matrix[i].render(canvas);
		}
	},
	setColor: function(color) {
		var i;
		for (i = 0; i < this.matrix.length; i++) {
			this.matrix[i].setColor(color);
		}
	}
};

function LedString(x, y, baseColor, size, onRadius, offRadius, length) {
	var i;
	this.length = length;
	this.chars = [];
	this.value = '';
	for (i = 0; i < length; i++) {
		this.chars.push(new LedChar(x + i * 8 * size, y, baseColor, size, onRadius, offRadius));
	}
}
LedString.prototype = {
	setValue: function(string) {
		var i;
		this.value = string.substring(0, this.length);
		for (i = 0; i < this.length; i++) {
			if (this.value[i]) {
				this.chars[i].setChar(this.value[i], ABC[this.value[i]]);
			} else {
				this.chars[i].setChar(' ', ABC[' ']);
			}
		}
	},
	render: function(canvas) {
		var i;
		for (i = 0; i < this.length; i++) {
			this.chars[i].render(canvas);
		}
	},
	show: function(canvas) {
		var i;
		for (i = 0; i < this.length; i++) {
			this.chars[i].show(canvas);
		}
	},
	hide: function(canvas) {
		var i;
		for (i = 0; i < this.length; i++) {
			this.chars[i].hide(canvas);
		}
	},
	setColor: function(color) {
		var i;
		for (i = 0; i < this.length; i++) {
			this.chars[i].setColor(color);
		}
	}
};

function LedTable(options) {
	this.canvas = document.getElementById(options.canvasId).getContext('2d');
	this.options = {
		charHeight: 9,
		charWidth: 7,
		dotSpace: 5,
		dotOnRadius: 2.5,
		dotOffRadius: 1.5
	};

	this.showDot = function(x, y, color, condition) {
		this.canvas.clearRect(
				x * this.options.dotSpace,
				y * this.options.dotSpace,
				this.options.dotSpace, this.options.dotSpace);
		this.canvas.beginPath();
		if (condition == 1) {
			this.canvas.arc(
					x * this.options.dotSpace + this.options.dotSpace / 2,
					y * this.options.dotSpace + this.options.dotSpace / 2,
					this.options.dotOnRadius, 0, 360, false);
			this.canvas.fillStyle = "#0e0";
			this.canvas.fill();
		} else {
			this.canvas.arc(
					x * this.options.dotSpace + this.options.dotSpace / 2,
					y * this.options.dotSpace + this.options.dotSpace / 2,
					this.options.dotOffRadius, 0, 360, false);
			this.canvas.strokeStyle = "#070";
			this.canvas.stroke();
		}
	};

	this.showChar = function(x, y, color, char) {
		var i, j;
		if (!this.chars[char]) {
			return false;
		}
		for (i = 0; i < this.options.charHeight; i++) {
			for (j = 0; j < this.options.charWidth; j++) {
				this.showDot(x + j, y + i, color, this.chars[char][i * this.options.charWidth + j])
			}
		}
	};

	this.showWord = function(x, y, color, word) {
		var i;
		for (i = 0; i < word.length; i++) {
			this.showChar(x + i * (this.options.charWidth + 1), y, color, ' ');
			this.showChar(x + i * (this.options.charWidth + 1), y, color, word[i]);
		}
	};
}
