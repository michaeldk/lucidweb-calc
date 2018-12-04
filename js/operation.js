class Operation {
	constructor(parent) {
		this.stack = [];
		this.parent = parent || null;
	}

	getResult() {
		while(this.stack.length > 1) {
			let currentResult = 0;
			let currentElement = this.stack.shift();

			if (currentElement instanceof Operation) {
				currentResult = currentElement.getResult();
			} else if (typeof currentElement == 'number') {
				currentResult = currentElement;
			}

			let operator = this.stack.shift();
			let otherOperand = this.stack.shift();

			switch (operator) {
				case '+':
					currentResult += (otherOperand instanceof Operation? otherOperand.getResult() : otherOperand);
					break;
				case '-':
					currentResult -= (otherOperand instanceof Operation? otherOperand.getResult() : otherOperand);
					break;
				case '/':
					currentResult /= (otherOperand instanceof Operation? otherOperand.getResult() : otherOperand);
					break;
				case '*':
					currentResult *= (otherOperand instanceof Operation? otherOperand.getResult() : otherOperand);
					break;
			}

			this.stack.unshift(currentResult);

		}

		return this.stack.shift();
	}

	getParent() {
		return this.parent;
	}
	setParent(parent) {
		return this.parent = parent;
	}

	addOperand(operand) {
		if (operand instanceof Operation) {
			operand.setParent(this);
		}
		this.stack.push(operand);
	}
	undoAdd() {
		return this.stack.pop();
	}

	isComplete() {
		return this.stack.length == 3;
	}

	toString() {
		let res = '(';

		for (let i = 0; i < this.stack.length; i++) {
			let element = this.stack[i];
			res += element instanceof Operation? element.toString() : element
		}

		return res + ')';
	}
}