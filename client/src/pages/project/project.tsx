import './project.css';
import { Button, Container, Dialog, DialogActions, DialogTitle, LinearProgress, Paper, Stack, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { getSessionHeaders, hasProjectRight, iAmProjectOwner, loadProject } from '../../core/session';
import { AppProject } from '../../entities/app-project';
import ProjectForm from '../../components/project-form/project-form';
import { t } from 'i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { snackbarAlertSubject } from '../../core/snackbar-alert';
import { AppProjectMember } from '../../entities/app-project-member';

function Project() {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [currentProject, setCurrentProject] = React.useState<AppProject | undefined>(undefined);
    const navigate = useNavigate();
    const params = useParams();
    let project: Partial<AppProject> = JSON.parse(JSON.stringify(currentProject || {}));
    const [deleteTargetMember, setDeleteTargetMember] = React.useState<AppProjectMember | null>(null);

    React.useEffect(() => {

        if (!currentProject) {
            loadProject(params.ProjectId, navigate, setCurrentProject);
        }
        return () => {
        }
    }, [])
    return (
        <Container style={{ textAlign: 'center' }}>
            {
                loading || !currentProject ? <LinearProgress />
                    : <Paper sx={{ p: 2, mt: 3 }}>
                        <Toolbar sx={{mt:-2, ml:-2, mr:-2, flexWrap: 'wrap'}}>
                            <Typography variant="h4" style={{ textAlign: 'left' }} color="primary">{t('project.about')}</Typography>
                            <Stack direction="row-reverse" spacing={2} sx={{ flexGrow: 1, flexWrap: 'wrap' }}>
                                {hasProjectRight('projectRights', 2) ? <Button onClick={() => saveChanges()}>{t('core.save')}</Button> : ''}
                                {iAmProjectOwner() ? <Button color={'error'} onClick={() => deleteProject()}>{t('core.delete')}</Button> : ''}
                                {!iAmProjectOwner() ? <Button color={'inherit'} onClick={() => setDeleteTargetMember(project.rights || null)}>{t('project.leave')}</Button> : ''}
                            </Stack>
                        </Toolbar>
                        <ProjectForm entity={project} expanded={true} readonly={!hasProjectRight('projectRights', 2)} onChange={(p) => project = p}></ProjectForm>
                    </Paper>
            }
            <Dialog
                open={!!deleteTargetMember}
                onClose={() => setDeleteTargetMember(null)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{t('project.leaveconfirmation')}</DialogTitle>
                <DialogActions>
                    <Button color='inherit' onClick={() => setDeleteTargetMember(null)} autoFocus>{t('core.cancel')}</Button>
                    <Button color='error' onClick={() => leaveProject()}>{t('project.leave')}</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );


    async function saveChanges() {
        setLoading(true);
        const response = await fetch(`/api/project`, {
            method: 'POST',
            body: JSON.stringify(project),
            headers: { "Content-Type": "application/json", ...await getSessionHeaders() }
        });
        if (response.status >= 300) {
            snackbarAlertSubject.next({ severity: 'error', text: t(`server.error${response.status}`) })
        } else {
            setCurrentProject(await response.json())
        }
        setLoading(false);
    }

    async function deleteProject() {
        setLoading(true);
        const response = await fetch(`/api/project?uid=${project.uid}`, {
            method: 'DELETE',
            headers: await getSessionHeaders()
        });
        if (response.status >= 300) {
            snackbarAlertSubject.next({ severity: 'error', text: t(`server.error${response.status}`) })
        } else {
            navigate('/');
        }
        setLoading(false);
    }

    async function leaveProject() {
        const response = await fetch(`/api/members?uid=${deleteTargetMember?.uid}`, {
            method: 'DELETE',
            headers: await getSessionHeaders()
        });
        if (response.status >= 300) {
            snackbarAlertSubject.next({ severity: 'error', text: t(`server.error${response.status}`) })
        } else {
            navigate('/');
        }
    }
}

export default Project;
