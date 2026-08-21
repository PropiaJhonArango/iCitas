# CLAUDE.md

Guía para trabajar en este repositorio. La UI, los comentarios y los mensajes al usuario están en español; mantén ese idioma al escribir código y textos visibles.

## Qué es iCitas

App móvil (Android/iOS) para **gestionar citas médicas**. Un usuario registra sus citas y las de su "grupo social" (familiares/pacientes a su cargo), con fecha/hora, dirección + ubicación en mapa, médico, etiquetas, notas e imágenes adjuntas (ej. órdenes, resultados). Las citas se dividen en próximas ("Citas") e históricas/vencidas ("Historia").

**No es una app Android nativa** — es **React Native + Expo** (JavaScript, sin TypeScript). El `package` Android/iOS es `com.jhonarangotoro.icitas`.

## Stack

- **Expo SDK 51**, React Native 0.74, React 18.
- **React Navigation v5** (stack + bottom-tabs).
- **Firebase v10 (modular / v9+ API)**: Auth (email/password), Firestore, Storage.
- **react-native-elements** para UI (Input, Button, Icon, Avatar). Iconos: `font-awesome`.
- **react-native-maps** (Google Maps) + **expo-location** para ubicación de la cita.
- **expo-image-picker** (elegir imágenes), **expo-media-library** + **expo-file-system** (descargar imagen a galería), **react-native-image-zoom-viewer** (visor con zoom).
- **react-native-multiple-select** (pacientes y etiquetas), **react-native-modal-datetime-picker**, **moment** (fechas), **lodash**, **random-uuid-v4**.

## Comandos

```bash
npm install
```
```bash
npm start        # expo start (Metro bundler + QR)
```
```bash
npm run android  # expo start --android
```
```bash
npm run ios      # expo start --ios
```

No hay tests, linter ni build script configurados. `expo start` es el flujo de desarrollo principal.

## Arquitectura y flujo

**Punto de entrada:** `node_modules/expo/AppEntry.js` → [App.js](App.js). `App.js` decide entre dos árboles de navegación según `getCurrentUser()`:
- **No autenticado** → [navigations/RootStack.js](navigations/RootStack.js): `userGuest` (invitado), `login`, `register`.
- **Autenticado** → [navigations/Navigation.js](navigations/Navigation.js): bottom-tabs con cinco stacks.

> Nota: el gate de sesión en `App.js` es frágil — `getCurrentUser()` se llama una vez en `useEffect` y `auth.currentUser` puede ser `null` justo al arrancar (Firebase resuelve la sesión de forma asíncrona). El login funciona porque `setLogged` se pasa a las pantallas y se llama manualmente.

**Tabs (autenticado):** cada tab es un stack propio.

| Tab (título) | Stack | Pantallas |
|---|---|---|
| Ajustes | [SettingsAccountStack.js](navigations/SettingsAccountStack.js) | SettingsAccount, TagsAccount, AddTags, TagAccount |
| Historia | [HistoryAppointmentsStack.js](navigations/HistoryAppointmentsStack.js) | HistoryAppointments |
| Citas (inicial) | [AppointmentsStack.js](navigations/AppointmentsStack.js) | Appointments, AddAppointment, Appointment |
| Social | [SocialStack.js](navigations/SocialStack.js) | Social, AddSocial, MemberDetails |
| Perfil | [ProfileStack.js](navigations/ProfileStack.js) | Profile |

**Estructura de carpetas:**
- `screens/` — pantallas por dominio (`appointments/`, `social/`, `accountSettings/`, `profile/`) + `HistoryAppointments.js`.
- `components/` — componentes reutilizables (`Loading.js`, `Modal.js`) y formularios por dominio (`appointments/AddAppointmentForm.js`, `social/AddSocialForm.js`, `tags/AddTagsForm.js`, `profile/{Login,Register,DisplayDataForm}.js`).
- `navigations/` — configuración de React Navigation.
- `utils/` — toda la lógica de backend y utilidades (ver abajo).
- `assets/` — logos e imágenes (splash, iconos).

## Capa de datos (`utils/`)

Toda la interacción con Firebase pasa por [utils/actions.js](utils/actions.js). Es la capa de acceso a datos del proyecto.

- [utils/firebase.js](utils/firebase.js) — inicializa Firebase y exporta `auth`, `firestore`, `storage`.
- [utils/actions.js](utils/actions.js) — auth (`registerUser`, `loginWithEmailAndPassword`, `closeSession`, `getCurrentUser`), CRUD genérico de Firestore (`addDocumentWithId`, `addDocumentWithoutId`, `updateDocument`, `getCollectionWithId`, `deleteDocument`), consultas específicas (`getAppointments`, `getAppointmentsExpired`, `getSocialGroup`, `getAllSocialGroup`, `getTags`, `getAllTags`), subida de imágenes (`uploadImage`) y actualización de perfil/email/password.
- [utils/helpers.js](utils/helpers.js) — lista de países con código telefónico (`countryList`, `getCountryCode`), `validateEmail`, selección de imágenes de galería (`loadImageFromGallery`, `loadImageFromGalleryWithoutEditing`), ubicación (`getCurrentLocation`), `fileToBlob`, `formatDate`.

**Convención de resultados:** casi todas las funciones de `actions.js` devuelven un objeto `{ statusResponse: boolean, error, ...datos }` en lugar de lanzar excepciones. Sigue este patrón al añadir funciones nuevas y revisa `statusResponse` en el llamador.

### Colecciones Firestore

- **`Users`** — doc id = `uid` del usuario. Creado en el registro. Campos: datos de perfil + `createdDate`, `uidUser`.
- **`Appointments`** — id autogenerado. Campos: `name`, `dateAndTime` (Timestamp), `address`, `location` ({latitude, longitude, latitudeDelta, longitudeDelta} | null), `idPatient`, `namePatient`, `doctor`, `idTags`, `notes`, `images` (array de URLs de Storage), `createAt`, `idCreator` (= uid del dueño). Se filtran por `idCreator` y `dateAndTime` (≥ hoy = próximas, < hoy = vencidas).
- **`SocialGroup`** — id autogenerado. Integrantes/pacientes del usuario. Campos: `nameMember`, `idMainUser` (uid dueño), `idMemberUser` (uuid), `createdDate` (+ imagen/otros datos del integrante).
- **`UserTags`** — id autogenerado. Etiquetas. Campos: `tagName`, `ownerId` (uid dueño), `createdDate`.

Imágenes en **Storage** bajo la ruta `appointmentsImages/{uuid}`.

## Convenciones y patrones

- Componentes funcionales con hooks. Estado de formularios con `useState(defaultFormValues())` y un `onChange(e, type)` que hace spread. Recarga de datos con `useFocusEffect`/`useCallback`.
- Loading global con el componente `Loading` (overlay) y feedback con `react-native-easy-toast` (`toasRef.current.show(msg, 3000)`).
- Paleta de marca: azul `#047ca4`, rojo/acento `#f4544c`, verde OK `#22af1b`, gris inactivo `#c2c2c2` / `#8D99A3`. Headers de stack: fondo azul con esquinas inferiores redondeadas (40).
- Manejo de imágenes en edición (`Appointment.js`): las URLs ya subidas empiezan por `https://firebasestorage`; las nuevas locales por `file:/`. Al guardar se suben solo las locales y se combinan con las existentes.

## Cosas que saber / trampas

- **Secretos hardcodeados en el código fuente:** la config de Firebase (`utils/firebase.js`), la API key de Google Maps (`app.json`) y `keys.txt` están versionados en texto plano. No introduzcas más secretos así; ten cuidado al compartir el repo.
- **Código legado comentado:** `utils/actions.js` tiene cientos de líneas comentadas (dos migraciones anteriores de la API de Firebase). `CodigoAnterior.js` en la raíz es una copia vieja de `actions.js`. No son código activo.
- **Funciones rotas / a medio migrar:** `getMoreAppointments`, `getMoreAppointmentsExpired`, `getMoreSocialGroup`, `getMoreTags` todavía usan la sintaxis vieja encadenada (`db.collection(...).orderBy(...)`) o referencian un `db` inexistente — no funcionan con la API modular actual. La paginación "cargar más" no está operativa; revísalas antes de usarlas.
- **`LogBox.ignoreAllLogs(true)`** está activo en varios sitios: los warnings de RN quedan ocultos. Al depurar, coméntalo temporalmente.
- Rama actual `feature-visor-imagenes`: visor de imágenes con zoom + descarga a galería en `screens/appointments/Appointment.js` (`ImageViewer`, `saveImageToGallery`).

## Idioma

Escribe UI, comentarios, textos de commit y mensajes al usuario en **español**, igual que el resto del proyecto.
