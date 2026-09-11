// A simple command-line calculator.

const [action, first, second] = process.argv.slice(2);
const a = Number(first);
const b = Number(second);

const operations = {
  add: (x, y) => x + y,
  subtract: (x, y) => x - y,
  multiply: (x, y) => x * y,
  divide: (x, y) => x / y
};

if (!action || Number.isNaN(a) || Number.isNaN(b)) {
  console.log('Usage: node calculator.js <add|subtract|multiply|divide> <num1> <num2>');
  process.exit(1);
}

const name = action.toLowerCase();

if (!operations[name]) {
  console.log('Unknown operation. Choose add, subtract, multiply or divide.');
  process.exit(1);
}

if (name === 'divide' && b === 0) {
  console.log('Cannot divide by zero.');
  process.exit(1);
}

console.log(`${a} ${name} ${b} = ${operations[name](a, b)}`);
