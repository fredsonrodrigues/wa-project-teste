const fs = require('fs');
const inquirer = require('inquirer');
const ora = require('ora');

async function init() {
  console.log('**********************************************************');
  console.log('\x1b[1m%s\x1b[0m', '> Veja as informações necessárias no ./docs/INFORMAÇÕES.md');
  console.log('**********************************************************\n');

  const firebase = await inquirer.prompt({
    name: 'config',
    message: 'Deseja configurar o Firebase para notificações?',
    type: 'confirm'
  });

  if (firebase.config) {
    await configFirebase();
  }

  console.log('\n');

  const signin = await inquirer.prompt({
    name: 'config',
    message: 'Deseja configurar o GoogleSignIn para login?',
    type: 'confirm'
  });

  if (signin.config) {
    await configSignIn();
  }

}

async function configFirebase() {
  console.log('\n**********************************************************');
  console.log('Acesse o painel do Firebase: https://firebase.google.com/');
  console.log('Siga os passos para criar um aplicativo e configuração de aplicativos');
  console.log('Baixe os arquivos google-services.json e GoogleService-Info.plist');
  console.log('**********************************************************\n');

  const params = await askParamsFirebase();

  const androidPath = `${__dirname}/../android/app/google-services.json`;
  fs.existsSync(androidPath) && fs.unlinkSync(androidPath);
  fs.renameSync(params.androidConfig, androidPath);

  const iosPath = `${__dirname}/../ios/reactApp/GoogleService-Info.plist`;
  fs.existsSync(iosPath) && fs.unlinkSync(iosPath);
  fs.renameSync(params.iosConfig, iosPath);
}

async function askParamsFirebase(answers = {}) {
  const params = await inquirer.prompt([{
    name: 'androidConfig',
    default: answers.androidConfig,
    message: 'Caminho do google-services.json (Android)',
    validate: v => fs.existsSync(v) ? true : 'Arquivo não existe'
  }, {
    name: 'iosConfig',
    default: answers.iosConfig,
    message: 'Caminho do GoogleService-Info.plist (iOS)',
    validate: v => fs.existsSync(v) ? true : 'Arquivo não existe'
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

async function configSignIn() {
  console.log('\n**********************************************************');
  console.log('Acesse o painel do Google API: https://console.developers.google.com/apis/credentials');
  console.log('Crie as credencias (IDs do cliente OAuth 2.0) para web, ios e android caso não existam');
  console.log('**********************************************************\n');

  const params = await askParamsSignIn();

  await replaceSettings(params);
  await replaceIOS(params);
}

async function askParamsSignIn(answers = {}) {
  const params = await inquirer.prompt([{
    name: 'webClientId',
    default: answers.webClientId,
    message: 'WebClientId'
  }, {
    name: 'iosClientId',
    default: answers.iosClientId,
    message: 'iOSClientId',
  }, {
    name: 'reverseClientId',
    default: answers.reverseClientId,
    message: 'Reverse Client Id (Veja no ./ios/reactApp/GoogleService-Info.plist)'
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

async function replaceSettings({ iosClientId, webClientId }) {
  const file = `${__dirname}/../src/settings.tsx`;
  let content = fs.readFileSync(file, 'utf8');

  content = content
    .replace(/(iosClientId:(?:\s)?)(?:[\'\"])?(?:.+)?(?:[\'\"])?(.+)/gim, `$1'${iosClientId}'$2`)
    .replace(/(webClientId:(?:\s)?)(?:[\'\"])?(?:.+)?(?:[\'\"])?(.+)?/gim, `$1'${webClientId}'$2`);

  fs.writeFileSync(file, content);
}

async function replaceIOS({ reverseClientId }) {
  const file = `${__dirname}/../ios/reactApp/Info.plist`;
  let content = fs.readFileSync(file, 'utf8');

  content = content
    .replace(/(\<string\>)com\.googleusercontent\.apps\..*(\<\/string\>)/gim, `$1${reverseClientId}$2`)

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
