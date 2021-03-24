### Website template - Firebase, react, SSR and Typescript
Base template for deploying web application on Firebase.
Uses React, Server side rendering for SEO and Typescript.

#### For development

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

#### Production

Build client & server to dist folder  
`npm run build`  
Deploy hosting and function configuration to firebase  
`npm run deploy`
