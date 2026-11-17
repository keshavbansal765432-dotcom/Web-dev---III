// Check whether a command-line number is even or odd.
const checkEven = require('./modules/isEven');
const writeLog = require('./modules/logger');

const input = process.argv[2];
const value = Number(input);

if (input === undefined || Number.isNaN(value)) {
  console.log('Enter a number to continue.');
  console.log('Example: node app.js 12');
  process.exit(1);
}

writeLog(`Received number: ${value}`);
console.log(checkEven(value) ? `${value} is Even` : `${value} is Odd`);
writeLog('Number check finished.');
