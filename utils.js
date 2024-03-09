function rgb2array(rgb) {
	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	return !!rgb ? [parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3])] : [255, 255, 255];
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function transpose(array) {
	let a = [];
	for (let i = 0; i < array[0].length; i++) {
		a.push([]);
		for (let j = 0; j < array.length; j++) {
			a[i].push(array[j][i]);
		}
	}
	return a;
}

function checkSharedElement(a, b) {
	for (let i = 0; i < a.length; i++) {
		for (let j = 0; j < b.length; j++) {
			if (a[i] == b[j]) {
				return true;
			}
		}
	}
	return false;
}

const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

function factorial(n) {
	let t = 1;
	for (i = 1; i <= n; i++) {
		t *= i;
	}
	return t;
}

function combinations(n, k) {
	let result = [];
	let stack = [];
	function combine(currentNumber) {
		if (stack.length == k) {
			let newCombo = stack.slice();
			result.push(newCombo);
			return;
		}
		if (currentNumber > n) {
			return;
		}

		stack.push(currentNumber);
		combine(currentNumber + 1);
		stack.pop();
		combine(currentNumber + 1);
	}
	combine(1);
	return result;
}