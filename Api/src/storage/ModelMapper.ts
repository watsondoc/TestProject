import { Sequelize } from 'sequelize';

class ModelMapper extends Sequelize {
  override define<TInstance = any>(
    modelName: string,
    attributes: any, // struggled to us Sequelize type, need more time to understand how
    options?: any, // same here, I'm considering as a minor issue for now
  ) {
    return super.define<any, unknown>(modelName, attributes, options);
  }
}

// db credentials hardcoded,
// the best approach is to pass via env variables
const modelMapper = new ModelMapper(
  'testproject',
  'root',
  'pwd', {
    host: 'localhost',
    dialect: 'mysql',
})

export = modelMapper;
