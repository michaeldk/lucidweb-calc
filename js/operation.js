class Operation {
	constructor(parent) {
		this.stack = [];
		this.parent = parent || null;
	}

	/**
	 * Get result of operation
	 * Processing stack 3 by 3 (operand, operator, operand)
	 * Recursive calls when operand is an operation
	 */
	getResult() {
		while(this.stack.length > 1) { // when stack.length == 1, it's the final answer.
			let currentResult = 0;
			let currentElement = this.stack.shift(); // first operand

			if (currentElement instanceof Operation) {
				currentResult = currentElement.getResult(); // recursive call
			} else if (typeof currentElement == 'number') { // simple number
				currentResult = currentElement;
			}

			let operator = this.stack.shift(); // next is always an operator
			let otherOperand = this.stack.shift(); // next is always an operand

			switch (operator) { // handle operator
				case '+':
					currentResult += (otherOperand instanceof Operation? otherOperand.getResult() : otherOperand); // don't forget otherOperand can be an operation
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

			// add temporary result as next first operand
			this.stack.unshift(currentResult);

		}

		return this.stack.shift(); // last item is the final answer
	}

	/**
	 * Getter and setter for parent
	 */
	getParent() {
		return this.parent;
	}
	setParent(parent) {
		return this.parent = parent;
	}

	/**
	 * Add operand to stack
	 */
	addOperand(operand) {
		if (operand instanceof Operation) {
			operand.setParent(this);
		}
		this.stack.push(operand);
	}

	/**
	 * Pop last added operand
	 * Used when last added operand is part of a new operation
	 */
	undoAdd() {
		return this.stack.pop();
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