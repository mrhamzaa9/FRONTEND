import React from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Superadmin from '../pages/SuperAdmin/Superadmin'
import Sidebar from '../components/Siderbar'
import { useAuth } from '../context/auth'
import ViewSchool from '../pages/SuperAdmin/ViewSchool'
import DeleteSchool from '../pages/SuperAdmin/DeleteSchool'
import ViewUser from '../pages/SuperAdmin/ViewUser'
import DeleteUser from '../pages/SuperAdmin/DeleteUser'

const SuperadminLayout = () => {
    const { user } = useAuth();
    let routes = <>
   
        <Route path='/superadmin' element={<Superadmin/>} />
        <Route path='/superadmin/schools' element={<ViewSchool/>} />
        <Route path='/superadmin/delete-school' element={<DeleteSchool/>} />
        <Route path='/superadmin/users' element={<ViewUser/>} />
        <Route path='/superadmin/delete-user' element={<DeleteUser/>} />
        <Route path='*'
            element={
                <Navigate to={"/superadmin"} />
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

export default SuperadminLayout
