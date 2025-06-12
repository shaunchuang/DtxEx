import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { QuestionOptionAttributes } from '../types';

interface QuestionOptionCreationAttributes extends Optional<QuestionOptionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class QuestionOption extends Model<QuestionOptionAttributes, QuestionOptionCreationAttributes> implements QuestionOptionAttributes {
  public id!: string;
  public questionId!: string;
  public optionText!: string;
  public optionValue?: string;
  public order!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

QuestionOption.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    questionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'questions',
        key: 'id'
      }
    },
    optionText: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    optionValue: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
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
    modelName: 'QuestionOption',
    tableName: 'question_options',
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ['questionId', 'order']
      }
    ]
  }
);

export default QuestionOption;
