# Guía de build y distribución — iCitas

Cómo levantar el entorno, generar el development build y el **APK de producción** para instalar en teléfonos sin depender del PC.

> Proyecto Expo SDK 51 (managed con carpeta `android/` ya generada por prebuild).
> Todos los comandos asumen Windows con Git Bash o PowerShell.

## Requisitos (una sola vez)

- **Android Studio** instalado. Trae el JDK (JBR **21**) y el SDK de Android.
- Variables de entorno para compilar (ajusta las rutas si difieren):
  - `JAVA_HOME` = `C:\Program Files\Android\Android Studio\jbr`
  - `ANDROID_HOME` = `C:\Users\<usuario>\AppData\Local\Android\Sdk`
- `adb` está en `%ANDROID_HOME%\platform-tools\adb.exe`.
- Teléfono con **Depuración USB** activada (Opciones de desarrollador). En **Xiaomi/MIUI** además activar **"Instalar vía USB"** (requiere internet/cuenta Mi).

## 1. Desarrollo diario (Metro) — recarga en segundos

Para cambios de **JS / UI / lógica** NO se recompila nada; Metro recarga en caliente.

```bash
npm start
```
Con el teléfono conectado, en otra terminal:
```bash
adb reverse tcp:8081 tcp:8081
```
Luego abre la app (el development build ya instalado). Si el bundler queda en otro puerto o hay basura de caché: `npx expo start -c`.

## 2. Development build (solo al cambiar módulos NATIVOS)

Solo hay que recompilar el APK de desarrollo cuando **agregas/quitas una librería con parte nativa** (ej. `expo-document-picker`, `expo-notifications`, `react-native-webview`, `@react-native-google-signin/google-signin`). Para cambios de JS, **no**.

Con emulador abierto o teléfono conectado:
```bash
npx expo run:android
```
Genera/actualiza `android/`, compila (solo `arm64-v8a` por defecto en dev), instala y arranca conectando a Metro. **Consejo:** agrupa varios nativos y haz **una** sola build, en vez de una por cada librería.

## 3. APK de PRODUCCIÓN (standalone, para repartir)

Genera un APK con el JS empaquetado dentro (Hermes) que corre **sin Metro ni PC**.

```bash
cd android
./gradlew.bat assembleRelease
```
> Universal (todas las arquitecturas, ~70 MB, instala en cualquier teléfono).

**Más rápido y liviano** (solo teléfonos reales; `x86`/`x86_64` son solo emuladores):
```bash
cd android
./gradlew.bat assembleRelease -PreactNativeArchitectures=arm64-v8a,armeabi-v7a
```

**Ruta del APK generado:**
```
android/app/build/outputs/apk/release/app-release.apk
```
Ese archivo se copia y se instala en los teléfonos (WhatsApp, Drive, USB…). En cada equipo hay que permitir **"Instalar apps de fuentes desconocidas"**.

## Firma y llaves (por qué funciona Google Sign-In y el mapa)

- El release está firmado con el **keystore de debug** del proyecto (`android/app/debug.keystore`), configurado en `android/app/build.gradle` (`release { signingConfig signingConfigs.debug }`).
- Su **SHA-1** es:
  `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
- Ese SHA-1 está registrado en **Firebase** (Google Sign-In) y en **Google Cloud** (restricción de la API key de Maps + Places). Por eso el login y el mapa funcionan en cualquier teléfono con este APK, sin registrar nada nuevo.
- Verificar la firma de un APK:
  ```bash
  "%ANDROID_HOME%\build-tools\<version>\apksigner.bat" verify --print-certs app-release.apk
  ```
- **Importante:** mientras se use este mismo keystore, las nuevas versiones se instalan encima sin desinstalar. Para **Play Store** se necesita un keystore de producción propio y registrar su nuevo SHA-1 en Firebase/Google Cloud.

## Optimización de builds

En `android/gradle.properties` ya están activados: `org.gradle.parallel`, `org.gradle.caching`, `org.gradle.daemon`, `configureondemand` y heap de 4 GB. La 1ª build es lenta (~15-25 min compilando C++ de reanimated/screens en varias arquitecturas); las incrementales con daemon caliente bajan a pocos minutos. **No** uses `--clean` salvo que algo esté roto.

## Problemas frecuentes (ya resueltos antes)

- **`Cannot find native module 'ExpoXxx'`** → se agregó una librería nativa nueva; hay que rehacer el development build (paso 2).
- **`Could not read ... ExpoModulesCorePlugin.gradle` / versión rara de `expo-modules-core`** → node_modules quedó inconsistente. `expo-modules-core` debe ser **1.12.26** (la que pide `expo@51`). Reinstalar con `--legacy-peer-deps` si hace falta.
- **`Dimensions.removeEventListener is not a function`** (crash al abrir el mapa) → polyfill viejo de React Navigation v5. Parche en `node_modules/@react-navigation/bottom-tabs/src/utils/useWindowDimensions.tsx` reexportando el hook nativo de RN. Se pierde al reinstalar; conviene formalizar con `patch-package`.
- **`INSTALL_FAILED_USER_RESTRICTED`** (Xiaomi) → activar **"Instalar vía USB"** en Opciones de desarrollador.
- **`INSTALL_FAILED_UPDATE_INCOMPATIBLE`** → ya hay una versión con firma distinta; desinstalar primero.
- **`DEVELOPER_ERROR` / mapa en blanco** → el SHA-1 de la app no coincide con el registrado en Firebase/Google Cloud, o falta habilitar la API. Verificar la firma (arriba) y las credenciales.
