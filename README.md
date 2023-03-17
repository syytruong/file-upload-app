# file-upload-app

This is a file upload application built with Vue.js and Express.js. The app allows users to upload files and view a list of uploaded files.

## Build Setup

### Installation
```
1. Clone the repository: git clone https://github.com/your-username/file-upload-app.git
2. Navigate to the server directory: cd file-upload-app
3. Install dependencies: npm install
```
#### Install the Server
```
cd file-upload-app/backend
yarn install
```

#### Install the Client
```
cd file-upload-app/frontend
yarn install
```

#### Running the app
At root depository
```
yarn dev
```
## Structure
## Structure
```
backend/
├── controllers/
├── database/
├── middlewares/
│   ├── errorHandler.js
│   ├── notFound.js
│   ├── index.js
├── models/
├── routes/
│   ├── files.js
│   ├── index.js
├── services/
├── uploads/
├── .eslintrc.js
├── .gitignore
├── app.js
├── package.json
fronend/
├── node_modules/
├── .nuxt/
├── assets/
│   ├── variables.scss
├── components/
│   ├── FileList.vue/
├── layouts/
│   ├── default.vue/
│   ├── error.vue/
├── pages/
│   ├── index.vue/
│   ├── FileUpload.vue/
├── static/
├── store/
│   ├── files/
│   │   ├── actions.js/
│   │   ├── getters.js/
│   │   ├── mutations.js/
│   │   ├── state.js/
├── package.json
├── tsconfig.json
├── nuxt.config.js
node_modules/
package.json/
README.md
```
