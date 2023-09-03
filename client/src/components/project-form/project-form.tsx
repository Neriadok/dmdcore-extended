import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import React from "react";
import { AppProject } from "../../entities/app-project";
import { EntityFormProps } from "../../entities/core-entity-form";
import EntityField from "../entity-field/entity-field";
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Subject, takeUntil } from "rxjs";
import { v4 } from 'uuid';


function ProjectForm(props: EntityFormProps<AppProject>) {
    const [expanded, setExpanded] = React.useState(props.expanded || false);
    const [entity] = React.useState(new BehaviorSubject<Partial<AppProject>>(props.entity || { uid: v4() }));
    const unsuscribe: Subject<any> = new Subject();

    React.useEffect(() => {
        entity.pipe(takeUntil(unsuscribe)).subscribe((v) => props.onChange(v));
        return () => { unsuscribe.next(true); unsuscribe.complete(); }
    }, [])
    return (
        <form id={`project-${entity.value.id || 'new'}`}>
            <Box sx={{ pt: 1 }}>
                <Stack spacing={1}>
                    <EntityField entityName="project" field="name" entity={entity} fieldProps={{ required: true, InputProps: { readOnly: props.readonly } }}></EntityField>
                    <EntityField entityName="project" field="sinthesys" entity={entity} fieldProps={{ required: true, InputProps: { readOnly: props.readonly }, multiline: true, minRows: 3 }}></EntityField>
                    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)} elevation={3} >
                        <AccordionSummary expandIcon={<FontAwesomeIcon icon={faChevronDown} />} >
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>{t('project.about')}</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>({t('core.optional')})</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container columns={{ xs: 1, sm: 2 }} spacing={1}>
                                <Grid item xs={1} >
                                    <EntityField entityName="project" field="porpourse" entity={entity} fieldProps={{ InputProps: { readOnly: props.readonly }, multiline: true, minRows: 5 }}></EntityField>
                                </Grid>
                                <Grid item xs={1}>
                                    <EntityField entityName="project" field="targetPublic" entity={entity} fieldProps={{ InputProps: { readOnly: props.readonly }, multiline: true, minRows: 5 }}></EntityField>
                                </Grid>
                                <Grid item xs={1} >
                                    <EntityField entityName="project" field="expectedResult" entity={entity} fieldProps={{ InputProps: { readOnly: props.readonly }, multiline: true, minRows: 5 }}></EntityField>
                                </Grid>
                                <Grid item xs={1} >
                                    <EntityField entityName="project" field="keyPerformanceIndicator" entity={entity} fieldProps={{ InputProps: { readOnly: props.readonly }, multiline: true, minRows: 5 }}></EntityField>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Stack>
            </Box>
        </form>
    );
}

export default ProjectForm;