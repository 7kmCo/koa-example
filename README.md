# Koa example/boilerplate

This repository demonstrates the usage of Sequelize within an [Koa](https://koajs.com) application.


## Starting App

First of all, don't forget to edit `/config/config.js`, create database then run:

```
npm install
npm start
```

This will start the application and create an sqlite database in your app dir.
Just open [http://localhost:3000](http://localhost:3000).


#### Sequelize Setup

Now we will install all sequelize related modules.

```bash
# install ORM , CLI and SQLite dialect
npm install --save sequelize sequelize-cli mysql2

# generate models
node_modules/.bin/sequelize init
node_modules/.bin/sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string
```
