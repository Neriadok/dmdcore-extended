import logo from '../../logo.png';
import './app.css';
import { AppBar, Stack, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Router from '../router';
import AppBarProfile from '../../components/app-bar-profile/app-bar-profile';
import AppMenu from '../../components/app-menu/app-menu';
import AppSnackbar from '../../components/app-snackbar/app-snackbar';
import { useState } from 'react';
import { Subject, takeUntil } from 'rxjs';
import React from 'react';
import { projectSubject } from '../../core/session';

function App() {
    const navigate = useNavigate();
    const [project, setProject] = useState(projectSubject.value);
    const unsuscribe: Subject<any> = new Subject();

    React.useEffect(() => {
        projectSubject.pipe(takeUntil(unsuscribe)).subscribe((v) => setProject(v));
        return () => { unsuscribe.next(true); unsuscribe.complete(); }
    }, [])

    return (
        <main>
            <AppBar position="static" color="inherit">
                <Toolbar>
                    <img src={logo} className="logo" alt="logo" onClick={() => navigate("/")} />
                    <Stack direction='row-reverse' sx={{ flexGrow: 1 }}>
                        <AppBarProfile />
                    </Stack>
                </Toolbar>
            </AppBar>
            <AppSnackbar></AppSnackbar>
            <Stack direction='row'>
                {project ? <AppMenu /> : ''}
                <Router></Router>
            </Stack>
        </main>
    );
}

export default App;
