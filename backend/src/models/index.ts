import Questionnaire from './Questionnaire';
import Section from './Section';
import Question from './Question';
import QuestionOption from './QuestionOption';
import User from './User';
import Response from './Response';
import Answer from './Answer';
import AnswerOption from './AnswerOption';

// 定義模型關聯
// Questionnaire -> Section (一對多)
Questionnaire.hasMany(Section, {
  foreignKey: 'formId',
  as: 'sections'
});
Section.belongsTo(Questionnaire, {
  foreignKey: 'formId',
  as: 'questionnaire'
});

// Section -> Question (一對多)
Section.hasMany(Question, {
  foreignKey: 'sectionId',
  as: 'questions'
});
Question.belongsTo(Section, {
  foreignKey: 'sectionId',
  as: 'section'
});

// Question -> QuestionOption (一對多)
Question.hasMany(QuestionOption, {
  foreignKey: 'questionId',
  as: 'options'
});
QuestionOption.belongsTo(Question, {
  foreignKey: 'questionId',
  as: 'question'
});

// User -> Response (一對多)
User.hasMany(Response, {
  foreignKey: 'userId',
  as: 'responses'
});
Response.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Questionnaire -> Response (一對多)
Questionnaire.hasMany(Response, {
  foreignKey: 'formId',
  as: 'responses'
});
Response.belongsTo(Questionnaire, {
  foreignKey: 'formId',
  as: 'questionnaire'
});

// Response -> Answer (一對多)
Response.hasMany(Answer, {
  foreignKey: 'responseId',
  as: 'answers'
});
Answer.belongsTo(Response, {
  foreignKey: 'responseId',
  as: 'response'
});

// Question -> Answer (一對多)
Question.hasMany(Answer, {
  foreignKey: 'questionId',
  as: 'answers'
});
Answer.belongsTo(Question, {
  foreignKey: 'questionId',
  as: 'question'
});

// Answer -> AnswerOption (一對多)
Answer.hasMany(AnswerOption, {
  foreignKey: 'answerId',
  as: 'selectedOptions'
});
AnswerOption.belongsTo(Answer, {
  foreignKey: 'answerId',
  as: 'answer'
});

// QuestionOption -> AnswerOption (一對多)
QuestionOption.hasMany(AnswerOption, {
  foreignKey: 'optionId',
  as: 'answerOptions'
});
AnswerOption.belongsTo(QuestionOption, {
  foreignKey: 'optionId',
  as: 'option'
});

export {
  Questionnaire,
  Section,
  Question,
  QuestionOption,
  User,
  Response,
  Answer,
  AnswerOption
};
