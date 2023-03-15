import { HandlerTag } from '@constants';
import { clustersHandler } from '@handlers';
import { idSchema } from '@schemas/common';
import { clusterInputSchema } from '@schemas/in';
import { createClusterSchema, clusterSummarySchema } from '@schemas/out';
import { createPlugin } from '@utils';
import s from 'fluent-json-schema';

export const clusterPlugin = createPlugin(
    [HandlerTag.CLUSTER],
    [
        {
            method: 'GET',
            url: '',
            schema: {
                response: {
                    200: s.array().items(clusterSummarySchema)
                }
            },
            handler: clustersHandler.getAll
        },
        {
            method: 'POST',
            url: '',
            schema: {
                body: clusterInputSchema,
                response: {
                    200: createClusterSchema
                }
            },
            handler: clustersHandler.create
        },
        {
            method: 'PUT',
            url: '/:clusterId',
            schema: {
                params: s.object().prop('clusterId', idSchema),
                body: clusterInputSchema,
                response: {
                    200: createClusterSchema
                }
            },
            handler: clustersHandler.update
        },
        {
            method: 'DELETE',
            url: '/:clusterId',
            schema: {
                params: s.object().prop('clusterId', idSchema),
                response: {
                    200: createClusterSchema
                }
            },
            handler: clustersHandler.delete
        }
    ]
);
