/* Calc constants maps the id of the buttons to the values that 
will be used in the program*/
const CALC_CONSTANTS = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  zero: '0',
  decimal: '.',
  divide: '/',
  multiply: '*',
  subtract: '-',
  add: '+',
  clear: 'c',
  backspace: 'backspace',
  equals: '='
}
function handleEquals(expression) {
  /* Evaluates the expression and returns the result. The expression is 
  split into groups by regex and using BODMSA-ish type of calculation, 
  evaluates the expression*/
  const re = /\d+[.0-9]*|(?<=\B)-\d+[.0-9]*|(?<=\B)\+\d+[.0-9]*|\D/g;
  let stack = expression.match(re);         // The expression split into numbers
                                            // and characters
  const BODMAS = ["/", "*", "-", "+"];      // Each of the operators 
                                            // will be tested in this order
  for (let i = 0; i < BODMAS.length; i++) {
    let presentOperator = BODMAS[i];        // The present operator
    
    if (expression.indexOf(presentOperator) >= 0) {
      // Is the operator even in the expression
      for (let j = 1; j < stack.length; j += 2) { // valid expressions have the operators
                                                  // At even positions
        if (stack[j] === presentOperator) {
          /* An operator is found. Get the value before it and after it,
          calculate it applying the operator and replace it in the array.
          */
          let x = stack[j-1];
          let y = stack[j+1];
          const result = calculate(x, y, presentOperator);
          let elementsBeforeX = stack.slice(0, j-1);
          let elementsAfterY = stack.slice(j+2);
          let newStack = [...elementsBeforeX, result, ...elementsAfterY];
          stack = newStack;
          j -= 2;               // So that we don't skip any operator 
                                // after a calculation
        }
      }
    }
  }
  try {
    return stack[0].toString();
  } catch(err) {
    return NaN;
  }
}
function calculate(x, y, operator) {
  x = Number(x);
  y = Number(y);
  switch(operator) {
    case '/':
      return x / y;
    case '*':
      return x * y;
    case '+':
      return x + y;
    case '-':
      return x - y;
    default:
      return -1;
  }
}
export { handleEquals };
export default CALC_CONSTANTS;