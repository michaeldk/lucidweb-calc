class Calculator {
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
	calculate() {
		let inputVal = this.parse();
		let mainOperation = this.init(inputVal);
		this.displayDetails(mainOperation.toString());
		this.displayOutput(mainOperation.getResult());
	}

	init(inputVal) {
		let mainOperation = new Operation();
		let currentOperation = mainOperation;
		for (var index = 0; index < inputVal.length; index++) {
			let currentElement = inputVal[index];
			if (isNaN(currentElement)) {
				switch (currentElement) {
					case '+':
					case '-':
						if (currentOperation.getParent()) {
							currentOperation = currentOperation.getParent();
						}
						currentOperation.addOperand(currentElement);
						break;
					case '/':
					case '*':
						let newOperation = new Operation();
						let previousOperand = currentOperation.undoAdd();
						let nextOperand = inputVal[++index];
		                newOperation.addOperand(previousOperand); // add operator
		                newOperation.addOperand(currentElement); // add operator
		                newOperation.addOperand(nextOperand); // add operator

		                currentOperation.addOperand(newOperation);

		                currentOperation = newOperation;
		                break;
	            }
	        } else { // is a number
	          	currentOperation.addOperand(currentElement);
	        }
	    }

	    return mainOperation;
	}

	displayOutput(result) {
		this.output.innerHTML = result;
	}
	displayDetails(details) {
		this.details.innerHTML = details;
	}

	constructor(input, output, details) {
		this.input = document.querySelector(input);
		this.output = document.querySelector(output);
		this.details = document.querySelector(details);
		let that = this;
		this.input.addEventListener('keypress', function(event) {
			if (event.keyCode == 13) {
				that.calculate();
			}
		});
	}
}