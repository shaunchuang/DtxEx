import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { AnswerOptionAttributes } from '../types';

interface AnswerOptionCreationAttributes extends Optional<AnswerOptionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class AnswerOption extends Model<AnswerOptionAttributes, AnswerOptionCreationAttributes> implements AnswerOptionAttributes {
  public id!: string;
  public answerId!: string;
  public optionId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AnswerOption.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    answerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'answers',
        key: 'id'
      }
    },
    optionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'question_options',
        key: 'id'
      }
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
    modelName: 'AnswerOption',
    tableName: 'answer_options',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['answerId', 'optionId']
      }
    ]
  }
);

export default AnswerOption;
