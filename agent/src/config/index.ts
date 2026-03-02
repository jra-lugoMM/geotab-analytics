import joi from 'joi';
import * as dotenv from 'dotenv';

dotenv.config();

const schema = joi
  .object({
    GO_USER: joi.string().required(),
    GO_PASS: joi.string().required(),
    GO_DATABASE: joi.string().required(),
    GO_SERVER: joi.string().required(),
    PORT: joi.number().required(),
    GOOGLE_MAPS_API_KEY: joi.string().required(),
    GEMINI_API_KEY: joi.string().required(),
  })
  .unknown();

const { error, value } = schema.validate(process.env, { stripUnknown: true });

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export type Config = typeof value;
export const config = value as Config;
