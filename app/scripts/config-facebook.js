const fs = require('fs');
const inquirer = require('inquirer');
const ora = require('ora');

async function init() {
  console.log('**********************************************************');
  console.log('Acesse o painel de aplicativos do Facebook: https://developer.facebook.com/');
  console.log('Siga os passos para criar um aplicativo e configuração do login');
  console.log('\x1b[1m%s\x1b[0m', '> Veja as informações necessário no ./docs/INFORMAÇÕES.md');
  console.log('**********************************************************\n');

  const params = await askParams();

  let promise = replaceAndroid(params);
  ora.promise(promise, 'Alterando Android...');
  await promise;

  promise = replaceIOS(params);
  ora.promise(promise, 'Alterando iOS...');
  await promise;
}

async function askParams(answers = {}) {
  const params = await inquirer.prompt([{
    name: 'appId',
    default: answers.appId,
    message: 'Facebook App Id'
  }, {
    name: 'name',
    default: answers.name,
    message: 'Facebook App Name'
  }, {
    name: 'confirmed',
    type: 'confirm',
    message: 'Confirma as configurações?'
  }]);

  if (!params.confirmed) {
    console.log('---- Responda novamente:')
    return askParams(params);
  }

  params.scheme = `fb${params.appId}`;
  return params;
}

async function replaceAndroid({ appId, scheme }) {
  const file = `${__dirname}/../android/app/src/main/res/values/strings.xml`;
  let content = fs.readFileSync(file, 'utf8');

  content = content
    .replace(/(\<string name\=\"facebook_app_id\"\>)(?:.+)?(\<\/string\>)/gim, `$1${appId}$2`)
    .replace(/(\<string name\=\"fb_login_protocol_scheme\"\>)(?:.+)?(\<\/string\>)/gim, `$1${scheme}$2`);

  fs.writeFileSync(file, content);
}

async function replaceIOS({ appId, name, scheme }) {
  const file = `${__dirname}/../ios/reactApp/Info.plist`;
  let content = fs.readFileSync(file, 'utf8');

  content = content
    .replace(/(\<key\>FacebookAppID\<\/key\>(?:[\n\t.]+)?\<string\>)(?:.+)?(\<\/string\>)/gim, `$1${appId}$2`)
    .replace(/(\<key\>FacebookDisplayName\<\/key\>(?:[\n\t.]+)?\<string\>)(?:.+)?(\<\/string\>)/gim, `$1${name}$2`)
    .replace(/(\<key\>CFBundleURLSchemes\<\/key\>(?:[\n\t.]+)?\<array\>(?:[\n\t.]+)?\<string\>)fb\d+(\<\/string\>(?:[\n\t.]+)?\<\/array\>)/gim, `$1${scheme}$2`);

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