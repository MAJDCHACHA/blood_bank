import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import { fileURLToPath, pathToFileURL } from 'url';
import configData from './config.json' assert { type: 'json' };
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configData[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Dynamically import models
const modelFiles = fs
  .readdirSync(path.join(__dirname, '../models'))
  .filter(file => file.indexOf('.') !== 0 && file.slice(-3) === '.js');

for (const file of modelFiles) {
  const fileUrl = pathToFileURL(path.join(__dirname, '../models', file));
  const model = await import(fileUrl.href);

  const modelInstance = model.default
    ? model.default(sequelize, Sequelize.DataTypes)
    : model[Object.keys(model)[0]](sequelize, Sequelize.DataTypes);

  db[modelInstance.name] = modelInstance;
}

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
