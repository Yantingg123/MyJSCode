function calculate(operation, operand1, operand2 = 0) {
    var result = 0;
    switch (operation) {
        case "+":
            result = operand1 + operand2;
            break;
        case "-":
            result = operand1 - operand2;
            break;
        case "*":
            result = operand1 * operand2;
            break;
        case "/":
            result = operand1 / operand2;
            break;
        case "exp":
            result = Math.pow(operand1, operand2);
            break;
        case "sqrt":
            result = Math.sqrt(operand1);
            break;
        default:
            result - "Invalid operation";
    }
    return result;
}

function displayResult(operation, operand1, operand2 = 0) {
    let result = calculate(operation, operand1, operand2);
    let resultString = operand1 + " " + operation + (operand2 != 0 ? " " + operand2 : "") + " = " + result;
    return resultString;
}

console.log(displayResult("+", 5, 3));
console.log(displayResult("-", 5, 3));
console.log(displayResult("*", 5, 3));
console.log(displayResult("/", 5, 3));
console.log(displayResult("exp", 5, 3));
console.log(displayResult("sqrt", 16));

// Path: MyJSCode/Lesson04a/calculatorApp.js