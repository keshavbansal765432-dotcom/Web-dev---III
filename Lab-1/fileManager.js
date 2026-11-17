// Demonstrates basic create, read, update and delete operations with fs.
const fs = require('fs');

const file = 'test.txt';
const firstText = 'Hello from Node.js';
const extraText = '\nPracticing the File System module';

console.log('Creating the file...');

fs.writeFile(file, firstText, (error) => {
  if (error) return console.log('Create error:', error.message);
  console.log('File created.');

  fs.readFile(file, 'utf8', (error, contents) => {
    if (error) return console.log('Read error:', error.message);
    console.log('Initial content:', contents);

    console.log('Adding more content...');
    fs.appendFile(file, extraText, (error) => {
      if (error) return console.log('Update error:', error.message);
      console.log('File updated.');

      fs.readFile(file, 'utf8', (error, newContents) => {
        if (error) return console.log('Second read error:', error.message);
        console.log('New content:', newContents);

        fs.unlink(file, (error) => {
          if (error) return console.log('Delete error:', error.message);
          console.log('File deleted.');
        });
      });
    });
  });
});
