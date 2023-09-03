import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import { EntityCardAction, EntityCardProps } from './entity-card.interface';

function EntityCard<T>(props: EntityCardProps<T>) {
    // @ts-ignore
    const onClick: any = props.card.action ? (e) => props.card.action(e, props.item) : undefined;
    return (
        <Card onClick={onClick}>
            {getImage(props)}
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">{props.item[props.card.title] as any}</Typography>
                {getBody(props)}
            </CardContent>
            {getActions(props)}
        </Card>
    );
}

function getActions<T>({ item, card }: EntityCardProps<T>) {
    return card.actions ? <CardActions sx={{ flexDirection:'row-reverse' }}>
        {(card.actions || []).map((action, index) => getAction(item, action, index))}
    </CardActions> : ""
}

function getAction<T>(item: T, action: EntityCardAction<T>, index: number) {
    // @ts-ignore
    const onClick: any = action.itemAction ? (e) => action.itemAction(e, item) : action.props?.onClick;
    return <Button {...action.props} key={index} onClick={onClick}> {action.content}   </Button>
}

function getImage<T>({ item, card }: EntityCardProps<T>) {
    return card.image || card.imageStatic ? <CardMedia sx={{ height: card.imageHeight || 140 }} image={card.image ? (item[card.image] as any) : card.imageStatic} /> : ""
}

function getBody<T>({ item, card }: EntityCardProps<T>) {
    return card.body ? <Typography variant="body2" color="text.secondary">{item[card.body] as any}</Typography> : ""
}

export default EntityCard;
