let selected = null;
let previousSelected = null;
let highlightCoords = [];
let colourID = 0;
let largeSmallMode = 'large';
let deleteLineMode = false;
let createLineMode = 0;
let createLine = [];

function init() {
	createBoard();
	if (document.location.search) {
		let searchParams = new URLSearchParams(document.location.search);
		if (searchParams.has('import')) importGrid(searchParams.get('import'));
	}
	document.addEventListener('keydown', detectKeyPress);
}

function createBoard() {
	let table = document.createElement('table');
	table.classList.add('largeTable');
	table.classList.add('unselectable');
	for (var i = 0; i < 9; i++) {
		let row = document.createElement('tr');
		row.classList.add('largeTr');
		for (var j = 0; j < 9; j++) {
			let cell = document.createElement('td');
			cell.id = i + '' + j;
			cell.classList.add('largeTd');
			cell.nums = [];
			cell.colour = 'c-1';
			cell.addEventListener('click', function() {highlightCell(event.target);});
			row.appendChild(cell);
		}
		table.appendChild(row);
	}
	document.body.appendChild(table);
}

function highlightCell(cell, moveByKeyboard=false) {
	clearCellHighlights();
	if (cell.classList.contains('smallTd')) {
		document.getElementById(cell.id.substring(0, 2)).style.zIndex = '99';
	}

	if (cell.classList.contains('largeTd') || cell.classList.contains('smallTd')) {
		if (selected == cell) {
			selected = null;
			previousSelected = null;
			highlightCoords = [];
		} else {
			previousSelected = selected;
			selected = cell;
			if (previousSelected) {
				previousSelected.style.zIndex = '50';
			}
			selected.style.zIndex = '100';
			selected.style.boxShadow = '0px 0px 10px 5px rgba(255, 0, 0, 0.8)';
			selected.style.filter = 'drop-shadow(5px 5px 5px rgba(255, 0, 0, 0.4)) drop-shadow(-5px -5px 5px rgba(255, 0, 0, 0.4)) drop-shadow(5px -5px 5px rgba(255, 0, 0, 0.4)) drop-shadow(-5px 5px 5px rgba(255, 0, 0, 0.4))';
			if (!moveByKeyboard) {
				if (cell.classList.contains('largeTd')) {
					highlightCoords = [parseInt(selected.id.substring(0, 1)) * 3, parseInt(selected.id.substring(1, 2)) * 3];
				} else {
					highlightCoords = [parseInt(selected.id.substring(0, 1)) * 3 + Math.floor((parseInt(selected.id.substring(2, 3)) - 1) / 3),
							parseInt(selected.id.substring(1, 2)) * 3 + ((parseInt(selected.id.substring(2, 3)) - 1) % 3)];
				}
			}
			
			highlightColourBox(selected.colour);
		}
	}

	if (createLineMode != 0 && selected && selected.classList.contains('smallTd') && !moveByKeyboard) {
		drawLine();
	}
}

function highlightTargets(cells, r=255, g=0, b=0, clearHighlights = true) {
	if (clearHighlights) {
		clearCellHighlights();
		selected = null;
		previousSelected = null;
		highlightCoords = [];
	}
	
	for (let i = 0; i < cells.length; i++) {
		cells[i].style.zIndex = '100';
		cells[i].style.boxShadow = '0px 0px 10px 5px rgba(' + r + ', ' + g + ', ' + b + ', 0.8)';
		cells[i].style.filter = 'drop-shadow(5px 5px 5px rgba(' + r + ', ' + g + ', ' + b + ', 0.4)) drop-shadow(-5px -5px 5px rgba(' + r + ', ' + g + ', ' + b + ', 0.4)) drop-shadow(5px -5px 5px rgba(' + r + ', ' + g + ', ' + b + ', 0.4)) drop-shadow(-5px 5px 5px rgba(' + r + ', ' + g + ', ' + b + ', 0.4))';
	}
}

function getCellByCoords(coords, largeOnly=false) {
	let c = document.getElementById('' + Math.floor(coords[0] / 3) + Math.floor(coords[1] / 3));
	if (c.children.length == 1 && !largeOnly) {
		return document.getElementById('' + Math.floor(coords[0] / 3) + Math.floor(coords[1] / 3) + (coords[0] % 3 * 3 + coords[1] % 3 + 1));
	} else {
		return c;
	}
}

function moveHighlight(command) {
	if (highlightCoords.length == 0) {
		return;
	}
	if (command == 'L') {
		if (largeSmallMode == 'large') {
			let largeCoords = [Math.floor(highlightCoords[0] / 3), Math.floor(highlightCoords[1] / 3)];
			if (largeCoords[1] != 0) {
				highlightCell(getCellByCoords([largeCoords[0] * 3, largeCoords[1] * 3 - 3], true), true);
				highlightCoords = [highlightCoords[0], highlightCoords[1] - 3];
			}
		} else {
			let c = getCellByCoords([Math.floor(highlightCoords[0] / 3) * 3, Math.floor(highlightCoords[1] / 3) * 3], true);
			if (selected.classList.contains('largeTd')) {
				if (highlightCoords[1] / 3 >= 1) {
					let n = getCellByCoords([highlightCoords[0], highlightCoords[1] - 3], true);
					if (n.children.length == 1) {
						let largeCoords = [Math.floor(highlightCoords[0] / 3) * 3, Math.floor(highlightCoords[1] / 3) * 3];
						highlightCell(getCellByCoords([highlightCoords[0], largeCoords[1] - 1]), true);
						highlightCoords = [highlightCoords[0], largeCoords[1] - 1];
					} else {
						highlightCell(getCellByCoords([highlightCoords[0], highlightCoords[1] - 3], true), true);
						highlightCoords = [highlightCoords[0], highlightCoords[1] - 3];
					}
				}
			} else {
				if (highlightCoords[1] == 0) {
					return;
				}
				if (highlightCoords[1] % 3 != 0) {
					highlightCell(getCellByCoords([highlightCoords[0], highlightCoords[1] - 1]), true);
					highlightCoords = [highlightCoords[0], highlightCoords[1] - 1];
				} else {
					let n = getCellByCoords([highlightCoords[0], highlightCoords[1] - 3], true);
					if (n.children.length == 1) {
						highlightCell(getCellByCoords([highlightCoords[0], highlightCoords[1] - 1]), true);
						highlightCoords = [highlightCoords[0], highlightCoords[1] - 1];
					} else {
						highlightCell(getCellByCoords([highlightCoords[0], highlightCoords[1] - 3], true), true);
						highlightCoords = [highlightCoords[0], highlightCoords[1] - 3];
					}
				}
			}
		}
	} else if (command == 'R') {
		if (largeSmallMode == 'large') {
			let largeCoords = [Math.floor(highlightCoords[0] / 3), Math.floor(highlightCoords[1] / 3)];
			if (largeCoords[1] != 8) {
				highlightCell(getCellByCoords([largeCoords[0] * 3, largeCoords[1] * 3 + 3], true), true);
				highlightCoords = [highlightCoords[0], highlightCoords[1] + 3];
			}
		} else {
			let c = getCellByCoords([Math.floor(highlightCoords[0] / 3) * 3, Math.floor(highlightCoords[1] / 3) * 3], true);
			if (selected.classList.contains('largeTd')) {
				if (highlightCoords[1] / 3 < 8) {
					let n = getCellByCoords([highlightCoords[0], highlightCoords[1] + 3], true);
					if (n.children.length == 1) {
						let largeCoords = [Math.floor(highlightCoords[0] / 3) * 3, Math.floor(highlightCoords[1] / 3) * 3];
						highlightCell(getCellByCoords([highlightCoords[0], largeCoords[1] + 3]), true);
						highlightCoords = [highlightCoords[0], largeCoords[1] + 3];
					} else {
						highlightCell(getCellByCoords([highlightCoords[0], highlightCoords[1] + 3], true), true);
						highlightCoords = [highlightCoords[0], highlightCoords[1] + 3];
					}
				}
			} else {
				if (highlightCoords[1] == 26) {
					return;
				}
				if (highlightCoords[1] % 3 != 2) {
					highlightCell(getCellByCoords([highlightCoords[0], highlightCoords[1] + 1]), true);
					highlightCoords = [highlightCoords[0], highlightCoords[1] + 1];
				} else {
					let n = getCellByCoords([highlightCoords[0], highlightCoords[1] + 3], true);
					if (n.children.length == 1) {
						highlightCell(getCellByCoords([highlightCoords[0], highlightCoords[1] + 1]), true);
						highlightCoords = [highlightCoords[0], highlightCoords[1] + 1];
					} else {
						highlightCell(getCellByCoords([highlightCoords[0], highlightCoords[1] + 3], true), true);
						highlightCoords = [highlightCoords[0], highlightCoords[1] + 3];
					}
				}
			}
		}
	} else if (command == 'U') {
		if (largeSmallMode == 'large') {
			let largeCoords = [Math.floor(highlightCoords[0] / 3), Math.floor(highlightCoords[1] / 3)];
			if (largeCoords[0] != 0) {
				highlightCell(getCellByCoords([largeCoords[0] * 3 - 3, largeCoords[1] * 3], true), true);
				highlightCoords = [highlightCoords[0] - 3, highlightCoords[1]];
			}
		} else {
			let c = getCellByCoords([Math.floor(highlightCoords[0] / 3) * 3, Math.floor(highlightCoords[1] / 3) * 3], true);
			if (selected.classList.contains('largeTd')) {
				if (highlightCoords[0] / 3 >= 1) {
					let n = getCellByCoords([highlightCoords[0] - 3, highlightCoords[1]], true);
					if (n.children.length == 1) {
						let largeCoords = [Math.floor(highlightCoords[0] / 3) * 3, Math.floor(highlightCoords[1] / 3) * 3];
						highlightCell(getCellByCoords([largeCoords[0] - 1, highlightCoords[1]]), true);
						highlightCoords = [largeCoords[0] - 1, highlightCoords[1]];
					} else {
						highlightCell(getCellByCoords([highlightCoords[0] - 3, highlightCoords[1]], true), true);
						highlightCoords = [highlightCoords[0] - 3, highlightCoords[1]];
					}
				}
			} else {
				if (highlightCoords[0] == 0) {
					return;
				}
				if (highlightCoords[0] % 3 != 0) {
					highlightCell(getCellByCoords([highlightCoords[0] - 1, highlightCoords[1]]), true);
					highlightCoords = [highlightCoords[0] - 1, highlightCoords[1]];
				} else {
					let n = getCellByCoords([highlightCoords[0] - 3, highlightCoords[1]], true);
					if (n.children.length == 1) {
						highlightCell(getCellByCoords([highlightCoords[0] - 1, highlightCoords[1]]), true);
						highlightCoords = [highlightCoords[0] - 1, highlightCoords[1]];
					} else {
						highlightCell(getCellByCoords([highlightCoords[0] - 3, highlightCoords[1]], true), true);
						highlightCoords = [highlightCoords[0] - 3, highlightCoords[1]];
					}
				}
			}
		}
	} else if (command == 'D') {
		if (largeSmallMode == 'large') {
			let largeCoords = [Math.floor(highlightCoords[0] / 3), Math.floor(highlightCoords[1] / 3)];
			if (largeCoords[0] != 8) {
				highlightCell(getCellByCoords([largeCoords[0] * 3 + 3, largeCoords[1] * 3], true), true);
				highlightCoords = [highlightCoords[0] + 3, highlightCoords[1]];
			}
		} else {
			let c = getCellByCoords([Math.floor(highlightCoords[0] / 3) * 3, Math.floor(highlightCoords[1] / 3) * 3], true);
			if (selected.classList.contains('largeTd')) {
				if (highlightCoords[0] / 3 < 8) {
					let n = getCellByCoords([highlightCoords[0] + 3, highlightCoords[1]], true);
					if (n.children.length == 1) {
						let largeCoords = [Math.floor(highlightCoords[0] / 3) * 3, Math.floor(highlightCoords[1] / 3) * 3];
						highlightCell(getCellByCoords([largeCoords[0] + 3, highlightCoords[1]]), true);
						highlightCoords = [largeCoords[0] + 3, highlightCoords[1]];
					} else {
						highlightCell(getCellByCoords([highlightCoords[0] + 3, highlightCoords[1]], true), true);
						highlightCoords = [highlightCoords[0] + 3, highlightCoords[1]];
					}
				}
			} else {
				if (highlightCoords[0] == 26) {
					return;
				}
				if (highlightCoords[0] % 3 != 2) {
					highlightCell(getCellByCoords([highlightCoords[0] + 1, highlightCoords[1]]), true);
					highlightCoords = [highlightCoords[0] + 1, highlightCoords[1]];
				} else {
					let n = getCellByCoords([highlightCoords[0] + 3, highlightCoords[1]], true);
					if (n.children.length == 1) {
						highlightCell(getCellByCoords([highlightCoords[0] + 1, highlightCoords[1]]), true);
						highlightCoords = [highlightCoords[0] + 1, highlightCoords[1]];
					} else {
						highlightCell(getCellByCoords([highlightCoords[0] + 3, highlightCoords[1]], true), true);
						highlightCoords = [highlightCoords[0] + 3, highlightCoords[1]];
					}
				}
			}
		}
	}
}

function detectKeyPress(event) {
	let keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
	if (keys.includes(event.key)) {
		if (selected) {
			updateCell(selected, event.key);
			solverState = -1;
			solverStart = true;
		}
	}
	if (event.key == 'Backspace' || event.key == 'Delete') {
		if (selected && !(selected.classList.contains('locked') || selected.classList.contains('superLocked'))) {
			if (selected.classList.contains('largeTd')) {
				selected.nums = [];
				fillCell(selected);
				solverState = -1;
				solverStart = true;
			} else if (selected.classList.contains('smallTd')) {
				highlightCell(document.getElementById(selected.id.substring(0, 2)), true);
				selected.nums = [];
				fillCell(selected);
				solverState = -1;
				solverStart = true;
			}
		}
	}
	if (event.key == 'Escape') {
		clearCellHighlights();
		highlightCoords = [];
		selected = null;
		previousSelected = null;
		highlightColourBox(null);
	}
	if (event.key == 'w' || event.key == 'ArrowUp') {
		moveHighlight('U');
	} else if (event.key == 'a' || event.key == 'ArrowLeft') {
		moveHighlight('L');
	} else if (event.key == 's' || event.key == 'ArrowDown') {
		moveHighlight('D');
	} else if (event.key == 'd' || event.key == 'ArrowRight') {
		moveHighlight('R');
	}
	if (event.key == 'c') {
		if (selected) {
			selected.colour = 'c-1';
			updateAllColours();
		}
	}
}

function detectKeypadPress(num) {
	if (num == 'delete') {
		if (selected) {
			selected.nums = [];
			fillCell(selected);
			solverState = -1;
			solverStart = true;
		}
	} else if (num == 'largeMode') {
		largeSmallMode = 'large';
		updateZIndices();
		document.getElementById('largeMode').style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
		document.getElementById('smallMode').style.backgroundColor = null;
	} else if (num == 'smallMode') {
		largeSmallMode = 'small';
		updateZIndices();
		document.getElementById('largeMode').style.backgroundColor = null;
		document.getElementById('smallMode').style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
	} else if (selected) {
		updateCell(selected, num);
		solverState = -1;
		solverStart = true;
	}
}

function updateZIndices() {
	if (largeSmallMode == 'large') {
		let smallTable = document.getElementsByClassName('smallTable'),
			smallTd = document.getElementsByClassName('smallTd');
		for (let i = 0; i < smallTable.length; i++) {
			smallTable[i].style.pointerEvents = 'none';
		}
		for (let i = 0; i < smallTd.length; i++) {
			smallTd[i].style.pointerEvents = 'none';
		}
	} else if (largeSmallMode == 'small') {
		let smallTable = document.getElementsByClassName('smallTable'),
			smallTd = document.getElementsByClassName('smallTd');
		for (let i = 0; i < smallTable.length; i++) {
			smallTable[i].style.pointerEvents = 'auto';
		}
		for (let i = 0; i < smallTd.length; i++) {
			smallTd[i].style.pointerEvents = 'auto';
		}
	}
}

function updateCell(cell, num) {
	if (!cell.classList.contains('locked')) {
		let c = cell;
		if (cell.classList.contains('smallTd')) {
			c = document.getElementById(cell.id.substring(0, 2));
		}

		if (c.nums.includes(num)) {
			c.nums.splice(c.nums.indexOf(num), 1);
		} else {
			c.nums.push(num);
		}
		fillCell(c);
	}
}

function fillCell(cell) {
	let c = cell;
	if (c.classList.contains('smallTd')) {
		c = document.getElementById(c.id.substring(0, 2));
	}

	if (c.nums.length == 0) {
		c.innerHTML = '';
	} else if (c.nums.length == 1) {
		c.innerHTML = c.nums[0];
	} else if (c.children.length == 1) {
		for (var i = 1; i < 10; i++) {
			document.getElementById(c.id + '' + i).innerHTML = '';
		}
		for (var i = 0; i < c.nums.length; i++) {
			document.getElementById(c.id + '' + c.nums[i]).innerHTML = c.nums[i];
		}
	} else {
		c.innerHTML = '';
		createPencilTable(c);
		updateZIndices();

		for (var i = 0; i < c.nums.length; i++) {
			document.getElementById(c.id + '' + c.nums[i]).innerHTML = c.nums[i];
		}
	}
	updateAllColours();
}

function fillAllCells() {
	for (let i = 0; i < 81; i++) {
		let c = document.getElementById('' + Math.floor(i / 9) + i % 9);
		fillCell(c);
	}
	solverState = -1;
}

function fillAllCells(board) {
	for (let i = 0; i < 81; i++) {
		let c = document.getElementById('' + Math.floor(i / 9) + i % 9);
		if (board[Math.floor(i / 9)][i % 9] == '0') {
			c.nums = [];
		} else {
			c.nums = [board[Math.floor(i / 9)][i % 9]];
		}
		fillCell(c);
	}
}

function createPencilTable(c) {
	let table = document.createElement('table');
	table.classList.add('smallTable');
	for (var i = 0; i < 3; i++) {
		let row = document.createElement('tr');
		for (var j = 0; j < 3; j++) {
			let cell = document.createElement('td');
			cell.id = c.id + "" + (i * 3 + j + 1);
			cell.colour = 'c-1';
			cell.classList.add('smallTd');
			row.appendChild(cell);
		}
		table.appendChild(row);
	}
	c.appendChild(table);
}

function addColour() {
	let div = document.createElement('div');
	div.id = 'c' + colourID;
	div.classList.add('colourBox');
	let colourCount = document.getElementsByClassName('colour').length;

	Object.assign(div.style, {
		width: '100%',
		height: '40px',
		backgroundColor: 'white'
	});

	let use = document.createElement('input');
	use.setAttribute('type', 'button');
	use.style.width = '30px';
	use.style.height = '34px';
	use.style.padding = '0';
	use.setAttribute('value', 'use');
	use.style.verticalAlign = 'top';
	use.onclick = function() {
		useColour(this.parentNode.id);
	}

	let text = document.createElement('input');
	text.setAttribute('type', 'text');
	text.setAttribute('size', '6');
	text.setAttribute('placeholder', 'Name');
	text.style.height = '28px';
	text.style.verticalAlign = 'top';
	text.addEventListener('click', function() {
		clearCellHighlights();
		selected = null;
		previousSelected = null;
		highlightCoords = [];
	});

	let color = document.createElement('input');
	color.setAttribute('type', 'color');
	color.setAttribute('value', '#ffffff');
	color.style.width = '20px';
	color.style.height = '30px';
	color.style.verticalAlign = 'top';
	color.addEventListener('input', updateAllColours, false);

	let deleteButton = document.createElement('input');
	deleteButton.setAttribute('type', 'button');
	deleteButton.style.width = '30px';
	deleteButton.style.height = '34px';
	deleteButton.style.padding = '0';
	deleteButton.setAttribute('value', '🗑️');
	deleteButton.style.verticalAlign = 'top';
	deleteButton.onclick = function() {
		deleteColourByID(this.parentNode.id);
	};


	document.getElementById('colourPanel').appendChild(div);
	div.appendChild(use);
	div.appendChild(text);
	div.appendChild(color);
	div.appendChild(deleteButton);
	colourID += 1;
}

function deleteColourByID(id) {
	let p = document.getElementById(id);
	p.remove();
	updateAllColours();
}

function getColourByID(id) {
	let p = document.getElementById(id);
	if (!p) {
		return null;
	}
	let c = p.querySelector('input[type="color"]');
	return c.value;
}

function highlightColourBox(id) {
	let colourBoxes = document.getElementsByClassName('colourBox');
	for (let i = 0; i < colourBoxes.length; i++) {
		colourBoxes[i].style.backgroundColor = 'white';
	}
	if (!id) {
		return;
	}
	if (document.getElementById(id)) {
		document.getElementById(id).style.backgroundColor = 'blue';
	}
}

function useColour(id) {
	if (selected) {
		if (!selected.classList.contains('locked')) {
			selected.colour = id;
			updateAllColours();
		}
	}
}

function updateAllColours() {
	let cellsL = document.getElementsByClassName('largeTd');
	let cellsS = document.getElementsByClassName('smallTd');
	for (var i = 0; i < cellsL.length; i++) {
		if (!cellsL[i].classList.contains('locked')) {
			let hasColouredPencil = false;
			if (cellsL[i].querySelector('table')) {
				for (var j = 1; j < 10; j++) {
					if (getColourByID(document.getElementById(cellsL[i].id + '' + j).colour)) {
						hasColouredPencil = true;
					}
				}
			}
			if (!!getColourByID(cellsL[i].colour) && !hasColouredPencil) {
				cellsL[i].style.backgroundColor = getColourByID(cellsL[i].colour);
			} else {
				cellsL[i].style.backgroundColor = '#ffffff';
			}
			let rgbArray = rgb2array(cellsL[i].style.backgroundColor);
			cellsL[i].style.color = (rgbArray[0] * 0.299 + rgbArray[1] * 0.587 + rgbArray[2] * 0.114) > 186 ? '#000000' : '#ffffff';
		} else {
			cellsL[i].style.color = 'blue';
			cellsL[i].style.backgroundColor = '#ffffff';
			cellsL[i].style.borderColor = '#000000';
		}
	}
	for (var i = 0; i < cellsS.length; i++) {
		if (!!getColourByID(cellsS[i].colour)) {
			cellsS[i].style.backgroundColor = getColourByID(cellsS[i].colour);
		} else {
			cellsS[i].style.backgroundColor = document.getElementById(cellsS[i].id.substring(0, 2)).style.backgroundColor;
		}
		let rgbArray = rgb2array(cellsS[i].style.backgroundColor);
		cellsS[i].style.color = (rgbArray[0] * 0.299 + rgbArray[1] * 0.587 + rgbArray[2] * 0.114) > 186 ? '#000000' : '#ffffff';
	}
	if (selected) {
		highlightColourBox(selected.colour);
	} else {
		highlightColourBox(null);
	}
}

function drawLineToggle() {
	if (createLineMode != 0) {
		createLineMode = 0;
		createLine = [];
		document.getElementById('drawLine').style.backgroundColor = null;
	} else {
		drawLine();
		detectKeypadPress('smallMode');
	}
	deleteLineMode = false;
	document.getElementById('deleteSingleLine').style.backgroundColor = null;
}

function drawLine() {
	if (createLineMode == 0) {
		document.getElementById('drawLine').style.backgroundColor = 'rgba(255, 215, 0, 1)';
	} else if (createLineMode == 1) {
		createLine.push([selected.getBoundingClientRect().x + (0.5 * selected.getBoundingClientRect().width),
						 selected.getBoundingClientRect().y + (0.5 * selected.getBoundingClientRect().height)]);
		document.getElementById('drawLine').style.backgroundColor = 'rgba(255, 165, 0, 1)';
	} else if (createLineMode == 2) {
		createLine.push([selected.getBoundingClientRect().x + (0.5 * selected.getBoundingClientRect().width),
						 selected.getBoundingClientRect().y + (0.5 * selected.getBoundingClientRect().height)]);
		
		// [[x1, y1], [x2, y2]]
		let line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
		line.setAttribute('x1', createLine[0][0]);
		line.setAttribute('y1', createLine[0][1]);
		line.setAttribute('x2', createLine[1][0]);
		line.setAttribute('y2', createLine[1][1]);
		line.setAttribute('stroke', 'red');
		line.setAttribute('stroke-width', '2');
		line.style.pointerEvents = 'auto';
		line.style.transition = '0.5s';
		line.addEventListener('click', deleteLine);
		line.addEventListener('mouseover', function(event) {
			if (deleteLineMode) {
				event.target.setAttribute('stroke-width', '5');
			} else {
				event.target.setAttribute('stroke-width', '3');
			}
			event.target.setAttribute('stroke', 'orange');
		});
		line.addEventListener('mouseout', function(event) {
			event.target.setAttribute('stroke-width', '2');
			event.target.setAttribute('stroke', 'red');
		});

		if (document.getElementById('svg')) {
			let svg = document.getElementById('svg');
			svg.appendChild(line);
		} else {
			let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.id = 'svg';
			svg.setAttribute('width', '608');
			svg.setAttribute('height', '608');
			svg.style.position = 'absolute';
			svg.style.top = 0;
			svg.style.left = 0;
			svg.style.zIndex = 200;
			svg.style.pointerEvents = 'none';
			svg.classList.add('svgLine');

			svg.appendChild(line);
			document.body.appendChild(svg);
		}

		createLineMode = 0;
		createLine = [];
		document.getElementById('drawLine').style.backgroundColor = null;
		return;
	}
	createLineMode += 1;
}

function deleteLineToggle() {
	if (!deleteLineMode) {
		deleteLineMode = true;
		document.getElementById('deleteSingleLine').style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
	} else {
		deleteLineMode = false;
		document.getElementById('deleteSingleLine').style.backgroundColor = null;
	}
	createLineMode = 0;
	createLine = [];
	document.getElementById('drawLine').style.backgroundColor = null;
}

function deleteLine(event) {
	if (deleteLineMode) {
		event.target.remove();
	}
}



function clearAllCells() {
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			let cell = document.getElementById('' + i + j);
			cell.nums = [];
			cell.classList.remove('locked', 'superLocked');
			cell.colour = 'c-1';
			fillCell(cell);
		}
	}
	updateAllColours();
	solverState = -1;
	solverStart = true;
}

function deleteAllLines() {
	let lines = document.getElementsByClassName('svgLine');
	for (let i = lines.length - 1; i >= 0; i--) {
		lines[i].remove();
	}
	deleteLineMode = false;
	document.getElementById('deleteSingleLine').style.backgroundColor = null;
}

function clearCellHighlights() {
	let cellsL = document.getElementsByClassName('largeTd');
	let cellsS = document.getElementsByClassName('smallTd');
	for (var i = 0; i < cellsL.length; i++) {
		cellsL[i].style.boxShadow = null;
		cellsL[i].style.filter = null;
		cellsL[i].style.zIndex = '1';
	}
	for (var i = 0; i < cellsS.length; i++) {
		cellsS[i].style.boxShadow = null;
		cellsS[i].style.filter = null;
		cellsS[i].style.zIndex = '2';
	}
	highlightColourBox(null);
}



function lockGrid() {
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			let c = document.getElementById('' + i + j);
			if (c.children.length == 0 && c.innerHTML != '') {
				c.classList.add('locked');
				c.colour = 'c-1';
			}
		}
	}
	updateAllColours();
}

function unlockGrid() {
	let locked = document.getElementsByClassName('locked');
	let hasSuperLocked = false;
	for (let i = locked.length - 1; i >= 0; i--) {
		if (!locked[i].classList.contains('superLocked')) {
			locked[i].classList.remove('locked');
		} else {
			hasSuperLocked = true;
		}
	}
	updateAllColours();
	if (hasSuperLocked) {
		alert('There are super-locked cells.');
	}
}

function clearUnlocked() {
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			let c = document.getElementById('' + i + j);
			if (!c.classList.contains('locked')) {
				c.nums = [];
				fillCell(c);
			}
		}
	}
	solverState = -1;
	solverStart = true;
}

function exportGrid() {
	let wantsUnlocked = confirm('Would you like to export unlocked cells?');
	let wantsSuperLocked = confirm('Would you like to super-lock locked cells?');
	let wantsURL = confirm('Would you like to export to URL?');
	let exportStr = exportGridHidden(wantsUnlocked, wantsSuperLocked, wantsURL);
	if (!exportStr) return;
	prompt(wantsURL ? 'URL:' : 'Import string:', exportStr);
}

function checkImport() {
	let importString = prompt('Enter import string:');
	if (importString == null) {
		return;
	} else if (importString != '') {
		importGrid(importString);
	} else {
		clearAllCells();
		deleteAllLines();
		updateAllColours();
		clearCellHighlights();
		highlightCoords = [];
	}
}

function exportGridHidden(wantsUnlocked = true, wantsSuperLocked = false, wantsURL = false) {
	let exportString = wantsURL ? 'https://brandenleong1.github.io/sudoku/?import=' : '';
	let first = true;
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			let c = document.getElementById('' + i + j);
			if (c.nums.length != 0) {
				c.nums.sort((a, b) => a - b);
				if (wantsUnlocked) {
					if (!first) exportString += '/';
					exportString += '' + i + j;
					for (let n = 0; n < c.nums.length; n++) {
						exportString += c.nums[n];
					}
				} else {
					if (c.classList.contains('locked')) {
						if (!first) exportString += '/';
						exportString += '' + i + j + c.nums[0];
					}
				}

				if (c.classList.contains('superLocked')) {
					exportString += 'S';
				} else if (c.classList.contains('locked')) {
					if (wantsSuperLocked) {
						exportString += 'S';
					} else {
						exportString += 'L';
					}
				}
				first = false;
			}
		}
	}
	if (first) {
		alert('Nothing to export!');
		return false;
	}
	return exportString;
}

function importGrid(string) {	
	let importArray = string.split('/');
	if (!checkCorrectSyntaxImport(importArray) || !checkDuplicateCoordsImport(importArray)) {
		alert('Invalid import string.');
		return;
	}
	
	clearAllCells();
	deleteAllLines();
	for (let i = 0; i < importArray.length; i++) {
		let cell = document.getElementById(importArray[i].substring(0, 2));
		cell.nums = getNumsImport(importArray[i].substring(2));
		if (testForCommandImport(importArray[i].substring(2), 'L')) {
			cell.classList.add('locked');
		}
		if (testForCommandImport(importArray[i].substring(2), 'S')) {
			cell.classList.add('locked', 'superLocked');
		}
		fillCell(cell);
	}
	updateAllColours();
	clearCellHighlights();
	highlightCoords = [];
}

function checkSolvedGrid() {
	if (checkForEmptyCells()) {
		alert('There are still unfilled squares.');
		return;
	}

	if (checkMistakes()) {
		alert('There are mistakes.');
	} else {
		alert('Good work!');
		clearCellHighlights();
	}
}

function checkForEmptyCells() {
	loop1: for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			let c = document.getElementById('' + i + j);
			if (c.nums.length != 1) {
				return true;
			}
		}
	}
	return false;
}

function checkMistakes() {
	// Precondition: every cell must be filled with one and only one number
	for (let i = 0; i < 9; i++) {
		let found = [], foundCellReference = [];
		for (let j = 0; j < 9; j++) {
			let toCheck = document.getElementById('' + i + j);
			if (found.includes(toCheck.nums[0])) {
				highlightTargets([foundCellReference[found.indexOf(toCheck.nums[0])], toCheck]);
				return true;
			} else {
				found.push(toCheck.nums[0]);
				foundCellReference.push(toCheck);
			}
		}
	}
	for (let j = 0; j < 9; j++) {
		let found = [], foundCellReference = [];
		for (let i = 0; i < 9; i++) {
			let toCheck = document.getElementById('' + i + j);
			if (found.includes(toCheck.nums[0])) {
				highlightTargets([foundCellReference[found.indexOf(toCheck.nums[0])], toCheck]);
				return true;
			} else {
				found.push(toCheck.nums[0]);
				foundCellReference.push(toCheck);
			}
		}
	}
	for (let b = 0; b < 9; b++) {
		let found = [], foundCellReference = [];
		for (let i = Math.floor(b / 3) * 3; i < Math.floor(b / 3) * 3 + 3; i++) {
			for (let j = (b % 3) * 3; j < (b % 3) * 3 + 3; j++) {
				let toCheck = document.getElementById('' + i + j);
				if (found.includes(toCheck.nums[0])) {
					highlightTargets([foundCellReference[found.indexOf(toCheck.nums[0])], toCheck]);
					return true;
				} else {
					found.push(toCheck.nums[0]);
					foundCellReference.push(toCheck);
				}
			}
		}
	}
	return false;
}

let counter = 0;

function generateSudoku() {
	let attempts = parseInt(prompt('Enter difficulty level (positive integer, >20 may cause lag)'), 10);

	if (Number.isNaN(attempts) || attempts <= 0) {
		alert('Difficulty level must be positive integer');
		return;
	}


	let board = [['0', '0', '0', '0', '0', '0', '0', '0', '0'],
				 ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
				 ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
				 ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
				 ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
				 ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
				 ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
				 ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
				 ['0', '0', '0', '0', '0', '0', '0', '0', '0']];

	let possibleNums = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

	clearAllCells();
	fillBoard(board);
	fillAllCells(board);
	
	while (attempts > 0) {
		console.log('attempts remaining: ' + attempts);
		let row = Math.floor(Math.random() * 9);
		let col = Math.floor(Math.random() * 9);

		while (board[row][col] == '0') {
			row = Math.floor(Math.random() * 9);
			col = Math.floor(Math.random() * 9);
		}

		let backup = board[row][col];
		board[row][col] = '0';

		let boardCopy = [];
		for (let i = 0; i < 9; i++) {
			boardCopy.push([]);
			for (let j = 0; j < 9; j++) {
				boardCopy[i].push(board[i][j]);
			}
		}

		counter = 0;
		solveBoard(boardCopy);
		if (counter != 1) {
			board[row][col] = backup;
			attempts -= 1;
		}
	}
	
	fillAllCells(board);
	lockGrid();
	solverState = -1;
	solverStart = true;
}

function checkBoard(board) {
	for (let i = 0; i < 81; i++) {
		if (board[Math.floor(i / 9)][i % 9] == '0') {
			return false;
		} 
	}
	return true;
}

function fillBoard(board) {
	let possibleNums = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
	
	let row;
	let col;
	for (let i = 0; i < 81; i++) {
		row = Math.floor(i / 9);
		col = i % 9;
		let boxCoord = [Math.floor(row / 3) * 3, Math.floor(col / 3) * 3];
		let box = [board[boxCoord[0] + 0][boxCoord[1] + 0], board[boxCoord[0] + 0][boxCoord[1] + 1], board[boxCoord[0] + 0][boxCoord[1] + 2],
					board[boxCoord[0] + 1][boxCoord[1] + 0], board[boxCoord[0] + 1][boxCoord[1] + 1], board[boxCoord[0] + 1][boxCoord[1] + 2],
					board[boxCoord[0] + 2][boxCoord[1] + 0], board[boxCoord[0] + 2][boxCoord[1] + 1], board[boxCoord[0] + 2][boxCoord[1] + 2]];
		
		if (board[row][col] == '0') {
			shuffleArray(possibleNums);
			for (let j = 0; j < 9; j++) {
				let e = possibleNums[j];
				if (board[row].indexOf(e) == -1 && transpose(board)[col].indexOf(e) == -1 && box.indexOf(e) == -1) {
					board[row][col] = e;
					if (checkBoard(board)) {
						return true;
					} else {
						if (fillBoard(board)) {
							return true;
						}
					}
					 
				}
			}
			break;
		}
	}
	board[row][col] = '0';
}

function solveBoard(board) {
	let possibleNums = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
	
	let row;
	let col;
	for (let i = 0; i < 81; i++) {
		row = Math.floor(i / 9);
		col = i % 9;
		let boxCoord = [Math.floor(row / 3) * 3, Math.floor(col / 3) * 3];
		let box = [board[boxCoord[0] + 0][boxCoord[1] + 0], board[boxCoord[0] + 0][boxCoord[1] + 1], board[boxCoord[0] + 0][boxCoord[1] + 2],
					board[boxCoord[0] + 1][boxCoord[1] + 0], board[boxCoord[0] + 1][boxCoord[1] + 1], board[boxCoord[0] + 1][boxCoord[1] + 2],
					board[boxCoord[0] + 2][boxCoord[1] + 0], board[boxCoord[0] + 2][boxCoord[1] + 1], board[boxCoord[0] + 2][boxCoord[1] + 2]];
		
		if (board[row][col] == '0') {
			for (let j = 0; j < 9; j++) {
				let e = possibleNums[j];
				if (board[row].indexOf(e) == -1 && transpose(board)[col].indexOf(e) == -1 && box.indexOf(e) == -1) {
					board[row][col] = e;
					if (checkBoard(board)) {
						counter += 1;
						break;
					} else {
						if (solveBoard(board)) {
							return true;
						}
					}
					 
				}
			}
			break;
		}
	}
	board[row][col] = '0';
}

function toggleSpecial() {
	if (document.getElementById('specialPanel').style.display == 'none') {
		document.getElementById('specialPanel').style.display = 'block';
	} else {
		document.getElementById('specialPanel').style.display = 'none';
	}
	document.getElementById('specialPanel2').style.display = document.getElementById('specialPanel').style.display;
}

function fillUnlockedAll() {
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			let c = document.getElementById('' + i + j);
			if (!c.classList.contains('locked') && c.nums.length != 1) {
				c.nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
				fillCell(c);
			}
		}
	}
	solverState = -1;
	solverStart = true;
}

function fillUnlockedAccurate() {
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			let c = document.getElementById('' + i + j);
			if (!c.classList.contains('locked') && c.nums.length != 1) {
				c.nums = getAllValidNums('' + i + j);
				fillCell(c);
			}
		}
	}
	solverState = -1;
	solverStart = true;
}








function checkDuplicateCoordsImport(array) {
	// Precondition: every element is at least 2 chars long
	for (let i = 0; i < array.length; i++) {
		let target = array[i].substring(0, 2);
		let c = 0;
		for (let j = i; j < array.length; j++) {
			c += array[j].substring(0, 2) == array[i].substring(0, 2) ? 1 : 0;
		}
		if (c != 1) {
			return false;
		}
	}
	return true;
}

function checkCorrectSyntaxImport(array) {
	const validCoordChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
	const validChars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'L', 'S'];
	for (let i = 0; i < array.length; i++) {
		if (array[i].length < 2) {
			return false;
		}
		if (!validCoordChars.includes(array[i].substring(0, 1)) || !validCoordChars.includes(array[i].substring(1, 2))) {
			return false;
		}
		for (let j = 2; j < array[i].length; j++) {
			if (!validChars.includes(array[i].substring(j, j + 1))) {
				return false;
			}
		}
	}
	return true;
}

function getNumsImport(string) {
	const validChars = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
	let tempArr = [];
	for (let i = 0; i < string.length; i++) {
		if (validChars.includes(string.substring(i, i + 1)) && !tempArr.includes(string.substring(i, i + 1))) {
			tempArr.push(string.substring(i, i + 1));
		}
	}
	return tempArr;
}

function testForCommandImport(string, command) {
	// Precondition: command is one char long
	for (let i = 0; i < string.length; i++) {
		if (string.substring(i, i + 1) == command) {
			return true;
		}
	}
	return false;
}

function getAllValidNums(cellID) {
	// Precondition: cellID is a valid cellID (2 digits) and is a string
	let validNums = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

	let boxTopLeftCoords = [Math.floor(Number.parseInt(cellID[0]) / 3) * 3, Math.floor(Number.parseInt(cellID[1]) / 3) * 3];
	for (let i = boxTopLeftCoords[0]; i < boxTopLeftCoords[0] + 3; i++) {
		for (let j = boxTopLeftCoords[1]; j < boxTopLeftCoords[1] + 3; j++) {
			if (i.toString() + j.toString() == cellID) {
				continue;
			}
			let targetCell = document.getElementById(i.toString() + j.toString());
			if (targetCell.nums.length == 1) {
				if (validNums.indexOf(targetCell.nums[0]) != -1) {
					validNums.splice(validNums.indexOf(targetCell.nums[0]), 1);
				}
			}
		}
	}

	for (let i = 0; i < 9; i++) {
		if (i >= boxTopLeftCoords[0] && i < boxTopLeftCoords[0] + 3) {
			continue;
		}

		let targetCell = document.getElementById(i.toString() + cellID[1]);
		if (targetCell.nums.length == 1) {
			if (validNums.indexOf(targetCell.nums[0]) != -1) {
				validNums.splice(validNums.indexOf(targetCell.nums[0]), 1);
			}
		}
	}

	for (let i = 0; i < 9; i++) {
		if (i >= boxTopLeftCoords[1] && i < boxTopLeftCoords[1] + 3) {
			continue;
		}

		let targetCell = document.getElementById(cellID[0] + i.toString());
		if (targetCell.nums.length == 1) {
			if (validNums.indexOf(targetCell.nums[0]) != -1) {
				validNums.splice(validNums.indexOf(targetCell.nums[0]), 1);
			}
		}
	}

	return validNums;
}

