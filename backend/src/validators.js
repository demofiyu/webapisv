import Joi from 'joi';

export const validateRSVP = (data) => {
  const schema = Joi.object({
    inviteId: Joi.string().uuid().required(),
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    adults: Joi.number().integer().min(1).max(20).required(),
    children: Joi.number().integer().min(0).max(20).required(),
    mealPreference: Joi.string().valid('vegetarian', 'vegan', 'non-vegetarian', 'gluten-free').required(),
    attending: Joi.boolean().required(),
    message: Joi.string().max(500).allow(''),
  });

  return schema.validate(data);
};

export const validateAdminLogin = (data) => {
  const schema = Joi.object({
    password: Joi.string().required(),
  });

  return schema.validate(data);
};

export const validateGuestCreation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
  });

  return schema.validate(data);
};
