let solverState = -1;
let solverStart = true;
let solverContinue = true;
let solverUpdate = false;
let solverInfo;

function solverTakeStep() {
	if (solverUpdate) {
		solverUpdate = false;
		switch(solverState) {
			case 1:
				findHiddenSinglesUpdate(solverInfo[0], solverInfo[1]);
				solverState = -1;
				clearCellHighlights();
				break;
			case 2:
				findNakedNPairsUpdate(solverInfo[0], solverInfo[1]);
				solverState = -1;
				clearCellHighlights();
				break;
			case 3:
				break;
			case 4:
				break;
			case 5:
				break;
			case 6:
				break;
			case 7:
				break;
			case 8:
				break;
			case 9:
				break;
			case 10:
				break;
			case 11:
				break;
			case 12:
				break;
			case 13:
				break;
			case 14:
				break;
			case 15:
				break;
			case 16:
				break;
			case 17:
				break;
			case 18:
				break;
			case 19:
				break;
			case 20:
				break;
			case 21:
				break;
			case 22:
				break;
			case 23:
				break;
			case 24:
				break;
			case 25:
				break;
			case 26:
				break;
			case 27:
				break;
			case 28:
				break;
			case 29:
				break;
			case 30:
				break;
			case 31:
				break;
			case 32:
				break;
			case 33:
				break;
			case 34:
				break;
			case 35:
				break;
			case 36:
				break;
			case 37:
				break;
			case 38:
				break;
		}
		return;
	}

	solverContinue = true;

	for (let i = 0; i < 39; i++) {
		document.getElementById("sp" + i).lastElementChild.innerHTML = null;
	}

	while (solverContinue) {
		solverState++;
		
		for (let i = 0; i < 39; i++) {
			document.getElementById("sp" + i).style.backgroundColor = null;
		}

		if (detectInvalidBoard()) {
			alert("Invalid board.")
			solverState = -1;
			solverStart = true;
			return;
		}

		if (!checkForEmptyCells()) {
			alert("Board is complete.")
			solverState = -1;
			solverStart = true;
			return;
		}

		let t = false, msg;

		console.log(solverState);

		switch(solverState) {
			case 0:
				t = reducePossibilities();
				msg = t;
				break;
			case 1:
				solverInfo = findHiddenSingles();
				t = solverInfo[0].length;
				msg = t;
				if (t) {
					let c = [];
					for (let i = 0; i < t; i++) {
						c.push(document.getElementById(solverInfo[0][i].id + solverInfo[1][i]));
					}
					highlightTargets(c, r=0, g=0, b=255);
					solverUpdate = true;
					solverContinue = false;
				}
				break;
			case 2:
				solverInfo = findNakedNPairs(2);
				if (!solverInfo[0].length) {
					solverInfo = findNakedNPairs(3);
				}
				t = solverInfo[0].length;
				msg = t ? "Yes" : "No";
				if (t) {
					let c = [];
					for (let i = 0; i < solverInfo[0].length; i++) {
						for (let n = 0; n < solverInfo[1].length; n++) {
							if (solverInfo[0][i].nums.includes(solverInfo[1][n])) {
								c.push(document.getElementById(solverInfo[0][i].id + solverInfo[1][n]));
							}
						}
					}
					highlightTargets(c, r=255, g=255, b=0);
					c = [];
					for (let i = 0; i < solverInfo[2].length; i++) {
						for (let n = 0; n < solverInfo[2][i].nums.length; n++) {
							c.push(document.getElementById(solverInfo[2][i].id + solverInfo[2][i].nums[n]));
						}
					}
					highlightTargets(c, r=0, g=255, b=0, false);
					solverUpdate = true;
					solverContinue = false;
				}
				break;
			case 3:
				break;
			case 4:
				break;
			case 5:
				break;
			case 6:
				break;
			case 7:
				break;
			case 8:
				break;
			case 9:
				break;
			case 10:
				break;
			case 11:
				break;
			case 12:
				break;
			case 13:
				break;
			case 14:
				break;
			case 15:
				break;
			case 16:
				break;
			case 17:
				break;
			case 18:
				break;
			case 19:
				break;
			case 20:
				break;
			case 21:
				break;
			case 22:
				break;
			case 23:
				break;
			case 24:
				break;
			case 25:
				break;
			case 26:
				break;
			case 27:
				break;
			case 28:
				break;
			case 29:
				break;
			case 30:
				break;
			case 31:
				break;
			case 32:
				break;
			case 33:
				break;
			case 34:
				break;
			case 35:
				break;
			case 36:
				break;
			case 37:
				break;
			case 38:
				break;
			default:
				solverContinue = false;
				solverState = -1;
				return;
		}

		if (solverState <= 38) {
			document.getElementById("sp" + solverState).lastElementChild.innerHTML = '<b><span style="color: ' + (t ? 'lime' : 'red') + ';">' + msg + '</span></b>';
			document.getElementById("sp" + solverState).style.backgroundColor = 'rgb(150, 150, 0)';
		}
		if (!solverUpdate && t) {
			solverContinue = false;
			solverState = -1;	
		}
	}
}

function detectInvalidBoard() {
	for (let i = 0; i < 9; i++) {
		let found = [], foundCellReference = [];
		for (let j = 0; j < 9; j++) {
			let toCheck = document.getElementById('' + i + j);
			if (toCheck.nums.length == 1) {
				if (found.includes(toCheck.nums[0])) {
					return true;
				} else {
					found.push(toCheck.nums[0]);
					foundCellReference.push(toCheck);
				}
			}
		}
	}
	for (let j = 0; j < 9; j++) {
		let found = [], foundCellReference = [];
		for (let i = 0; i < 9; i++) {
			let toCheck = document.getElementById('' + i + j);
			if (toCheck.nums.length == 1) {
				if (found.includes(toCheck.nums[0])) {
					return true;
				} else {
					found.push(toCheck.nums[0]);
					foundCellReference.push(toCheck);
				}
			}
		}
	}
	for (let b = 0; b < 9; b++) {
		let found = [], foundCellReference = [];
		for (let i = Math.floor(b / 3) * 3; i < Math.floor(b / 3) * 3 + 3; i++) {
			for (let j = (b % 3) * 3; j < (b % 3) * 3 + 3; j++) {
				let toCheck = document.getElementById('' + i + j);
				if (toCheck.nums.length == 1) {
					if (found.includes(toCheck.nums[0])) {
						return true;
					} else {
						found.push(toCheck.nums[0]);
						foundCellReference.push(toCheck);
					}
				}
			}
		}
	}
	return false;
}

function reducePossibilities() {
	let hasChanged = 0;
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			let c = document.getElementById('' + i + j);
			if (!c.classList.contains('locked') && c.nums.length != 1) {
				let validNums = getAllValidNums('' + i + j);
				if (solverStart && c.nums.sort().join(" ") != validNums.sort().join(" ")) {
					hasChanged++;
					c.nums = validNums;
				} else if (!solverStart) {
					let isChanged = false;
					for (let n = c.nums.length - 1; n >= 0; n--) {
						if (!validNums.includes(c.nums[n])) {
							c.nums.splice(n, 1);
							isChanged = true;
						}
					}
					hasChanged += isChanged ? 1 : 0;
				}
				
				fillCell(c);
			}
		}
	}
	solverStart = false;
	return hasChanged;
}

function findHiddenSingles() {
	let hasChangedCells = [], hasChangedNums = [];

	function addFoundNumbers(i, j, found, foundCellReference) {
		let toCheck = document.getElementById('' + i + j);
		if (toCheck.nums.length > 1) {
			for (let n of toCheck.nums) {
				found.push(n);
				foundCellReference.push(toCheck);
			}
		}
	}

	function updateChangedCellsNums(found, foundCellReference) {
		for (let n = 1; n <= 9; n++) {
			if (countOccurrences(found, n.toString()) == 1) {
				let temp = foundCellReference[found.indexOf(n.toString())];
				if (!hasChangedCells.includes(temp)) {
					hasChangedCells.push(temp);
					hasChangedNums.push(n.toString());
				}
			}
		}
	}

	for (let i = 0; i < 9; i++) {
		let found = [], foundCellReference = [];
		for (let j = 0; j < 9; j++) {
			addFoundNumbers(i, j, found, foundCellReference);
		}
		updateChangedCellsNums(found, foundCellReference);
	}
	for (let j = 0; j < 9; j++) {
		let found = [], foundCellReference = [];
		for (let i = 0; i < 9; i++) {
			addFoundNumbers(i, j, found, foundCellReference);
		}
		updateChangedCellsNums(found, foundCellReference);
	}
	for (let b = 0; b < 9; b++) {
		let found = [], foundCellReference = [];
		for (let i = Math.floor(b / 3) * 3; i < Math.floor(b / 3) * 3 + 3; i++) {
			for (let j = (b % 3) * 3; j < (b % 3) * 3 + 3; j++) {
				addFoundNumbers(i, j, found, foundCellReference);
			}
		}
		updateChangedCellsNums(found, foundCellReference);
	}
	return [hasChangedCells, hasChangedNums];
}

function findHiddenNPairs(n = 2) {
	let changedCells = [], keepNums = [];

	for (let i = 0; i < 9; i++) {
		for (let cellCombo of combinations(9, n)) {
			testEveryNum: for (let numCombo of combinations(9, n)) {
				for (let j = 0; j < 9; j++) {
					let targetCell = document.getElementById("" + i + j);
					if (cellCombo.includes(j + 1) && (!numCombo.some(n => targetCell.nums.indexOf("" + n) >= 0) || targetCell.nums.length <= 1)) {
						continue testEveryNum;
					}
					if (!cellCombo.includes(j + 1) && numCombo.some(n => targetCell.nums.indexOf("" + n) >= 0)) {
						continue testEveryNum;
					}
				}
				numCombo.forEach(n => keepNums.push("" + n));
				cellCombo.forEach(c => changedCells.push(document.getElementById("" + i + (c - 1))));
				return ([changedCells, keepNums]);
			}
		}
	}
	return ([changedCells, keepNums]);
}

function findHiddenSinglesUpdate(cells, nums) {
	for (let i = 0; i < cells.length; i++) {
		cells[i].nums = [nums[i]];
		fillCell(cells[i]);
	}
}

function findNakedNPairs(n = 2) {
	let changedCells = [], deleteNums = [], pairCells = [];

	function checkUpdateChangedCells(i, j) {
		let c = document.getElementById("" + i + j);
		if (!pairCells.includes(c) && checkSharedElement(c.nums, deleteNums)) {
			changedCells.push(c);
		}
	}

	for (let i = 0; i < 9; i++) {
		for (let combo of combinations(9, n)) {
			let allVals = new Set();
			for (let comboIndex = 0; comboIndex < combo.length; comboIndex++) {
				let c = document.getElementById("" + i + (combo[comboIndex] - 1));
				if (c.nums.length > 1) {
					c.nums.forEach(num => allVals.add(num));
				} else {
					allVals = new Set();
					break;
				}
			}
			if (allVals.size == n) {
				allVals.forEach(num => deleteNums.push(num));
				combo.forEach(e => pairCells.push(document.getElementById("" + i + (e - 1))));
				break;
			}
		}
		if (deleteNums.length) {
			for (let j = 0; j < 9; j++) {
				checkUpdateChangedCells(i, j);
			}
			if (changedCells.length) {
				return [changedCells, deleteNums, pairCells];
			} else {
				changedCells = [], deleteNums = [], pairCells = [];
			}
		}
	}
	for (let j = 0; j < 9; j++) {
		for (let combo of combinations(9, n)) {
			let allVals = new Set();
			for (let comboIndex = 0; comboIndex < combo.length; comboIndex++) {
				let c = document.getElementById("" + (combo[comboIndex] - 1) + j);
				if (c.nums.length > 1) {
					c.nums.forEach(num => allVals.add(num));
				} else {
					allVals = new Set();
					break;
				}
			}
			if (allVals.size == n) {
				allVals.forEach(num => deleteNums.push(num));
				combo.forEach(e => pairCells.push(document.getElementById("" + (e - 1) + j)));
				break;
			}
		}
		if (deleteNums.length) {
			for (let i = 0; i < 9; i++) {
				checkUpdateChangedCells(i, j);
			}
			if (changedCells.length) {
				return [changedCells, deleteNums, pairCells];
			} else {
				changedCells = [], deleteNums = [], pairCells = [];
			}
		}
	}
	for (let b = 0; b < 9; b++) {
		for (let combo of combinations(9, n)) {
			let allVals = new Set();
			for (let comboIndex = 0; comboIndex < combo.length; comboIndex++) {
				let i = Math.floor(b / 3) * 3 + Math.floor((combo[comboIndex] - 1) / 3), j = (b % 3) * 3 + ((combo[comboIndex] - 1) % 3);
				let c = document.getElementById("" + i + j);
				if (c.nums.length > 1) {
					c.nums.forEach(num => allVals.add(num));
				} else {
					allVals = new Set();
					break;
				}
			}
			if (allVals.size == n) {
				allVals.forEach(num => deleteNums.push(num));
				combo.forEach(e => pairCells.push(document.getElementById("" + (Math.floor(b / 3) * 3 + Math.floor((e - 1) / 3)) + ((b % 3) * 3 + ((e - 1) % 3)))));
				break;
			}
		}
		if (deleteNums.length) {
			for (let b1 = 0; b1 < 9; b1++) {
				checkUpdateChangedCells(Math.floor(b / 3) * 3 + Math.floor(b1 / 3), j = (b % 3) * 3 + (b1 % 3));
			}
			if (changedCells.length) {
				return [changedCells, deleteNums, pairCells];
			} else {
				changedCells = [], deleteNums = [], pairCells = [];
			}
		}
	}
	return [changedCells, deleteNums];
}

function findNakedNPairsUpdate(cells, deleteNums) {
	for (let i = 0; i < cells.length; i++) {
		for (let n of deleteNums) {
			if (cells[i].nums.includes(n)) {
				cells[i].nums.splice(cells[i].nums.indexOf(n), 1);
			}
		}
		fillCell(cells[i]);
	}
}