import React from 'react'
import Schooladmin from '../pages/SchoolAdmin/Schooladmin'
import { Navigate, Route, Routes } from 'react-router-dom'
import RegisterSchool from '../pages/SchoolAdmin/RegisterSchool'
import { useAuth } from '../context/auth';
import Sidebar from '../components/Siderbar';
import CourseSchool from '../pages/SchoolAdmin/CourseSchool';
import TeacherRequests from '../pages/SchoolAdmin/TeacherRequests';

function SchooladminLayout() {
    const { user } = useAuth();
 let routes = <>
   
        <Route path='/schooladmin' element={<Schooladmin/>} />
         <Route path='/create-school' element={<RegisterSchool/>} />
         <Route path='/schooladmin/teachers' element={<TeacherRequests/>} />
         <Route path='/schooladmin/courses' element={<CourseSchool/>} />
        <Route path='*'
            element={
                <Navigate to={"/schooladmin"} />
            } />
    </>
    return (
        <>
            <Sidebar role={user?.role}>
            <Routes>
                {routes}
            </Routes>
            </Sidebar>
        </>
    )
}

export default SchooladminLayout
