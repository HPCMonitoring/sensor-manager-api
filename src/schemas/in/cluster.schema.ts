import { nullable } from '@schemas/common';
import s from 'fluent-json-schema';

export const clusterInputSchema = s.object().prop('name', s.string().required()).prop('remarks', s.string().raw(nullable));

export type ClusterInput = {
    name: string;
    remarks: string | null;
};
