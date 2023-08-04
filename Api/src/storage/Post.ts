import * as Sequelize from 'sequelize';
import modelMapper from './ModelMapper';
import { UserDefinition } from './User';

export const PostDefinition = modelMapper.define('posts', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    validate: {
      notEmpty: true,
    },
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    /*references: {
      model: UserDefinition,
      key: 'id',
    },*/
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  body: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

/*PostDefinition.belongsTo(UserDefinition, { foreignKey: 'id' });
UserDefinition.hasMany(PostDefinition, { foreignKey: 'id' });*/
