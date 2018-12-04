class Calculator {
	/**
	 * Parse user input and return curated array
	 * Ex: Input: "[1, "'+'", 4, "'-'", 6, "'/'", 2]"
	 *     Output: [1, "+", 4, "+", 6, "+", 2]
	 */
	parse() {
		let inputChunks = this.input.value.split(",");
		let inputVal = [];

		for (var i = 0; i < inputChunks.length; i++) {
			let char = inputChunks[i];
			char = char.trim();
			if (char.startsWith("[")) {
				char = char.substr(1);
			}
			if (char.endsWith("]")) {
				char = char.substring(0, char.length - 1);
			}
			if (isNaN(char)) {
				if (char.startsWith("'")) {
					char = char.substr(1);
				}
				if (char.endsWith("'")) {
					char = char.substring(0, char.length - 1);
				}
				inputVal.push(char);
			} else {
				inputVal.push(parseInt(char));
			}
		}

	    return inputVal;
	}

	/**
	 * Calculate and display answer
	 */
	calculate() {
		let inputVal = this.parse();
		let mainOperation = this.init(inputVal);
		this.displayDetails(mainOperation.toString());
		this.displayOutput(mainOperation.getResult());
	}

	/**
	 * Parse input and build Operation tree
	 */
	init(inputVal) {
		let mainOperation = new Operation();
		let currentOperation = mainOperation;

		for (var index = 0; index < inputVal.length; index++) {
			let currentElement = inputVal[index];
			if (isNaN(currentElement)) { // is operator
				switch (currentElement) {
					case '+':
					case '-':
						if (currentOperation.getParent()) { // if not top level operation
							currentOperation = currentOperation.getParent(); // '+' or '-' means operation is over
						}
						currentOperation.addOperand(currentElement);
						break;
					case '/':
					case '*':
						// we need to go deeper
						let newOperation = new Operation();
						// we need to remove the last operand added to the current operation
						let previousOperand = currentOperation.undoAdd(); // pop()
						let nextOperand = inputVal[++index]; // also increasing index because we already handled the next input
		                newOperation.addOperand(previousOperand); // push first operand
		                newOperation.addOperand(currentElement); // push operator
		                newOperation.addOperand(nextOperand); // push second operand

		                currentOperation.addOperand(newOperation); // makes currentOperation parent of newOperation

		                currentOperation = newOperation; // we go deeper
		                break;
	            }
	        } else { // is a number
	          	currentOperation.addOperand(currentElement); // simple push, nothing fancy to do
	        }
	    }

	    return mainOperation;
	}

	/**
	 * Display answer in DOM
	 */
	displayOutput(result) {
		this.output.innerHTML = result;
	}

	/**
	 * Display details in DOM
	 */
	displayDetails(details) {
		this.details.innerHTML = details;
	}

	constructor(input, output, details) {
		this.input = document.querySelector(input);
		this.output = document.querySelector(output);
		this.details = document.querySelector(details);
		let that = this; // have `this` available in EventListener below
		this.input.addEventListener('keypress', function(event) {
			if (event.keyCode == 13) { // Key = Enter
				that.calculate();
			}
		});
	}
}