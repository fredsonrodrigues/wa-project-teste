WaProject Api Base
==================

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/f109c9a8c09dd5e648dd)

Utilize o VSCode, já está configurado com sugestão de extensões e debug.

### Tecnologias

* Node
* Typescript
* Docker
* Express (Http Api)
* Objection (ORM) / Knex (Query builder e migrations)
* Mailgun (envio de email)
* JWT (tokens)
* Bcrypt (criptografia para senhas)
* Raven (log de erros do sentry.io)
* Joi (validação api)
* Mocha/Chai (teste unitários)
* Pug (templates de email)
* Nodemon (dev watcher)
* PM2 (Gerenciado do ambiente de produção)

### Iniciando um novo projeto

```bash
git clone git@bitbucket.org:waprojectbase/waproject-base-api.git
yarn install # ou npm install

node ./init.js
```

### Para mais informações veja a pasta ./docs