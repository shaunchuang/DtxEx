'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 建立 users 表
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      passwordHash: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // 建立 responses 表
    await queryInterface.createTable('responses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      formId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'questionnaires',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      submitTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      lastUpdateTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('DRAFT', 'SUBMITTED', 'COMPLETED'),
        allowNull: false,
        defaultValue: 'DRAFT'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // 建立 answers 表
    await queryInterface.createTable('answers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      responseId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'responses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      questionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      answerText: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      answerDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // 建立 answer_options 表
    await queryInterface.createTable('answer_options', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      answerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'answers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      optionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'question_options',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // 建立索引
    await queryInterface.addIndex('users', ['email'], { unique: true });
    await queryInterface.addIndex('responses', ['formId', 'userId']);
    await queryInterface.addIndex('answers', ['responseId', 'questionId'], { unique: true });
    await queryInterface.addIndex('answer_options', ['answerId', 'optionId'], { unique: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('answer_options');
    await queryInterface.dropTable('answers');
    await queryInterface.dropTable('responses');
    await queryInterface.dropTable('users');
  }
};
