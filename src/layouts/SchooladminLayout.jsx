import React from 'react'
import Schooladmin from '../pages/SchoolAdmin/Schooladmin'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/auth';
import Sidebar from '../components/Siderbar';
import CourseSchool from '../pages/SchoolAdmin/CourseSchool';
import TeacherRequests from '../pages/SchoolAdmin/TeacherRequests';
import Notification from '../components/Notification';

function SchooladminLayout() {
    const { user } = useAuth();
 let routes = <>
   
        <Route path='/schooladmin' element={<Schooladmin/>} />
         <Route path='/schooladmin/teachers' element={<TeacherRequests/>} />
         <Route path='/schooladmin/courses' element={<CourseSchool/>} />
        <Route path='*'
            element={
                <Navigate to={"/schooladmin"} />
            } />
    </>
    return (
        <>
        <Notification/>
            <Sidebar role={user?.role}>
            <Routes>
                {routes}
            </Routes>
            </Sidebar>
        </>
    )
}

export default SchooladminLayout
