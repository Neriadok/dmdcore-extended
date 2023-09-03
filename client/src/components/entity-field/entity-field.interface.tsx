import { TextFieldProps  } from "@mui/material";
import { BehaviorSubject } from "rxjs";
import { CoreEntity } from "../../entities/core-entity";


export interface EntityFieldProps<T extends CoreEntity> {
    entity: BehaviorSubject<Partial<T>>;
    entityName: string;
    field: keyof T
    fieldProps?: TextFieldProps;
};