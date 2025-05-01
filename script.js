"use strict";

const keyMap = {
    '+': "plu",
    '-': "sub",
    '*': "mul",
    '/': "div",
    ".": "dp",
    "Enter": "eq",
    "Delete": "del",
    "Backspace": "del",
};

const buttons = document.querySelectorAll("button");
const display = document.querySelector("#display");

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", e => actionInput(e.target.id));
}

document.addEventListener("keydown", e => {
    const keyName = e.key;
    if (keyName >= '0' && keyName <= '9') {
        actionInput('b' + keyName);
    }
    if (keyName in keyMap) {
        actionInput(keyMap[keyName]);
    }
});

let registers, operator, current;
let lastKeyPress, displayFrozen;
let lastAnswer;
allClear()

function actionInput(id) {

    if (displayFrozen && id !== "ac") {
        // need to wait for allClear input
    } else if (id[0] === 'b') {
        // deal with numerical inputs
        registers[current] += id[1];
        writeDisplay(registers[current]);
    } else {
        // all other inputs
        actionOperation(id);
    }
    lastKeyPress = id;
}

function actionOperation(id) {

    switch (id) {
        case "ac":
            allClear();
            break;
        case "del":
            registers[current] = registers[current].slice(0, -1);
            writeDisplay(registers[current]);
            break;
        case "lan":
            registers[current] = lastAnswer;
            writeDisplay(registers[current]);
            break;
        case "dp":
            if (!registers[current].includes(".")) {
                registers[current] += ".";
            }
            break;
        case "pi":
            registers[current] = "3.14159265359";
            writeDisplay(registers[current]);
            break;
        case "eq":
            if (registers[1]) {
                lastAnswer = operate();
                writeDisplay(lastAnswer);
                registers = ["", ""]
                current = 0;
            }
            break;
        default:
            if (lastKeyPress === "eq") {
                registers = [lastAnswer, ""];
            }
            if (registers[1]) {
                const tempAns = operate();
                writeDisplay(tempAns);
                registers = [tempAns, ""];
            }
            operator = id;
            current = 1;
    }
}

function operate() {
    const a = Number(registers[0]);
    const b = Number(registers[1]);
    var ans = 0;
    switch (operator) {
        case "plu":
            ans = a + b;
            break;
        case "sub":
            ans = a - b;
            break;
        case "mul":
            ans = a * b;
            break;
        case "div":
            if (b === 0) {
                ans = mathError();
            } else {
                ans = a / b;
            }
    }
    return String(ans);
}

function writeDisplay(x) {
    if (Number(x) >= 1_000_000_000_000) {
        display.textContent = mathError();
    } else if (Number(x) < 0.0000000001 && Number(x) > -0.0000000001) {
        display.textContent = 0;
    } else {
        display.textContent = x.slice(0, 13);
    }
}

function mathError() {
    displayFrozen = true;
    return "MathError";
}

function allClear() {
    registers = ["", ""]
    current = 0;
    displayFrozen = false;
    lastAnswer = 0;
    display.textContent = "0";
}