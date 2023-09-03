import { TextFieldProps } from "@mui/material";
import { CoreEntity } from "./core-entity";


export interface EntityFormProps<T extends CoreEntity>{
    entityName?: string;
    entity?: Partial<T>;
    fields?: EntityFieldProps<T>[];
    readonly?: boolean;
    onChange: (entity: Partial<T>) => void;
    [prop: string]: any;
}

export interface EntityFieldProps<T extends CoreEntity>{
    key: keyof T;
    props?: TextFieldProps;
}