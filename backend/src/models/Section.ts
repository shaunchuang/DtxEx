import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { SectionAttributes } from '../types';

interface SectionCreationAttributes extends Optional<SectionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Section extends Model<SectionAttributes, SectionCreationAttributes> implements SectionAttributes {
  public id!: string;
  public formId!: string;
  public title?: string;
  public description?: string;
  public order!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Section.init(
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
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
    modelName: 'Section',
    tableName: 'sections',
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ['formId', 'order']
      }
    ]
  }
);

export default Section;
