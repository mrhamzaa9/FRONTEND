import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Student from '../pages/Student/Student'
import Sidebar from '../components/Siderbar'
import { useAuth } from '../context/auth';
import Assignmentstd from '../pages/Student/Assignmentstd';
import { Quiz } from '../pages/Student/Quiz';


function StudentLayout() {
    const { user } = useAuth();
  let routes = <>
   
        <Route path='/school' element={<Student/>} />
         <Route path='/quiz' element={<Quiz/>} />
        <Route path='/schoolassign' element={<Assignmentstd/>} />
        <Route path='*'
            element={
                <Navigate to={"/school"} />
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

export default StudentLayout
