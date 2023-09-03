import { Button } from '@mui/material';
import { t } from 'i18next';
import React, { useState } from 'react';
import { userSubject} from '../../core/session';
import { useNavigate } from 'react-router-dom';
import { authWithGoogle } from '../../lib/login';
import { Subject, takeUntil } from 'rxjs';

function AppBarProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(userSubject.value);
    const unsuscribe: Subject<any> = new Subject();

    React.useEffect(() => {
        userSubject.pipe(takeUntil(unsuscribe)).subscribe((v) => setUser(v));
        return () => { unsuscribe.next(true); unsuscribe.complete(); }
    }, [])

    return user ? <Button id="profile" onClick={() => navigate("/profile")}>{user?.name || t('core.nocredentials')}</Button>
        : <Button id="access" color="primary" variant="text" onClick={() => authWithGoogle()}>{ t('core.access')}</Button>


}

export default AppBarProfile;
