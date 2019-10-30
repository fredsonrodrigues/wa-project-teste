PRODUÇÃO
========

Antes de gerar altere as versões no **package.json**:
* version: versão "amigável" (ex. 1.0.2)
* versionBuild: versão sequencial (ex. 203)

Elas serão sincronizadas nos arquivos do apps nativos.  

```bash
yarn release-android # Será criado um App.apk na raiz
yarn release-ios 
```

Junto com o processo de build os sourcemaps serão enviados para o 
**Bugsnag** para ajudar no reconhecimento dos erros.

## Release Manual IOS XCode

Antes de publicar lembre-se de trocar a schema: 
*Product > Schemes > reactAppRelease*