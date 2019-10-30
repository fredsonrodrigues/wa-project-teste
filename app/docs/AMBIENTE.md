AMBIENTE
========

Android
-------

* Instalar ORACLE JAVA SDK
* Criar a variável JAVA_HOME no .bashrc
* Download Android Studio
* Criar a variável ANDROID_HOME no .bashrc
* Abir o SDK manager no Android Studio (marcar *Show Packages Details*):
  * Android SDK (API 29)
    * SDK Platform 29
    * Google APIs 29
  * Android SDK Tools
  * Android SDK Platform-Tools
  * Android SDK Build-Tools
  * Android Support Repository
  * Google Play services
  * Google Repository

IOS
---

* Instalar o XCode
* Instalar o [Cocoapods](https://guides.cocoapods.org/using/getting-started.html)
* Instalar dependencias nativas:
```bash
(cd ./ios && pod install)
```

Sempre abra o *ios/reactApp.xcworkspace* e não o reactApp.xcodeproj por causa das depedencias do pod