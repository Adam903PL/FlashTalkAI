

const path = require("path");


const fs = require('fs');


function getTestData(directory = './test') {
  try {
      const files = fs.readdirSync(directory);
      return files.filter(file => fs.statSync(path.join(directory, file)).isFile());
  } catch (err) {
      console.error(`Error reading directory: ${err}`);
      return [];
  }
}



console.log(getTestData())