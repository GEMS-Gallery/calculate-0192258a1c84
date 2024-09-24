import { backend } from 'declarations/backend';

let display = document.getElementById('display');
let currentInput = '';
let currentOperation = null;
let previousInput = null;

function updateDisplay() {
    display.value = currentInput;
}

function handleNumberClick(num) {
    currentInput += num;
    updateDisplay();
}

function handleOperationClick(op) {
    if (currentInput !== '') {
        if (previousInput !== null) {
            handleEqualsClick();
        }
        previousInput = parseFloat(currentInput);
        currentInput = '';
        currentOperation = op;
    }
}

async function handleEqualsClick() {
    if (previousInput !== null && currentInput !== '' && currentOperation !== null) {
        const x = previousInput;
        const y = parseFloat(currentInput);
        let result;

        try {
            switch (currentOperation) {
                case '+':
                    result = await backend.add(x, y);
                    break;
                case '-':
                    result = await backend.subtract(x, y);
                    break;
                case '*':
                    result = await backend.multiply(x, y);
                    break;
                case '/':
                    const divResult = await backend.divide(x, y);
                    result = divResult[0] !== null ? divResult[0] : 'Error';
                    break;
            }

            currentInput = result.toString();
            updateDisplay();
            previousInput = null;
            currentOperation = null;
        } catch (error) {
            console.error('Error performing calculation:', error);
            currentInput = 'Error';
            updateDisplay();
        }
    }
}

function handleClearClick() {
    currentInput = '';
    previousInput = null;
    currentOperation = null;
    updateDisplay();
}

// Add event listeners
document.querySelectorAll('.num').forEach(button => {
    button.addEventListener('click', () => handleNumberClick(button.textContent));
});

document.querySelectorAll('.op').forEach(button => {
    button.addEventListener('click', () => handleOperationClick(button.textContent));
});

document.getElementById('equals').addEventListener('click', handleEqualsClick);
document.getElementById('clear').addEventListener('click', handleClearClick);
