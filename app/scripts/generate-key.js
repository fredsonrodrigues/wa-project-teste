const childProcess = require('child_process');
const fs = require('fs');
const inquirer = require('inquirer');

const keystorePath = __dirname + "/../android/keystores/release.keystore";
const keyAlias = 'waproject';

async function init(askCheckFile = true) {
    if (!await checkCurrentFile(askCheckFile)) return;

    const password = await generateKey();
    await replaceGradle(password);
    await replaceAppInformation(password);

    console.log('\n***************************************');
    console.log('\x1b[32m%s\x1b[0m', 'Chave criada com sucesso!');
    console.log('\x1b[32m%s\x1b[0m', `Veja as informações em: ../docs/INFORMAÇÕES.md`);
}

async function checkCurrentFile(askCheckFile) {
    if (!fs.existsSync(keystorePath)) return true;

    if (askCheckFile) {
        const { confirm } = await inquirer.prompt({
            name: 'confirm',
            message: 'Já existe uma chave criado, deseja sobrescrever?',
            default: false,
            type: 'confirm'
        });

        if (!confirm) return false;
    }

    fs.unlinkSync(keystorePath);
    return true;
}

async function generateKey() {
    console.log('\n***************************************');
    console.log('Iniciando script de geração de chaves')
    console.log('\x1b[1m%s\x1b[0m', 'Logo após precisaremos da senha criada')
    console.log('****************************************\n');

    await new Promise((resolve, reject) => {
        const keytool = childProcess.spawn(
            "keytool",
            ["-genkey", "-v", "-keystore", keystorePath, "-alias", keyAlias, "-keyalg", "RSA", "-keysize", "2048", "-validity", "10000"],
            { stdio: 'inherit' }
        );

        keytool.once('error', err => reject(err));
        keytool.once('close', () => resolve());
    });

    console.log('\n****************************************\n');

    const { password } = await inquirer.prompt({
        name: 'password',
        message: 'Senha criado',
        type: 'password'
    });

    return password;
}

async function replaceGradle(password) {
    const file = `${__dirname}/../android/app/build.gradle`;
    let content = fs.readFileSync(file, 'utf8');

    content = content
        .replace(/keyPassword\s\".+\"/gim, `keyPassword "${password}"`)
        .replace(/storePassword\s\".+\"/gim, `storePassword "${password}"`);

    fs.writeFileSync(file, content);
}

async function replaceAppInformation(password) {
    const file = `${__dirname}/../docs/INFORMAÇÕES.md`;
    const sha1 = await getSha1(password);
    const sha1Base64 = await getSha1Base64('123mudar');

    let content = fs.readFileSync(file, 'utf8');

    content = content
        .replace(/\*\*Password:\*\*\s.+/gim, `**Password:** ${password}  `)
        .replace(/\*\*Store\sPassword:\*\*\s.+/gim, `**Store Password:** ${password}  `)
        .replace(/\*\*Sha1:\*\*\s.+/gim, `**Sha1:** ${sha1}  `)
        .replace(/\*\*Sha1 Base64 \(Facebook\):\*\*\s.+/gim, `**Sha1 Base64 (Facebook):** ${sha1Base64}  `);

    fs.writeFileSync(file, content);
}

async function getSha1(password) {
    const buffer = childProcess.execSync(`keytool -list -v -keystore ${keystorePath} -alias ${keyAlias} -storepass ${password} -keypass ${password} | grep SHA1`);
    return buffer.toString().trim().replace('SHA1: ', '');
}

async function getSha1Base64(password) {
    const buffer = childProcess.execSync(`keytool -exportcert -alias ${keyAlias} -keystore ${keystorePath} -storepass ${password} | openssl sha1 -binary | openssl base64`);
    return buffer.toString().trim();
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