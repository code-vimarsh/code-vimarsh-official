import { ReactNode } from 'react';

export interface Achievement {
    id: string;
    date: string;
    title: string;
    description: string;
    icon: string | ReactNode;
    category: string;
}
