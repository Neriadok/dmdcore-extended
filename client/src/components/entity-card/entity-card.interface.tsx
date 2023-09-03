import { ButtonProps,  } from "@mui/material";


export interface EntityCardProps<T> {
    item: T;
    card: EntityCardDisplay<T>;
};

export interface EntityCardDisplay<T> {
    title: keyof T;
    image?: keyof T;
    body?: keyof T;
    action?: (e: any, item: T) => any;
    actions?:  EntityCardAction<T>[];
    imageHeight?: number;
    imageStatic?: string;
};

export interface EntityCardAction<T>{
    itemAction?: (e: any, item: T) => void;
    content?: JSX.Element | string;
    props?: ButtonProps;
};
