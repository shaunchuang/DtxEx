import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { AnswerAttributes } from '../types';

interface AnswerCreationAttributes extends Optional<AnswerAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Answer extends Model<AnswerAttributes, AnswerCreationAttributes> implements AnswerAttributes {
  public id!: string;
  public responseId!: string;
  public questionId!: string;
  public answerText?: string;
  public answerDate?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Answer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    responseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'responses',
        key: 'id'
      }
    },
    questionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'questions',
        key: 'id'
      }
    },
    answerText: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    answerDate: {
      type: DataTypes.DATE,
      allowNull: true
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
    modelName: 'Answer',
    tableName: 'answers',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['responseId', 'questionId']
      }
    ]
  }
);

export default Answer;
