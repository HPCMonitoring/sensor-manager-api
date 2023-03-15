import { ID_LENGTH } from '@constants';
import s from 'fluent-json-schema';

export const idSchema = s.string().required().minLength(ID_LENGTH).maxLength(ID_LENGTH).examples(['cles6oip50000nlmz7hbzyly5']);

export const nullable = { nullable: true };
