import { AppProject } from '../../entities/app-project';
import EntityGrid from '../entity-grid/entity-grid';
import { EntityCardDisplay } from '../entity-card/entity-card.interface';
import { AppBar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, LinearProgress, Paper, Toolbar, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { t } from 'i18next';
import React from 'react';
import ProjectForm from '../project-form/project-form';
import { userSubject, auth, getSessionHeaders } from '../../core/session';
import { v4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { snackbarAlertSubject } from '../../core/snackbar-alert';

function MyProjects() {
    const navigate = useNavigate();
    let project: Partial<AppProject> = { OwnerId: userSubject.value?.id, uid: v4() };
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [projects, setProjects] = React.useState<AppProject[]>([]);
    const display: EntityCardDisplay<AppProject> = {
        title: 'name',
        body: 'sinthesys',
        imageStatic: "https://www.masterditec.com/wp-content/uploads/2022/04/Project-Manager-Professional.jpg",
        action: (_, p) => selectProject(p)
    };

    React.useEffect(() => {
        loadMyProjects();
    }, [])

    return (
        <Paper>
            <Toolbar>
                <Typography variant="h4" style={{ textAlign: 'left' }} color="primary" sx={{ flexGrow: 1, textAlign: 'left' }}>
                    {t('project.plural')}
                </Typography>
                <IconButton onClick={() => newProject()} color="inherit">
                    <FontAwesomeIcon icon={faAdd} />
                </IconButton>
            </Toolbar>
            <Box sx={{ pb: 3, pr: 3, pl: 3}}>
                {projects.length ? <EntityGrid items={projects} card={display} grid={{
                    spacing: 2,
                    columns: { xs: 1, sm: 2, md: 3 }
                }}></EntityGrid> :
                    <Typography variant="h6" component="div" color="gray">{t('core.noresults')}</Typography>}
            </Box>
            <Dialog open={open} onClose={() => setOpen(false)} >
                <DialogTitle>{t('project.new')}</DialogTitle>
                <DialogContent sx={{ p: 2 }}>
                    {
                        loading ? <LinearProgress />
                            : <ProjectForm entity={project} onChange={(p) => project = p}></ProjectForm>
                    }
                </DialogContent>
                <DialogActions>
                    <Button color="inherit" onClick={() => setOpen(false)}>{t('core.cancel')}</Button>
                    <Button onClick={() => createProject()}>{t('core.create')}</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );

    async function createProject() {
        setLoading(true);
        const response = await fetch(`/api/project`, {
            method: 'POST',
            body: JSON.stringify(project),
            headers: {
                "Content-Type": "application/json",
                ... await getSessionHeaders(),

            }
        });
        if (response.status >= 300) {
            snackbarAlertSubject.next({ severity: 'error', text: t(`server.error${response.status}`) })
        } else {
            loadMyProjects();
            setOpen(false);
        }
        setLoading(false);
    }

    function selectProject(project: AppProject) {
        navigate("/project/" + project.id);
    }

    function newProject() {
        project = { OwnerId: userSubject.value?.id, uid: v4() };
        setOpen(true);
    }

    async function loadMyProjects() {
        const token = await auth.currentUser?.getIdToken()
        if (!token) return;
        const response = await fetch(`/api/my-projects`, { headers: { token } });
        if (response.status >= 300) {
            snackbarAlertSubject.next({ severity: 'error', text: t(`server.error${response.status}`) })
        } else {
            const { rows } = await response.json();
            setProjects(rows);
        }
    }
}

export default MyProjects;
