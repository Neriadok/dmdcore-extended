import './members.css';
import { Box, Button, Chip, Container, Dialog, DialogActions, DialogTitle, IconButton, Paper, Stack, TextField, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { t } from 'i18next';
import { isEmail } from '../../lib/common-validations';
import { getSessionHeaders, hasProjectRight, iAmProjectOwner, loadProject, projectSubject } from '../../core/session';
import { AppProjectInvitation } from '../../entities/app-project-invitation';
import { v4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { AppProject } from '../../entities/app-project';
import { AppProjectMember } from '../../entities/app-project-member';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faPencil, faPeopleArrows, faQuestion, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { snackbarAlertSubject } from '../../core/snackbar-alert';

function Members() {
    const [currentProject, setCurrentProject] = React.useState<AppProject | undefined>(undefined);
    const [inviteError, setInviteError] = React.useState<boolean>(false);
    const [invitationEmail, setInvitationEmail] = React.useState<string>('');
    const [invitations, setInvitations] = React.useState<AppProjectInvitation[]>([]);
    const [members, setMembers] = React.useState<AppProjectMember[]>([]);
    const [deleteTargetMember, setDeleteTargetMember] = React.useState<AppProjectMember | null>(null);
    const [transferTargetMember, setTransferTargetMember] = React.useState<AppProjectMember | null>(null);
    const navigate = useNavigate();
    const params = useParams();
    const columnDefs: ColDef[] = [
        { field: 'User.name', cellStyle: {textAlign: 'left'} },
        { field: 'projectRights', flex: 1, minWidth: 150, cellRenderer: (params: any) => getRightsIcon(params) },
        { field: 'membersRights', flex: 1, minWidth: 150, cellRenderer: (params: any) => getRightsIcon(params) },
        { field: 'initiativesRights', flex: 1, minWidth: 150, cellRenderer: (params: any) => getRightsIcon(params) },
        { field: 'actions',  minWidth: 120, maxWidth: 120, cellRenderer: (params: any) => getActions(params) }
    ];

    React.useEffect(() => {
        if (!currentProject) {
            initialize()
        }
        return () => {
        }
    }, [])
    return (
        <Container style={{ textAlign: 'center' }}>
            {hasProjectRight('membersRights', 2) ? getInvitationsForm() : ''}
            <Paper sx={{ p: 2, mt: 3 }}>
                <Toolbar sx={{ mt: -2, ml: -2, mr: -2, flexWrap: 'wrap' }}>
                    <Typography variant="h4" style={{ textAlign: 'left' }} color="primary">{t('section.members')}</Typography>
                </Toolbar>
                <Box className="ag-theme-material" style={{ height: 400 }}>
                    <AgGridReact rowData={members} columnDefs={columnDefs}></AgGridReact>
                </Box>
            </Paper>
            <Dialog
                open={!!deleteTargetMember}
                onClose={() => setDeleteTargetMember(null)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{getDeleteDialog(deleteTargetMember?.User)}</DialogTitle>
                <DialogActions>
                    <Button color='inherit' onClick={() => setDeleteTargetMember(null)} autoFocus>{t('core.cancel')}</Button>
                    <Button color='error' onClick={() => deleteConfirmation()}>{t('core.delete')}</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={!!transferTargetMember}
                onClose={() => setTransferTargetMember(null)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{getTransferDialog(transferTargetMember?.User)}</DialogTitle>
                <DialogActions>
                    <Button color='inherit' onClick={() => setTransferTargetMember(null)} autoFocus>{t('core.cancel')}</Button>
                    <Button color='error' onClick={() => transferConfirmation()}>{t('core.accept')}</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );

    function getInvitationsForm() {
        return <Paper sx={{ p: 2, mt: 3 }}>
            <Toolbar sx={{ mt: -2, ml: -2, mr: -2, flexWrap: 'wrap' }}>
                <Typography variant="h4" style={{ textAlign: 'left' }} color="primary">{t('section.invitations')}</Typography>
                <Stack direction="row-reverse" spacing={2} sx={{ flexGrow: 1, flexWrap: 'wrap' }}>
                    <form onSubmit={(e: React.FormEvent) => sendInvitation(e)}>
                        <Stack direction="row" spacing={2}>
                            <TextField
                                id='invitation'
                                className={`invite`}
                                type="email"
                                sx={{ pb: 1 }}
                                style={{ width: '100%' }}
                                label={t(`core.email`)}
                                onChange={(e) => setInvitationEmail(e.target.value.trim())}
                                onBlur={(e) => setInvitationEmail(e.target.value.trim())}
                                error={inviteError}
                                variant="standard"
                            />
                            <Button type='submit' disabled={!isEmail(invitationEmail)}>{t('members.invite')}</Button>
                        </Stack>
                    </form>
                </Stack>
            </Toolbar>
            <Stack direction="row" style={{ flexWrap: 'wrap' }}>{
                invitations.map((invitation) => (<Chip
                    sx={{ mb: 1, mr: 1 }}
                    key={invitation.uid}
                    label={invitation.email}
                    onDelete={(i) => removeInvitation(invitation)}
                />))
            }</Stack>
        </Paper>
    }

    async function initialize() {
        await loadProject(params.ProjectId, navigate, setCurrentProject);
        loadMembers();
        loadInvitations();
    }

    function getDeleteDialog(User: any): string {
        return t('members.deleteconfirmation', User) as any;
    }

    function getTransferDialog(User: any): string {
        return t('members.transferconfirmation', User) as any;
    }

    async function loadInvitations() {
        const response = await fetch(`/api/invitations`, {
            headers: { "Content-Type": "application/json", ...await getSessionHeaders() }
        });
        if (response.status >= 300) {
            snackbarAlertSubject.next({ severity: 'error', text: t(`server.error${response.status}`) })
        } else if (response.status === 204) {
            setInvitations([])
        } else {
            const { rows } = await response.json()
            setInvitations(rows)
        }
    }

    async function sendInvitation(event: React.FormEvent) {
        event.preventDefault();
        if (isEmail(invitationEmail)) {
            const invitation: Partial<AppProjectInvitation> = {
                ProjectId: currentProject?.id,
                email: invitationEmail,
                uid: v4()
            }
            const response = await fetch(`/api/invitations`, {
                method: 'POST',
                body: JSON.stringify(invitation),
                headers: { "Content-Type": "application/json", ...await getSessionHeaders() }
            });
            if (response.status >= 300) {
                snackbarAlertSubject.next({ severity: 'error', text: t(`server.error${response.status}`) })
            } else if (response.status === 204) {
                loadMembers();
            } else {
                const invitation = await response.json()
                setInvitations([...invitations, invitation])
                clearInvitationField();
            }
        } else {
            setInviteError(true);
        }
    }

    async function removeInvitation(invitation: AppProjectInvitation) {
        const response = await fetch(`/api/invitations?uid=${invitation.uid}`, {
            method: 'DELETE',
            headers: await getSessionHeaders()
        });
        if (response.status >= 300) {
            snackbarAlertSubject.next({ severity: 'error', text: t(`server.error${response.status}`) })
        } else {
            setInvitations(invitations.filter(({ uid }) => uid !== invitation.uid));
        }
    }

    function clearInvitationField() {
        const invitationField = document.getElementById('invitation') as HTMLInputElement;
        if (invitationField) {
            invitationField.value = '';
            invitationField.focus();
        }
    }

    async function loadMembers() {
        const response = await fetch(`/api/members`, {
            headers: { "Content-Type": "application/json", ...await getSessionHeaders() }
        });
        if (response.status >= 300) {
            snackbarAlertSubject.next({ severity: 'error', text: t(`server.error${response.status}`) })
        } else if (response.status === 204) {
            setMembers([])
        } else {
            const { rows } = await response.json()
            setMembers(rows)
        }
    }

    function getRightsIcon(params: ICellRendererParams): JSX.Element {
        const right: number = params.value;
        const icons = [
            faEyeSlash,
            faEye,
            faPencil
        ]
        return <IconButton color={params.value ? 'primary' : undefined} onClick={() => updateRight(params)}><FontAwesomeIcon icon={icons[right] || faQuestion} /></IconButton>
    }

    function getActions(params: ICellRendererParams): JSX.Element {
        return <Stack direction='row-reverse'>
            {hasProjectRight('membersRights', 2) ? <IconButton onClick={() => setDeleteTargetMember(params.data)}><FontAwesomeIcon icon={faTrashAlt} /></IconButton> : ''}
            {iAmProjectOwner() ? <IconButton onClick={() => setTransferTargetMember(params.data)}><FontAwesomeIcon icon={faPeopleArrows} /></IconButton> : ''}
        </Stack>
    }

    async function deleteConfirmation() {
        const response = await fetch(`/api/members?uid=${deleteTargetMember?.uid}`, {
            method: 'DELETE',
            headers: await getSessionHeaders()
        });
        if (response.status >= 300) {
            snackbarAlertSubject.next({ severity: 'error', text: t(`server.error${response.status}`) })
        } else {
            setMembers(members.filter((member) => member.uid !== deleteTargetMember?.uid))
            setDeleteTargetMember(null)
        }
    }

    function changeRight(right: number): number {
        return {
            0: 1,
            1: 2,
            2: 0
        }[right] || 0;
    }

    async function updateRight({ data, colDef }: ICellRendererParams) {
        const field = colDef?.field as string
        const value = { uid: data.uid, [field]: changeRight(data[field]) }
        const response = await fetch(`/api/members`, {
            method: 'PATCH',
            body: JSON.stringify(value),
            headers: { "Content-Type": "application/json", ...await getSessionHeaders() }
        });
        if (response.status >= 300) {
            snackbarAlertSubject.next({ severity: 'error', text: t(`server.error${response.status}`) })
        } else {
            const updatedValue = await response.json();
            setMembers(members.map((member) => member.uid === data.uid ? { ...data, ...updatedValue } : member))
        }
    }

    async function transferConfirmation() {

        const response1 = await fetch(`/api/members?uid=${transferTargetMember?.uid}`, {
            method: 'DELETE',
            headers: await getSessionHeaders()
        });
        if (response1.status >= 300) {
            snackbarAlertSubject.next({ severity: 'error', text: t(`server.error${response1.status}`) })
        } else {
            const response2 = await fetch(`/api/project`, {
                method: 'POST',
                body: JSON.stringify({ ...projectSubject.value, OwnerId: transferTargetMember?.UserId }),
                headers: { "Content-Type": "application/json", ...await getSessionHeaders() }
            });
            if (response2.status >= 300) {
                snackbarAlertSubject.next({ severity: 'error', text: t(`server.error${response2.status}`) })
            } else {
                navigate('/');
            }
        }
    }
}

export default Members;
