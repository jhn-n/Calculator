"use strict";

const pi = "3.141592653589793"
const keyMap = {
    '+': "plu",
    '-': "sub",
    '*': "mul",
    '/': "div",
    ".": "dp",
    "=": "eq",
    "Delete": "del",
    "Backspace": "del",
    "a": "ac",
    "p": "pi",
};

const buttons = document.querySelectorAll("button");
const display = document.querySelector("#display");

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", e => actionWrapper(e.target.id));
}

document.addEventListener("keydown", e => {
    const keyName = e.key; 
    if (keyName >= '0' && keyName <= '9') {
        actionWrapper('b' + keyName);
    }
    if (keyName in keyMap) {
        actionWrapper(keyMap[keyName]);
    }
});

let registers, operator, current;
let lastKeyPress, displayFrozen;
let lastAnswer;
allClear()

function actionWrapper(id) {
    if (displayFrozen && id !== "ac") {
        // must use allClear to unfreeze
    } else {
        action(id);
    }
}

function action(id) {
    const switchVal = (id[0] === 'b') ? "digit" : id;
    switch (switchVal) {
        case "digit":
            registers[current] += id[1];
            displayWorking(registers[current]);
            break;
        case "ac":
            allClear();
            break;
        case "del":
            registers[current] = registers[current].slice(0, -1);
            displayWorking(registers[current]);
            break;
        case "lan":
            registers[current] = lastAnswer;
            displayAns(registers[current]);
            break;
        case "dp":
            if (!registers[current].includes(".")) {
                registers[current] += ".";
            }
            displayWorking(registers[current]);
            break;
        case "pi":
            registers[current] = pi;
            displayAns(registers[current]);
            break;
        case "eq":
            actionEq();
            break;
        case "plu":
        case "sub":
        case "mul":
        case "div":
            actionOp(id);
    }
    lastKeyPress = id;
}

function actionEq() {
    if (registers[1]) {
        lastAnswer = calculate();
        displayAns(lastAnswer);
        registers = ["", ""]
        current = 0;
    }
}

function actionOp(id) {
    if (lastKeyPress === "eq") {
        registers = [lastAnswer, ""];
    }
    if (registers[1]) {
        registers = [calculate(), ""];
    }
    displayAns(registers[0])
    operator = id;
    current = 1;
}

function calculate() {
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

function displayAns(x) {
    if (!isFinite(Number(x))) {
        display.textContent = mathError();
    } else {
        display.textContent = String(Number(x));
    }
}

function displayWorking(x) {
    display.textContent = x.length > 20 ? "..." + x.slice(-20) : x;
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