# Website template - Firebase, react, SSR and Typescript

Base template for deploying web application on Firebase.
Uses React, Server side rendering for SEO and Typescript.

## Why

I wanted a web template that bundles fast and handles necessary configurations.
Can be an alternative to <https://create-react-app.dev/>.
Promote the use of Firebase Hosting - one click deploy.

## For development

- Install dependencies `npm install`
- Create firebaseConfig.json with Firebase config object for `firebase.initializeApp(firebaseConfig)`
- Create .firebaserc with your project id

Watch client & server  
`npm run dev`  
Serve files with Firebase emulator  
`npm run serve`  

Note: when developing you should run 2 seperate terminals

- First terminal to watch client & server files `npm run dev`
- Second terminal to start firebase emulator `npm run serve`

## Production

Build client & server to dist folder
`npm run build`  
Deploy hosting and function configuration to firebase
`npm run deploy`

## Specifications

### Server-side rendering

Use React `createElement()` with `renderToString()` to transform into html.
Using `functions.https.onRequest` to return the html for SEO.

Handles server-side fetch of firestore or other api - check `useServerFunc` and the `renderApp` function.

### Firebase `__session` cookie

On Firebase, only the __session cookie is permitted to pass through the cloud function.

This template automatically handle the cookie with `fastifyFirebaseCookie` and `useFirebaseCookie`.

### Bundler

Using ebuild bundler with extreme speed and no caching.
The `bundler.js` use chokidar to rebundle changed files and automatically refresh the browser.

### Theming

Modify files inside `src/app/theme` or directly use css modules `styles.module.sass` for specifc components.

- `theme.sass` contains mixin and functions for easy theming.
- `dark.scss` and `light.scss` are default themes (you can always change it or add more).
- the `global` folder is where you create your specific styles for each tag or classes.
- you can still use css modules on components - check `src/pages/home/index.tsx`.
