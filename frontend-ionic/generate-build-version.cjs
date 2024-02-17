/* generate-build-version.js */

var fs = require('fs');

var packageJson = fs.readFileSync('../package.json', 'utf8');

var appVersion = JSON.parse(packageJson).version;

var jsonData = {
  version: appVersion,
};

var jsonContent = JSON.stringify(jsonData);

fs.writeFile('./public/meta.json', jsonContent, 'utf8', function (err) {
  if (err) {
    console.log('An error occured while writing JSON Object to meta.json');
    return console.log(err);
  }

  console.log('meta.json file has been saved with latest version number');
});
