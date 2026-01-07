import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Student from '../pages/Student/Student'
import Sidebar from '../components/Siderbar'
import { useAuth } from '../context/auth';
import Assignmentstd from '../pages/Student/Assignmentstd';
import { Quiz } from '../pages/Student/Quiz';
import Notification from '../components/Notification';
import Topbar from '../components/Topbar';
import Paymentsuccess from '../components/Paymentsuccess';
import Paymentcancel from '../components/Paymentcancel';


function StudentLayout() {
    const { user } = useAuth();
  let routes = <>
   
        <Route path='/school' element={<Student/>} />
         <Route path='/quiz' element={<Quiz/>} />
        <Route path='/schoolassign' element={<Assignmentstd/>} />
          {/* ✅ Stripe Routes */}
          <Route path="/student/payment-success" element={<Paymentsuccess />} />
          <Route path="/payment-cancel" element={<Paymentcancel />} />
        <Route path='*'
            element={
                <Navigate to={"/school"} />
            } />
    </>
    return (
        <>
        <Notification/>
        <Topbar/>
        <Sidebar role={user?.role}>
            <Routes>
                {routes}
            </Routes>
            </Sidebar>
        </>
    )
}

export default StudentLayout
