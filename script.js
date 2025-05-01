"use strict";

const buttons = document.querySelectorAll("button");
const display = document.querySelector("#display");

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", e => action(e.target.id));
}

let registers, operator, current;
let lastKeyPress, displayFrozen;
allClear()

let lastAnswer = 0;

function action(id) {
    if (displayFrozen && id !== "ac") {
        return;
    }

    if (id[0] === 'b') {
        addDigit(id[1]);
        writeDisplay(registers[current]);
    } else {
        switch (id) {
            case "ac":
                allClear();
                break;
            case "pi":
                registers[current] = "3.14159265359";
                writeDisplay(registers[current]);
                break;
            case "lan":
                registers[current] = lastAnswer;
                writeDisplay(registers[current]);
                break;
            case "eq":
                if (registers[0] && operator && registers[1]) {
                    lastAnswer = operate();
                    writeDisplay(lastAnswer);
                    registers = ["", ""]
                    current = 0;
                    operator = null;
                }
                break;
            default:
                if (lastKeyPress === "eq") {
                    registers[0] = lastAnswer;
                    current = 1;
                    operator = id;
                } else if (current === 0) {
                    current = 1;
                    operator = id;
                } else {
                    const tempAns = operate();
                    writeDisplay(tempAns);
                    registers = [tempAns, ""];
                    operator = id;
                    current = 1;
                }
        }
    }
    lastKeyPress = id;
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

function addDigit(ch) {
    registers[current] += ch;
}

function writeDisplay(x) {
    if (Number(x) >= 1_000_000_000_000) {
        display.textContent = mathError();
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
    operator = null;
    lastKeyPress = null;
    displayFrozen = false;
    display.textContent = "on";
}