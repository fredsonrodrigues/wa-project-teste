/* eslint-disable */
const fs = require('fs');
const inquirer = require('inquirer');
const lodash = require('lodash');
const ora = require('ora');
const childProcess = require('child_process');

async function init() {
  const params = await askParams();

  const files = [
    `${__dirname}/docs/INFORMAÇÕES.md`,
    `${__dirname}/android/app/build.gradle`,
    `${__dirname}/android/app/src/main/AndroidManifest.xml`,
    `${__dirname}/android/app/src/main/java/br/com/waproject/app/MainActivity.java`,
    `${__dirname}/android/app/src/main/java/br/com/waproject/app/MainApplication.java`,
    `${__dirname}/android/app/src/main/res/values/strings.xml`,
    `${__dirname}/ios/reactApp.xcodeproj/project.pbxproj`,
    `${__dirname}/ios/reactApp/Info.plist`,
    `${__dirname}/scripts/generate-key.js`,
    `${__dirname}/android/fastlane/Appfile`,
    `${__dirname}/ios/fastlane/Appfile`,
  ];

  for (let f of files) {
    await replaceContent(f, params);
  }

  await runScript(`${__dirname}/scripts/generate-key.js`, [false]);
  await runScript(`${__dirname}/scripts/config-google.js`, [null], 'Deseja configurar o Google/Firebase agora?');
  await runScript(`${__dirname}/scripts/config-facebook.js`, [null], 'Deseja configurar o Facebook?');
  await runScript(`${__dirname}/scripts/config-bugsnag.js`, [null], 'Deseja configurar o Bugsnag?');
}

async function askParams(answers = {}) {
  const params = await inquirer.prompt([{
    name: 'appId',
    default: answers.appId,
    validate: i => i.length >= 3 ? true : 'Pelo menos 3 letras',
    message: 'App Id (ex. br.com.waproject.base)'
  }, {
    name: 'appName',
    default: answers.appName,
    validate: i => i.length >= 3 ? true : 'Pelo menos 3 letras',
    message: 'Nome do app'
  }, {
    name: 'confirmed',
    type: 'confirm',
    message: 'Confirma as configurações?'
  }]);

  if (!params.confirmed) {
    console.log('---- Responda novamente:');
    return askParams(params);
  }

  params.slug = lodash.camelCase(params.appName).toLowerCase();

  return params;
}

async function replaceContent(path, { appId, appName, slug }) {
  let content = fs.readFileSync(path, 'utf8');

  content = content
    .replace(/br\.com\.waproject\.base/gim, appId)
    .replace(/waproject/gm, slug)
    .replace(/Wa\sProject/gim, appName);

  fs.writeFileSync(path, content);
}

async function runScript(script, params, ask) {
  console.log('\n-----------------------------------\n\n');

  if (ask) {
    const { confirmed } = await inquirer.prompt([{
      name: 'confirmed',
      type: 'confirm',
      message: ask
    }]);

    if (!confirmed) return;
  }

  await require(script)(...params);
}

init().then(() => {
  process.exit(0);
}).catch(err => {
  console.log(err);
  process.exit(-1);
});
