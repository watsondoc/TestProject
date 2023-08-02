import * as Sequelize from 'sequelize';
import modelMapper from './ModelMapper';

export const UserDefinition = modelMapper.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    validate: {
      notEmpty: true,
    },
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  website: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  address: Sequelize.JSON,
}, {
  timestamps: false,
});

