import { Subject } from "rxjs";

export interface SnackbarAlert {
    text: string;
    severity?: 'info' | 'success' | 'warning' | 'error'
}

export const snackbarAlertSubject: Subject<SnackbarAlert> = new Subject<SnackbarAlert>();