import './profile.css';
import { Card, Container, Stack, CardContent, Typography, Button, CardActions } from '@mui/material';
import { userSubject } from '../../core/session';
import { useState } from 'react';
import { skip } from 'rxjs';
import { logOut } from '../../lib/login';

function Profile() {
    const [user, setUser] = useState(userSubject.value);
    userSubject.pipe(skip(1)).subscribe((v) => setUser(v));

    return (
        <Container>
            {user ? <Stack mt={2} spacing={2}>
                <Card>
                    <CardContent>
                        <Typography color="text">
                            {user?.name}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button color="error" onClick={() => logOut()}>Logout</Button>
                    </CardActions>
                </Card>
            </Stack>
            : <div>Who are you?</div>
        }
        </Container>
    );
}

export default Profile;
