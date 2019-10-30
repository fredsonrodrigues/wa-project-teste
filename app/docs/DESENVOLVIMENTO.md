DESENVOLVIMENTO
===============

## Gerador de Icone e Splashcreen 

IOS: https://www.appicon.build/  
Android: Utilizar o android studio para gerar os icones

## Comprimir images

Para diminuir o tamanho do app o idela é sempre comprimir as images utilizadas

http://tinypng.com/

```bash
npm install -g node-tinypng
tinypng -r -k [yourkey] **/*
```

Local das imagens:
* ./android/app/src/main/res
* ./ios/reactApp/Images.xcassets
* ./src/images

## NativeBase 

Framework com os componentes base da aplicação:
https://docs.nativebase.io/Components.html

## Rodando

```bash
yarn start # Inicia o packager manualmente 

# IOS
yarn dev-ios # Builda e inicia o packager

# Android
yarn dev-android # Builda a apk e inicia o packager

adb reverse tcp:8081 tcp:8081 # apenas se perder a conexão do adb
```

### XCode

As vezes é necessário abrir no xcode para poder fazer alguma configuração
Abra sempre o **ios/reactApp.xcworkspace**

## Erros comuns

ENOSPC ERROR
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```