import { Box, LinearProgress, Skeleton, Stack } from "@mui/material";
import React from "react";
import { EntityFieldProps, EntityFormProps } from "../../entities/core-entity-form";
import EntityField from "../entity-field/entity-field";
import { BehaviorSubject, Subject, takeUntil } from "rxjs";
import { v4 } from 'uuid';
import { CoreEntity } from "../../entities/core-entity";


function EntityForm<T extends CoreEntity>(props: EntityFormProps<T>) {
    const [entity] = React.useState(new BehaviorSubject<Partial<T>>(props.entity || { uid: v4() } as any));
    const [entityName] = React.useState<string>(props.entityName || 'Entity');
    const [loading, setLoading] = React.useState<boolean>(false);
    const unsuscribe: Subject<any> = new Subject();
    if (props.entity && entity.value.uid !== props.entity.uid) {
        entity.next(props.entity);
        reloadForm();
    }

    React.useEffect(() => {
        entity.pipe(takeUntil(unsuscribe)).subscribe((v) => props.onChange(v));
        return () => { unsuscribe.next(true); unsuscribe.complete(); }
    }, [])
    return (
        <form id={`${props.key}-${entity.value.id || 'new'}`}>
            <Box sx={{ pt: 1 }}>
                {loading ? <Box><Skeleton height="50px" variant="rectangular"/><LinearProgress /></Box>
                    : <Stack spacing={1}>{props.fields?.map(toField)}</Stack>}
            </Box>
        </form>
    );

    function toField(field: EntityFieldProps<T>) {
        return <EntityField key={field.key as string} entityName={entityName} field={field.key} entity={entity} fieldProps={field.props}></EntityField>
    }

    async function reloadForm() {
        setLoading(true);
        setTimeout(() => setLoading(false), 200)

    }
}

export default EntityForm;