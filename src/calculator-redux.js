import Redux from 'redux';

function applyOperator(x, y, operator) {
  switch(operator){
    case '/':
      return x / y;
      break;
    case '*':
      return x * y;
      break;
    case '+':
      return x + y;
      break;
    case '-':
      return x - y;
      break;
    default:
      return;
  }
}
const EVALUATE_EXPRESSION = 'EVALUATE_EXPRESSION';
const CLEAR = 'CLEAR';

const evaluateExpression = (expression) => {
  // Expecting the string to either increase or decrease
  // Increase when a character is typed
  // Reduces when a character is deleted.
  return {
    type: EVALUATE_EXPRESSION,
    expression
  }
};

const clear = () => {
  return {
    type: CLEAR
  }
}

const calculate = () => ({
    type: CALCULATE
});

const DEFAULT_STATE = {
  result: 0,
  stack: ""
}

// 2+8-3*4/2 = 4 (bodmas)
// 2+4-3*-4 = 18
// [2, "+"
// const re = /\d+|(?<=\D)-\d+|(?<=\B)-\d+|\D/g;
// const re = /\d+|(?<=\B)-\d+|\D/g;
// const re = /\d+[.0-9]*|(?<=\B)-\d+[.0-9]*|\D/g
function calculatorReducer(state = DEFAULT_STATE, action) {
  switch(action.type) {
    case ADD_TO_STACK:
      
  }
}

const store = Redux.createStore(calculatorReducer);

