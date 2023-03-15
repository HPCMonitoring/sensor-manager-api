import { MIN_EMAIL_LENGTH, MIN_PASSWORD_LENGTH } from '@constants';
import s from 'fluent-json-schema';

export const authInputSchema = s
    .object()
    .prop('email', s.string().required().minLength(MIN_EMAIL_LENGTH).examples(['npvinh0507@gmail.com']))
    .prop('password', s.string().required().minLength(MIN_PASSWORD_LENGTH).examples(['@%!Fjhiuqwb^3']));

export interface AuthInput {
    email: string;
    password: string;
}
