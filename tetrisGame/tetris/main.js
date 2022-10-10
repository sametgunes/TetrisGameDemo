Config = {
	size: {
		width: 10,
		height: 20
	}
};
(function () {
	function Grid() {
		this.gridDiv = document.getElementById('js-tetris');
		this.initCells();
		this.previewDiv = document.getElementById('js-next-piece');
		this.initPreviewCells();
		this.timer = new Timer(this);
		this.keyListener = new KeyListener(this);
		this.startGame();
	}

	Grid.prototype = {
		cells: [],
		previewCells: [],
		pieces: [],
		size: Config.size,
		initCells: function () {
			for (var y = 0; y < this.size.height; y++) {
				this.cells[y] = [];
				for (var x = 0; x < this.size.width; x++) {
					this.cells[y][x] = new Cell(x, y);
					this.cells[y][x].buildCellHtml();
					this.cells[y][x].appendCell(this.gridDiv);
				}
			}
		},
		initPreviewCells: function () {
			for (var y = 0; y < 5; y++) {
				this.previewCells[y] = [];
				for (var x = 0; x < 5; x++) {
					this.previewCells[y][x] = new Cell(x, y);
					this.previewCells[y][x].buildCellHtml();
					this.previewCells[y][x].appendCell(this.previewDiv);
				}
			}
		},
		startGame: function () {
			this.addPiece();
			this.addPiece();
			this.pieces[0].displayPreviewPiece(this.previewCells);
			this.pieces[1].displayPiece(this.cells);
			this.timer.startTimer();
		},
		addPiece: function () {
			this.pieces.unshift(new Piece());
		},

		findCompletedRows: function (piecePosition) {
			// get the rows this piece occupies
			var rowsToCheck = {};
			for (var index in piecePosition) {
				rowsToCheck[piecePosition[index].y] = 1;
			}
			console.log(rowsToCheck);

			// iterate over those rows checking for a full set of states
			var removeRows = {};
			for (var row in rowsToCheck) {
				var cellCount = 0;

				for (var x = 0; x < this.size.width; x++) {
					cellCount += this.cells[row][x].state;
				}

				if (cellCount === this.size.width) {
					removeRows[row] = 1;
				}
			}

			// if completed then trigger completed row function
			for (var removeRow in removeRows) {
				// set all cells in the row to white and state=0
				for (var x = 0; x < this.size.width; x++) {
					this.cells[removeRow][x].unmarkCell();

					// look up this column setting color and state
					for (var y = removeRow; y >= 0; y--) {
						if (y - 1 >= 0) {
							if (1 == this.cells[y - 1][x].state) {
								console.log(this.cells[y - 1][x].color)
								this.cells[y][x].markCell(this.cells[y - 1][x].color);
							} else {
								this.cells[y][x].unmarkCell();
							}
						}
					}
				}
			}
		}
	};
	window.Grid = Grid;
})();
(function () {
	function Piece() {
		this.currentPosition = {};
		this.selectShape();
		this.selectColor();
		this.allowedMoves = {
			left: true,
			right: true,
			down: true,
			rotate: true
		};
		this.stopped = false;
	}
	Piece.prototype = {
		colors: {
			0: 'blue',
			1: 'green',
			2: 'yellow',
			3: 'red',
			4: 'grey',
			5: 'black',
			6: 'purple',
			7: 'orange',
			8: 'turquoise'
		},
		color: '',
		nextOrientation: 0,
		shape: {},
		currentOrientation: {},
		shapes: {
			// I 0123456789  0123456789
			// 0 .....#....  ..........
			// 1 .....#....  ...####...
			// 2 .....#....  ..........
			// 3 .....#....  ..........
			0: {
				0: {
					0: {
						x: 5,
						y: 0
					},
					1: {
						x: 5,
						y: 1
					},
					2: {
						x: 5,
						y: 2
					},
					3: {
						x: 5,
						y: 3
					}
				},
				1: {
					0: {
						x: 3,
						y: 1
					},
					1: {
						x: 4,
						y: 1
					},
					2: {
						x: 5,
						y: 1
					},
					3: {
						x: 6,
						y: 1
					}
				}
			},
			// J 0123456789  0123456789  0123456789  0123456789
			// 0 .....#....  ....#.....  .....##...  ..........
			// 1 .....#....  ....###...  .....#....  ....###...
			// 2 ....##....  ..........  .....#....  ......#...
			// 3 ..........  ..........  ..........  ..........
			1: {
				0: {
					0: {
						x: 5,
						y: 0
					},
					1: {
						x: 5,
						y: 1
					},
					2: {
						x: 4,
						y: 2
					},
					3: {
						x: 5,
						y: 2
					}
				},
				1: {
					0: {
						x: 4,
						y: 0
					},
					1: {
						x: 4,
						y: 1
					},
					2: {
						x: 5,
						y: 1
					},
					3: {
						x: 6,
						y: 1
					}
				},
				2: {
					0: {
						x: 5,
						y: 0
					},
					1: {
						x: 6,
						y: 0
					},
					2: {
						x: 5,
						y: 1
					},
					3: {
						x: 5,
						y: 2
					}
				},
				3: {
					0: {
						x: 4,
						y: 1
					},
					1: {
						x: 5,
						y: 1
					},
					2: {
						x: 6,
						y: 1
					},
					3: {
						x: 6,
						y: 2
					}
				}
			},
			// L 0123456789  0123456789  0123456789  0123456789
			// 0 .....#....  ..........  ....##....  ......#...
			// 1 .....#....  ....###...  .....#....  ....###...
			// 2 .....##...  ....#.....  .....#....  ..........
			// 3 ..........  ..........  ..........  ..........
			2: {
				0: {
					0: {
						x: 5,
						y: 0
					},
					1: {
						x: 5,
						y: 1
					},
					2: {
						x: 5,
						y: 2
					},
					3: {
						x: 6,
						y: 2
					}
				},
				1: {
					0: {
						x: 4,
						y: 1
					},
					1: {
						x: 5,
						y: 1
					},
					2: {
						x: 6,
						y: 1
					},
					3: {
						x: 4,
						y: 2
					}
				},
				2: {
					0: {
						x: 4,
						y: 0
					},
					1: {
						x: 5,
						y: 0
					},
					2: {
						x: 5,
						y: 1
					},
					3: {
						x: 5,
						y: 2
					}
				},
				3: {
					0: {
						x: 6,
						y: 0
					},
					1: {
						x: 4,
						y: 1
					},
					2: {
						x: 5,
						y: 1
					},
					3: {
						x: 6,
						y: 1
					}
				}
			},
			// O 0123456789
			// 0 ....##....
			// 1 ....##....
			// 2 ..........
			// 3 ..........
			3: {
				0: {
					0: {
						x: 4,
						y: 0
					},
					1: {
						x: 5,
						y: 0
					},
					2: {
						x: 4,
						y: 1
					},
					3: {
						x: 5,
						y: 1
					}
				}
			},
			// S 0123456789  0123456789
			// 0 .....##...  ....#.....
			// 1 ....##....  ....##....
			// 2 ..........  .....#....
			// 3 ..........  ..........
			4: {
				0: {
					0: {
						x: 5,
						y: 0
					},
					1: {
						x: 6,
						y: 0
					},
					2: {
						x: 4,
						y: 1
					},
					3: {
						x: 5,
						y: 1
					}
				},
				1: {
					0: {
						x: 4,
						y: 0
					},
					1: {
						x: 4,
						y: 1
					},
					2: {
						x: 5,
						y: 1
					},
					3: {
						x: 5,
						y: 2
					}
				}
			},
			// T 0123456789  0123456789  0123456789  0123456789
			// 0 ..........  .....#....  .....#....  .....#....
			// 1 ....###...  ....##....  ....###...  .....##...
			// 2 .....#....  .....#....  ..........  .....#....
			// 3 ..........  ..........  ..........  ..........
			5: {
				0: {
					0: {
						x: 4,
						y: 1
					},
					1: {
						x: 5,
						y: 1
					},
					2: {
						x: 6,
						y: 1
					},
					3: {
						x: 5,
						y: 2
					}
				},
				1: {
					0: {
						x: 5,
						y: 0
					},
					1: {
						x: 4,
						y: 1
					},
					2: {
						x: 5,
						y: 1
					},
					3: {
						x: 5,
						y: 2
					}
				},
				2: {
					0: {
						x: 5,
						y: 0
					},
					1: {
						x: 4,
						y: 1
					},
					2: {
						x: 5,
						y: 1
					},
					3: {
						x: 6,
						y: 1
					}
				},
				3: {
					0: {
						x: 5,
						y: 0
					},
					1: {
						x: 5,
						y: 1
					},
					2: {
						x: 6,
						y: 1
					},
					3: {
						x: 5,
						y: 2
					}
				}
			},
			// Z 0123456789  0123456789
			// 0 ....##....  .....#....
			// 1 .....##...  ....##....
			// 2 ..........  ....#.....
			// 3 ..........  ..........
			6: {
				0: {
					0: {
						x: 4,
						y: 0
					},
					1: {
						x: 5,
						y: 0
					},
					2: {
						x: 5,
						y: 1
					},
					3: {
						x: 6,
						y: 1
					}
				},
				1: {
					0: {
						x: 5,
						y: 0
					},
					1: {
						x: 4,
						y: 1
					},
					2: {
						x: 5,
						y: 1
					},
					3: {
						x: 4,
						y: 2
					}
				}
			}
		},
		selectShape: function () {
			this.shape = this.shapes[this.selectRandom(this.shapes)];
			this.currentOrientation = this.selectRandom(this.shape);
			this.cloneOrientation();
		},
		selectRandom(obj) {
			var length = Object.keys(obj).length;
			return Math.floor(Math.random() * length);
		},
		selectColor: function () {
			this.color = this.colors[this.selectRandom(this.colors)];
		},
		cloneOrientation: function () {
			this.currentPosition = {
				0: {
					x: this.shape[this.currentOrientation][0].x,
					y: this.shape[this.currentOrientation][0].y
				},
				1: {
					x: this.shape[this.currentOrientation][1].x,
					y: this.shape[this.currentOrientation][1].y
				},
				2: {
					x: this.shape[this.currentOrientation][2].x,
					y: this.shape[this.currentOrientation][2].y
				},
				3: {
					x: this.shape[this.currentOrientation][3].x,
					y: this.shape[this.currentOrientation][3].y
				}
			};
		},
		displayPreviewPiece: function (previewCells) {
			for (var y = 0; y < 5; y++) {
				for (var x = 0; x < 5; x++) {
					previewCells[y][x].unmarkCell();
				}
			}
			for (var index in this.currentPosition) {
				var coordinates = this.currentPosition[index];
				previewCells[coordinates.y + 1][coordinates.x - 3].markCell(this.color);
			}
		},
		displayPiece: function (gridDiv) {
			for (var index in this.currentPosition) {
				var coordinates = this.currentPosition[index];
				gridDiv[coordinates.y][coordinates.x].markCell(this.color);
			}
		},
		checkMove(move) {
			return this.allowedMoves[move];
		},
		movePiece(cells, direction, interval) {
			if (false === this.checkMove('down') && 'down' === direction) {
				// delay set stopped so that piece can be moved either side
				var pauseInterval = interval - 1; // remove one millisecond so as not to interfere with next interval

				var t = this;

				setTimeout(function () {
					t.setStopped();
				}, pauseInterval);
			} else {
				if (this.checkMove(direction)) {
					for (var index in this.currentPosition) {
						var coordinates = this.currentPosition[index];
						cells[coordinates.y][coordinates.x].unmarkCell();
						this.setNewCoordinates(coordinates, direction);
					}
					this.setAllowedMoves(cells);
					this.displayPiece(cells);
				}
			}
		},
		resetAllowedMoves: function () {
			for (var key in this.allowedMoves) {
				this.allowedMoves[key] = true;
			}
		},
		setAllowedMoves: function (cells) {
			this.resetAllowedMoves();
			for (var index in this.currentPosition) {
				var coordinates = this.currentPosition[index];
				if (0 === coordinates.x || 1 === cells[coordinates.y][coordinates.x - 1].state) {
					this.allowedMoves['left'] = false;
				}

				if (Config.size.width - 1 === coordinates.x || 1 === cells[coordinates.y][coordinates.x + 1].state) {
					this.allowedMoves['right'] = false;
				}

				if (Config.size.height - 1 === coordinates.y || 1 === cells[coordinates.y + 1][coordinates.x].state) {
					this.allowedMoves['down'] = false;
				}
			}
			var nextPositionTest = this.getNextOrientation();
			var compareOrientation = this.shape[this.currentOrientation];

			// get x and y offset from the original orientation position
			var xoffset = this.currentPosition[0].x - compareOrientation[0].x; //2
			var yoffset = this.currentPosition[0].y - compareOrientation[0].y; //-1

			for (var index in this.currentPosition) {
				var coordinates = this.currentPosition[index];

				var nextPosX = nextPositionTest[index].x + xoffset;
				var nextPosY = nextPositionTest[index].y + yoffset;

				if (nextPosX < 0 || nextPosX >= Config.size.width) {
					this.allowedMoves['rotate'] = false;

					break;
				}

				if (nextPosY < 0 || nextPosY >= Config.size.height) {
					this.allowedMoves['rotate'] = false;

					break;
				}

				if (1 === cells[nextPosY][nextPosX].state) {
					this.allowedMoves['rotate'] = false;

					break;
				}
			}
		},
		getNextOrientation() {
			var count = Object.keys(this.shape).length;
			if (this.currentOrientation === count - 1) {
				var orientation = this.shape[0];

				this.nextOrientation = 0;

				return orientation;
			} else {
				var orientation = this.shape[this.currentOrientation + 1];

				this.nextOrientation = this.currentOrientation + 1;

				return orientation;
			}
		},
		setNewCoordinates: function (currentCoordinates, direction) {
			switch (direction) {
				case 'left':
					currentCoordinates.x--;
					break;
				case 'right':
					currentCoordinates.x++;
					break;
				case 'down':
					currentCoordinates.y++;
					break;
			}
		},
		setStopped: function () {
			this.stopped = true;
		},
		rotate: function (cells) {
			if (true === this.checkMove('rotate')) {
				// get the next orientation
				this.nextPosition = this.getNextOrientation();

				// compute cell differences, i.e. the relationship between current and next
				// use the original orientation
				var compareOrientation = this.shape[this.currentOrientation];

				// get x and y offset from the original orientation position
				var xoffset = this.currentPosition[0].x - compareOrientation[0].x;
				var yoffset = this.currentPosition[0].y - compareOrientation[0].y;

				for (var index in this.currentPosition) {
					var coordinates = this.currentPosition[index];

					cells[coordinates.y][coordinates.x].unmarkCell();

					this.currentPosition[index].x = this.nextPosition[index].x + xoffset;
					this.currentPosition[index].y = this.nextPosition[index].y + yoffset;
				}

				this.setAllowedMoves(cells);

				this.displayPiece(cells);

				this.currentOrientation = this.nextOrientation;
			}
		}
	};
	window.Piece = Piece;
})();
(function () {
	function Cell(x, y) {
		this.x = x;
		this.y = y;
	}

	Cell.prototype = {
		html: '',
		color: 'white',
		state: 0,
		buildCellHtml: function buildCellHtml() {
			this.html = document.createElement('div');
			this.setHtmlClass();
		},
		setHtmlClass: function setHtmlClass() {
			this.html.setAttribute('class', 'cell ' + this.color);
		},
		appendCell: function appendCell(parent) {
			parent.appendChild(this.html);
		},
		unmarkCell: function () {
			this.setColor('white');
			this.setState(0);
		},
		markCell: function (color) {
			this.setColor(color);
			this.setState(1);
		},
		setColor: function (color) {
			this.color = color;
			this.setHtmlClass();
		},
		setState(state) {
			this.state = state;
		}
	};
	window.Cell = Cell;
})();
(function () {
	'use strict';

	var t;

	function Timer(grid) {
		t = this;

		t.grid = grid;

		t.currentInterval = 750;
	}

	Timer.prototype = {
		// the current number of milliseconds between timer event
		currentInterval: 0,

		// stores the interval id for pausing (useful for dev)
		intervalId: null,

		// state, if running === true then the timer is running, else it's paused
		running: true,

		/**
		 * startTimer() - sets the timer running in response to a game start
		 */
		startTimer: function () {
			t.intervalId = setInterval(t.intervalTrigger, t.currentInterval);
			t.running = true;
		},

		/**
		 * pauseTimer() - pause the timer
		 */
		pauseTimer: function () {
			window.clearInterval(t.intervalId);

			t.running = false;
		},

		/**
		 * intervalTrigger() - function called each time an interval elapsed
		 */
		intervalTrigger: function () {
			var pieces = t.grid.pieces;
			pieces[1].movePiece(t.grid.cells, 'down', t.currentInterval);
			if (true === pieces[1].stopped) {
				console.info('stopped');
				pieces[1].displayPiece(t.grid.cells);

				t.grid.findCompletedRows(pieces[1].currentPosition);

				pieces.unshift(new Piece());

				pieces[0].displayPreviewPiece(t.grid.previewCells);

				// stop game if new piece won't fit
				var gameOver = false;
				for (var index in pieces[1].currentPosition) {
					var coordinates = pieces[1].currentPosition[index];

					if (1 === t.grid.cells[coordinates.y][coordinates.x].state) {
						gameOver = true;

						break;
					}
				}

				if (gameOver) {
					t.pauseTimer();
				}
			}
			var levelData = {
				interval: 750,
				threshold: 25
			};
			if (t.eventCount >= levelData.threshold) {
				t.pauseTimer();

				t.currentInterval = levelData.interval;

				t.startTimer();
			}
		}
	};

	window.Timer = Timer;
})();
(function () {
	'use strict';

	var t;

	function KeyListener(grid, timer) {
		t = this;

		t.grid = grid;

		t.timer = grid.timer;

		t.inititialiseKeys();
	}

	KeyListener.prototype = {
		// the grid the events happen to
		grid: {},

		// the timer triggering intervals
		timer: {},

		/**
		 * inititialiseKeys() - adds an event listener for keypresses
		 */
		inititialiseKeys: function () {
			window.addEventListener('keydown', t.keyListener);
		},

		/**
		 * keyListener() - responds to the key presses for game play
		 */
		keyListener: function (keyEvent) {
			var cells = t.grid.cells;

			var inPlayPiece = t.grid.pieces[1];

			switch (keyEvent.keyCode) {
				case 37:
					keyEvent.preventDefault();
					inPlayPiece.movePiece(cells, 'left', t.timer);
					break;
				case 39:
					keyEvent.preventDefault();
					inPlayPiece.movePiece(cells, 'right', t.timer);
					break;
				case 40:
					keyEvent.preventDefault();
					inPlayPiece.movePiece(cells, 'down', t.timer);
					break;

				case 32:
					keyEvent.preventDefault();
					inPlayPiece.rotate(cells);
					break;

				case 49: // 1 key for pausing
					keyEvent.preventDefault();
					if (true === t.timer.running) {
						t.timer.pauseTimer();
					} else {
						t.timer.startTimer();
					}
					break;
			}
		}
	};
	window.KeyListener = KeyListener;
})();
new Grid();