import logo from '../../logo.png';
import './home.css';
import { Container } from '@mui/material';
import MyProjects from '../../components/my-projects/my-projects';
import { AppUser } from '../../entities/app-user';
import React from 'react';
import { projectSubject, userSubject } from '../../core/session';
import { takeUntil,Subject } from 'rxjs';
import { t } from 'i18next';

function Home() {
    const [user, setUser] = React.useState<AppUser | undefined>(userSubject.value);
    const unsuscribe: Subject<any> = new Subject();

    React.useEffect(() => {
        userSubject.pipe(takeUntil(unsuscribe)).subscribe((u) => setUser(u));
        projectSubject.next(undefined);
        return () => { unsuscribe.next(true); unsuscribe.complete(); }
    }, [])
    return (
        <Container style={{textAlign: 'center'}} sx={{ pt: 3 }}>
            {user ? <MyProjects></MyProjects> : <h3>{t('core.nocredentials')}</h3>}
        </Container>
    );
}

export default Home;
