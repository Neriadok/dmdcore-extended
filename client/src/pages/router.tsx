import { Route, Routes } from 'react-router-dom';
import Profile from './profile/profile';
import Home from './home/home';
import Project from './project/project';
import Members from './members/members';

function Router() {
    
    return (
        <Routes >
            <Route path="" element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="project/:ProjectId" element={<Project />} />
            <Route path="project/:ProjectId/members" element={<Members />} />
        </Routes>
    );
}

export default Router;
