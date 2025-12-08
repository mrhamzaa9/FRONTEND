import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Teacher from '../pages/Teacher/Teacher'
import Sidebar from '../components/Siderbar';
import { useAuth } from '../context/auth';

function TeacherLayout() {
    const { user } = useAuth();
     let routes = <>
   
        <Route path='/teacher' element={<Teacher/>} />
    
        <Route path='*'
            element={
                <Navigate to={"/teacher"} />
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

export default TeacherLayout
