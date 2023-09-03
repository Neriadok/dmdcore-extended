import { GridProps } from "@mui/material";
import { EntityCardDisplay } from "../entity-card/entity-card.interface";


export interface EntityGridProps<T> {
    items: T[];
    card: EntityCardDisplay<T>;
    grid?: GridProps
};
