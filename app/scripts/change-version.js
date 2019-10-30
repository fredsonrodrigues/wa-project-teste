/* eslint-disable */

let { version, versionBuild } = require(`${__dirname}/../package.json`);
const inquirer = require('inquirer');
const fs = require('fs');

async function init(ask = true) {
  console.log('%s\x1b[32m%s\x1b[0m', '\nNew Version: ', `v${version}(${versionBuild})`);

  if (ask) {
    const { confirmed } = await inquirer.prompt([{
      name: 'confirmed',
      type: 'confirm',
      message: 'Esse é a versão que deseja?'
    }]);

    if (!confirmed) {
      console.log('\x1b[41m%s\x1b[0m', 'Altere a versão no packge.json e depois tente novamente');
      return false;
    }
  }

  const files = [
    `${__dirname}/../package.json`,
    `${__dirname}/../android/app/build.gradle`,
    `${__dirname}/../android/app/src/main/AndroidManifest.xml`,
    `${__dirname}/../ios/reactApp/Info.plist`
  ];

  for (let f of files) {
    await replaceContent(f);
  }

  console.log('\x1b[32m%s\x1b[0m', 'Alterado com sucesso');
  return true;
}

async function replaceContent(path) {
  let content = fs.readFileSync(path, 'utf8');

  content = content
    .replace(/(versionCode(?:[\s\=\"]+)?)\d+/gim, `$1${versionBuild}`)
    .replace(/(versionName(?:[\s\=\"]+)?)[\d\.]+/gim, `$1${version}`)
    .replace(/(\"version\":\s?\")[\d\.]+(\")/gim, `$1${version}$2`)
    .replace(/(\"versionBuild\":\s?)[\d\.]+/gim, `$1${versionBuild}`)
    .replace(/(\<key\>CFBundleShortVersionString\<\/key\>(?:[\n\t.]+)?\<string\>)(?:.+)?(\<\/string\>)/gim, `$1${version}$2`)
    .replace(/(\<key\>CFBundleVersion\<\/key\>(?:[\n\t.]+)?\<string\>)(?:.+)?(\<\/string\>)/gim, `$1${versionBuild}$2`);

  fs.writeFileSync(path, content);
}

module.exports = init;

if (require.main === module) {
  const args = process.argv.slice(2);
  const force = !args.some(a => `${a}`.trim() === '-f');
  const buildVersion = args.find(a => !isNaN(Number(a)));

  if (buildVersion) {
    versionBuild = buildVersion;
    version = version.toString().replace(/([0-9]+)$/gi, buildVersion)
  }

  init(force).then(success => {
    process.exit(success ? 0 : -1);
  }).catch(err => {
    console.log(err);
    process.exit(-1);
  });
}