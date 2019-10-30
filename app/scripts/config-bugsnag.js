const fs = require('fs');
const inquirer = require('inquirer');

async function init() {
  console.log('**********************************************************');
  console.log('\x1b[1m%s\x1b[0m', 'Crie uma conta: https://www.bugsnag.com/');
  console.log('**********************************************************\n');

  const params = await askParams();

  await replaceIOS(params);
  await replaceScriptIOS(params);
  await replaceAndroid(params);
  await replaceScriptAndroid(params);
}

async function askParams(answers = {}) {
  const params = await inquirer.prompt([{
    name: 'apiKey',
    default: answers.apiKey,
    message: 'Api Key'
  }, {
    name: 'confirmed',
    type: 'confirm',
    message: 'Confirma as configurações?'
  }]);

  if (!params.confirmed) {
    console.log('---- Responda novamente:')
    return askParams(params);
  }

  return params;
}

async function replaceAndroid({ apiKey }) {
  const file = `${__dirname}/../android/app/src/main/res/values/strings.xml`;
  let content = fs.readFileSync(file, 'utf8');

  content = content
    .replace(/(\<string name\=\"bugsnag_appkey\"\>)(?:.+)?(\<\/string\>)/gim, `$1${apiKey}$2`);

  fs.writeFileSync(file, content);
}

async function replaceScriptAndroid({ apiKey }) {
  const file = `${__dirname}/../scripts/release.android.sh`;
  let content = fs.readFileSync(file, 'utf8');

  content = content
    .replace(/(--api-key\ ).+(\ .+)/gim, `$1${apiKey}$2`);

  fs.writeFileSync(file, content);
}

async function replaceIOS({ apiKey }) {
  const file = `${__dirname}/../ios/reactApp/Info.plist`;
  let content = fs.readFileSync(file, 'utf8');

  content = content
    .replace(/(\<key\>BugsnagAPIKey\<\/key\>(?:[\n\t.]+)?\<string\>)(?:.+)?(\<\/string\>)/gim, `$1${apiKey}$2`);

  fs.writeFileSync(file, content);
}

async function replaceScriptIOS({ apiKey }) {
  const file = `${__dirname}/../scripts/upload-sourcemap.ios.sh`;
  let content = fs.readFileSync(file, 'utf8');

  content = content
    .replace(/(--api-key\ ).+(\ .+)/gim, `$1${apiKey}$2`);

  fs.writeFileSync(file, content);
}

module.exports = init;

if (require.main === module) {
  init().then(() => {
    process.exit(0);
  }).catch(err => {
    console.log(err);
    process.exit(-1);
  });
}