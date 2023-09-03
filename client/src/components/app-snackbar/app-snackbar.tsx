import React, { useState } from 'react';
import { Subject, takeUntil } from 'rxjs';
import { SnackbarAlert, snackbarAlertSubject } from '../../core/snackbar-alert';
import { Alert, Snackbar, SnackbarOrigin } from '@mui/material';
import './app-snackbar.css'

function AppSnackbar() {
    const [snack, setSnack] = useState<SnackbarAlert | null>(null);
    const unsuscribe: Subject<any> = new Subject();
    const duration = 5000;
    const origin: SnackbarOrigin = { vertical: 'top', horizontal: 'right' }

    React.useEffect(() => {
        snackbarAlertSubject.pipe(takeUntil(unsuscribe)).subscribe((v) => setSnack(v));
        return () => { unsuscribe.next(true); unsuscribe.complete(); }
    }, [])

    return <React.Fragment>
        <Snackbar className="app-snackbar-alert" open={!!snack} autoHideDuration={duration} onClose={() => setSnack(null)} anchorOrigin={origin}>
            <Alert severity={snack?.severity || 'info'}>{snack?.text}</Alert>
        </Snackbar>
    </React.Fragment>;

}

export default AppSnackbar;
