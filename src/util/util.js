
export function roundNumber(number) {
	let result = parseFloat(number).toFixed(2);
	if (!isNaN(result)) {
		return result;
	} else {
		return 0;
	}
};

export function getPercentsMultiplier(discount) {
	return 1 - discount / 100;
}