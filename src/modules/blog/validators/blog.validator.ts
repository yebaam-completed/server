import Joi, { ObjectSchema } from 'joi';

const blogSchema: ObjectSchema = Joi.object().keys({
  content: Joi.string().required().messages({
    'any.required': 'Content is a required field',
    'string.empty': 'Content property is not allowed to be empty'
  }),
  imgVersion: Joi.string().optional().allow(null, ''),
  imgId: Joi.string().optional().allow(null, ''),

});

const blogWithImageSchema: ObjectSchema = Joi.object().keys({
  content: Joi.string().required().messages({
    'any.required': 'Content is a required field',
    'string.empty': 'Content property is not allowed to be empty'
  }),
  imgVersion: Joi.string().required().messages({
    'any.required': 'Image version is a required field',
    'string.empty': 'Image version property is not allowed to be empty'
  }),
  imgId: Joi.string().required().messages({
    'any.required': 'Image ID is a required field',
    'string.empty': 'Image ID property is not allowed to be empty'
  }),

});

export { blogSchema, blogWithImageSchema };
