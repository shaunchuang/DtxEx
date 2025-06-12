import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { QuestionnaireAttributes } from '../types';

interface QuestionnaireCreationAttributes extends Optional<QuestionnaireAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Questionnaire extends Model<QuestionnaireAttributes, QuestionnaireCreationAttributes> implements QuestionnaireAttributes {
  public id!: string;
  public title!: string;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Questionnaire.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
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
    modelName: 'Questionnaire',
    tableName: 'questionnaires',
    timestamps: true
  }
);

export default Questionnaire;
