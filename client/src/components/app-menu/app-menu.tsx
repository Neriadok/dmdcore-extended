import { IconButton, Stack } from '@mui/material';
import { hasProjectRight } from '../../core/session';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppMenuItem, appMenuItems } from '../../core/appmenu';

function AppMenu() {
    const navigate = useNavigate();
    return <Stack sx={{ p: 1 }}>
        {appMenuItems.filter(({ right }) => !right || hasProjectRight(right)).map(toMenuIcon)}
    </Stack>;


    function toMenuIcon(item: AppMenuItem) {
        const path = item.path();
        return <IconButton key={path} color={getColor(path)} onClick={() => navigate(path)}>
            <FontAwesomeIcon icon={item.icon} />
        </IconButton>
    }

    function getColor(path: string): "inherit" | "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" {
        return window.location.pathname === path ? 'inherit' : 'default'
    }
}

export default AppMenu;
