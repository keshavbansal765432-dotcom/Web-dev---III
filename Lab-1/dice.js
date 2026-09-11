// Generate random results for a standard six-sided dice.
const crypto = require('crypto');

const rolls = Number(process.argv[2] ?? 1);

if (!Number.isInteger(rolls) || rolls < 1) {
  console.log('Enter a positive whole number of rolls.');
  console.log('Example: node dice.js 4');
  process.exit(1);
}

console.log(`Starting ${rolls} dice roll${rolls === 1 ? '' : 's'}...`);

for (let count = 1; count <= rolls; count += 1) {
  const result = crypto.randomInt(1, 7);
  console.log(`Roll ${count}: ${result}`);
}
