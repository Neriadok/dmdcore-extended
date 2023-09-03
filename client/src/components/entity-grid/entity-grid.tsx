import { Grid } from '@mui/material';
import { EntityGridProps } from './entity-grid.interface';
import EntityCard from '../entity-card/entity-card';
import { default as hash } from 'object-hash';
import { EntityCardDisplay } from '../entity-card/entity-card.interface';

function EntityGrid<T>(props: EntityGridProps<T>) {
    const key = `grid-${hash(props as any)}`
    return (
        <Grid {...props.grid} container>
            {(props.items || []).map((item, index) => toEntityCard(key, item, index, props.card))}
        </Grid>
    );

    function toEntityCard<T>(key: string, item: T, index: number, card: EntityCardDisplay<T>) {
        return <Grid item xs={1} key={index}>
            <EntityCard item={item} card={card}></EntityCard>
        </Grid>
    }
}

export default EntityGrid;
