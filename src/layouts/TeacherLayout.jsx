import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Teacher from '../pages/Teacher/Teacher'
import Sidebar from '../components/Siderbar';
import { useAuth } from '../context/auth';
import Notification from '../components/Notification';
import Assigment from '../pages/Teacher/Assigment';


function TeacherLayout() {
    const { user } = useAuth();
     let routes = <>
   
        <Route path='/teacher' element={<Teacher/>} />
    <Route path='/teacher/assignments' element={<Assigment/>} />
        <Route path='*'
            element={
                <Navigate to={"/teacher"} />
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

export default TeacherLayout
