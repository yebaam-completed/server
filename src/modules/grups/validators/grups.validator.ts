import Joi, { ObjectSchema } from 'joi';

const grupsSchema: ObjectSchema = Joi.object().keys({
  content: Joi.string().required().messages({
    'any.required': 'Content is a required field',
    'string.empty': 'Content property is not allowed to be empty'
  }),
  imgVersion: Joi.string().optional().allow(null, ''),
  imgId: Joi.string().optional().allow(null, ''),

});



export { grupsSchema };
