ARQUITETURA
===========

### Scripts do package.json

| Comando         | Descrição                           | Quem usa      |
|-----------------|-------------------------------------|---------------|
| start           | inicia o packager                   | desenvolvedor |
| dev-android     | Builda a apk e inicia o packager    | desenvolvedor |
| dev-ios         | Builda e inicia o packager          | desenvolvedor |
| release-android | Cria a versão de release do android | desenvolvedor |
| release-ios     | Cria a versão de release do iOS     | desenvolvedor |

### Scripts na pasta ./scripts

Utilize os scripts em node na pasta **./scripts** para configurar os serviços:

* change-version.js: altera a versão do app nos arquivos nativos.
* config-bugsnag.js: altera a key do bugsnag.
* config-facebook.js: configura o facebook signin.
* config-google.js: configura o firebase e/ou o google signin.
* generate-key.js: gera uma nova chave para o android.

### Sistema de pastas

* components: componentes do React.
    * Screen: componentes das telas
    * Shared: components genéricos para auxiliar.
        * Abstract: componentes abstratos que servem como base para outros.
* declarations: custom typings para o Typescript.
* decorators: decorators para aplicar os HOC (Higher-Order Components), pois assim não afetarão o typescript.
* errors: classes de erro.
* formatters: funções para formatar dado.
* helpers: funções genéricos que auxiliam na tarefa.
* images: pasta aonde contem as imagens
* interfaces: interfaces gerais.
* providers: funções básicas simplicadas: alert, confirm e etc..
* rxjs-operators: operadores do RxJs criados para o projeto.
* services: responsável pela lógica de negocio e a comunicação com o servidor. 
    * facades: facilitadores de funcionalidades nativas (ex. storage)
* theme: configuração do tema do nativebase e classes genéricas.

---

Se um component precisar de um sub-component este deve ficar na mesma pasta/subpasta do component pai.

```bash
# Estrura de pasta de componens
component1
  - index.tsx
  - subcomponent1.1.tsx
  - subcomponent1.2
    - index.ts
    - subcomponent1.2.1.tsx
component2
```

### Notificações

As notificações devem ter no corpo a estrutura:

```tsx
interface notification { action: string, data: any; userId?: number }
```

Sendo a action a chave de um handler e o data a informação passada para esse handler.  

Se a notificação for para um usuário especifico utilize o campo **userId** para poder verificar se 
o usuário ainda esta logado no app.

Sempre que o usuário abre o app logado, é feita uma requisição no servidor passando a token de notificação,
pois o mesmo pode mudar sem aviso.

### Cache

O operator de cache serve para guardar as  informações para que o app possa ser usado offline.  

Ele verificará se existe o cache e se ele é maior que 5 minutos, ele sempre enviará o cache a adiante e 
atualizará (se necessário) logo em seguida passando adiante novamente o dado atuaizado.

### Boas práticas e pontos a serem observados

* O serviços são responsáveis pela **lógica de negócio, comunicação do servidor e guardar o estado geral**.
* Usar **arrow function para methods dos components** ajudam a melhorar a performance e evita render desnecessários, 
  salvo os de livescycle do react.
* Sempre que utilizar um RxJs Observable, utilize o operator **logError**, caso de um erro ele logará esse erro 
  no bugsnag, **mas ele não tratará o erro**.
* Se utilizar um serviço que retorne um RxJs Observable, utilizar o operator **bindComponent**, ele serve para dar
  unsubscribe quando o component não for mais utilizado (componentWillUnmount)
* Utilize a principio um **PureComponent** para um component pois ele é mais rapido que um **Component**.