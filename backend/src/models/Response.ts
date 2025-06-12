import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { ResponseAttributes, ResponseStatus } from '../types';

interface ResponseCreationAttributes extends Optional<ResponseAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Response extends Model<ResponseAttributes, ResponseCreationAttributes> implements ResponseAttributes {
  public id!: string;
  public formId!: string;
  public userId!: string;
  public submitTime!: Date;
  public lastUpdateTime?: Date;
  public status!: ResponseStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Response.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    formId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'questionnaires',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    submitTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    lastUpdateTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'COMPLETED'),
      allowNull: false,
      defaultValue: 'DRAFT'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Response',
    tableName: 'responses',
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ['formId', 'userId']
      }
    ]
  }
);

export default Response;
