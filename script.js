const buttons = document.querySelectorAll("button");
const display = document.querySelector("#display");

for (i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", e => action(e.target.id));
}

let leftOperand, operator, rightOperand, displayFrozen, displayRefresh, lastAnswer;
allClear()

function action(id) {
    if (displayFrozen && id !== "ac") {
        return;
    }

    if (id[0] === 'b') {
        addDigit(id[1]);
        return;
    }

    switch (id) {
        case "pi":
            display.textContent = "3.14";
            displayRefresh = false;
            break;
        case "lan":
            display.textContent = lastAnswer;
            displayRefresh = false;
            break;
        case "ac":
            allClear();
            break;
        case "eq":
            if (leftOperand !== null && operator !== null) {
                rightOperand = readDisplay();
                const ans = operate(operator, leftOperand, rightOperand).toFixed(2);
                processAnswer(ans);
                lastAnswer = ans;
                displayRefresh = true;
            }
            break;
        default:
            if (operator === null) {
                leftOperand = readDisplay();
                operator = id;
                displayRefresh = true;
            } else {
                rightOperand = readDisplay();
                const ans = operate(operator, leftOperand, rightOperand);
                processAnswer(ans);
                operator = id;
                displayRefresh = true;
            }
    }


}

function operate(operator, a, b) {
    switch (operator) {
        case "plu":
            return a + b;
        case "sub":
            return a - b;
        case "mul":
            return a * b;
        case "div":
            return b === 0 ? undefined : a / b;
        default:
            return undefined;
    }
}

function processAnswer(ans) {
    if (ans === undefined) {
        display.textContent = "MathError";
        displayFrozen = true;
    } else {
        display.textContent = ans;
        leftOperand = ans;
        operator = null;
        rightOperand = null;
    }
}

function allClear() {
    leftOperand = null;
    operator = null;
    rightOperand = null;
    displayRefresh = true;
    displayFrozen = false;
    lastAnswer = 0
    display.textContent = "0";
}

function addDigit(ch) {
    if (displayRefresh) {
        display.textContent = ch;
        displayRefresh = false;
    } else {
        display.textContent += ch;
    }
}

function readDisplay() {
    if (displayRefresh) {
        display.textContent = 0;
        displayRefresh = false;
        return 0;
    }
    return Number(display.textContent);
}