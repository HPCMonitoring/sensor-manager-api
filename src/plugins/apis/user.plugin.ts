import { HandlerTag } from '@constants';
import { usersHandler } from '@handlers';
import { getUserSchema } from '@schemas/out';
import { createPlugin } from '@utils';

export const userPlugin = createPlugin(
    [HandlerTag.USER],
    [
        {
            method: 'GET',
            url: '',
            schema: {
                response: {
                    200: getUserSchema
                }
            },
            handler: usersHandler.getUserById
        }
    ]
);
