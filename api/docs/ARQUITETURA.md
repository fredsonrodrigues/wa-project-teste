ARQUITETURA
===========

### Environments Docker

| ENV               | Obrigatório | Valor Padrão |
|-------------------|-------------|--------------|
| NODE_ENV          | false       | production   |
| NODE_PORT         | false       | 3000         |
| DNS               | true        |              |
| SENTRY_KEY        | false       |              |
| MAILGUN_FROM      | false       |              |
| MAILGUN_APIKEY    | false       |              |
| MAILGUN_DOMAIN    | false       |              |
| DATABASE_HOST     | true        |              |
| DATABASE_PORT     | true        |              |
| DATABASE_DB       | true        |              |
| DATABASE_USER     | true        |              |
| DATABASE_PASSWORD | true        |              |

### Scripts do package.json

| Comando                               | Descrição                                        | Quem usa                              |
|---------------------------------------|--------------------------------------------------|---------------------------------------|
| dev                                   | inicia o nodemon                                 | Docker (dev)                          |
| compile                               | gera os arquivos transpilados                    | Docker / script pretest               |
| compile:[templates/server/migrations] | gera os arquivos transpilados por tipo           | script compile                        |
| watch:[templates/server]              | monitora os arquivos e transpila                 | script dev                            |
| pretest/test                          | roda os testes unitários                         | Docker / desenvolvedor                |
| pretest:watch/test:watch              | rodas os teste em modo watch para auxiliar o dev | desenvolvedor                         |
| docker:release                        | build e da push na nova imagem do docker         | devensolvedor                         |
| docker:build                          | build a nova imagem do docker                    | script docker:release / devensolvedor |
| docker:push                           | dá push na nova imagem do docker                 | script docker:release / devensolvedor |

### Sistema de pastas

* Migrations: scripts para gerar o banco, rodam apenas uma vez
    * Seed: 
      scripts para alimentar o banco, rodam todas vezes por isso é 
      preciso verificar se já existe dado ou não
* Server: source da api
    * declarations: custom typings para o Typescript.
    * errors: classes de erro.
    * interfaces: interfaces gerais
    * middlewares: middlewares do express, usados de uma maneira geral no projeto
    * models: entidades do banco de dados
    * modules: modulos do sistema
    * [admin/content]
        * middlewares: middlewares do express especificos do modulo
        * repositories: camada responsável por acesso ao banco, nenhum lógica de negocio.
        * routes: endpoint com as routes do enpoint especificas do modulo
        * services: camada responsável pela lógica de nogocio.
        * validator: validadores especificas do modulo.
    * services: serviços gerais do projeto
    * validators: configuração e validadores gerais do projeto

### Premissas e Responsábilidades

* Serviços:
    * São responsáveis pelo negócio.
    * Devem ser ter teste unitários
    * Podem utilizar outros serviços
    * Devem ter uma única responsábilidade, focada em um segmento (ex. user) ou funcionalidade (ex. auth)
    * Utilizam os repositórios para acessar os dados do banco.
    * Recebem o dado completo e validado.
    * Se algum requisito não for suprido lance um ServiceError com os detalhes, pois isso é culpa de quem o utiliza
* Repositórios:
    * São responsáveis pelo acesso ao banco
    * Não devem conter lógica de negócio apenas lógica de banco.
    * Recebem uma transaction para manter o escopo de quem o utiliza.
    * Devem ter uma única responsábilidade, focada em uma tabela (ex. user) ou funcionalidade (ex. auth)
    * Um repositório não devem chamar outro.
* Rotas (Controllers):
    * Definem quem pode acessar atráves das roles/middlewares
    * Devem validar o dado para passar para os serviços
    * Não devem conter lógica de negócio
    * Podem acessar diretamente os serviços para efetuar alguma alteração ou os respositorios para leitura.
    * Não deve tratar erros genéricos, apenas erros especificos e esperados, os genéricos devem ser passados para o próximo handle de erros (via next function)
    * Podem formatar os dados antes de retornar.
* Validadores:
    * Faça teste unitários, pois caso ele mude evita que quebre alguem que o esta utizando.
    * Podem retornar um interface de uma model ou uma interface própria.
* Módulos:
    * Focados em uma área do projeto (admin, app, public e etc...)
    * Tem seus próprios serviços, repositorios, routes, formatters e etc...
    * Não devem utilizar nada de outro modulo, se preciso, crei o serviço na pasta services da raiz.
    * Pode até ter um estilo de autenticação e verificação diferente.

### Boas práticas e pontos a serem observados

* Toda **model** tem sua interface pois o route pode receber uma model completa mas ela não terá o comportamento e funções da mesma.
* Os repositórios retornam a model e não a interface.
* Coloque os **ENVIRONMENTS** no settings.ts, coloque seu valor default se tiver.
* Nas routes sempre coloque um **try ... catch** com next(err) sendo chamada no catch.
* As models de banco podem conter alguma **lógica simples de comportamento**. (ex: user.checkPassword).
* Sempre trabalhe com **async await (promisses)**, evite callback.
* Mantenhas os **arquivos pequenos e focados** em uma funcionaldade.
* Nomei as funções corretamente, **evite comentários desnecessários**.
* Evite ao máximo o **any** do Typescript pois isso tira a verificação dele.
* Use **interfaces** para definir objectos e parametros complexos. 
* Não coloque números ou strings direto no código, use **Enums**.
* Se algum **typing de um package estiver incorreto/incompleto**, utilize a pasta declarations para arrumar.
