import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import VerifyEmail from '../pages/Auth/VerfiyEmail'
import Forgetpass from '../pages/Auth/Forgetpass'
import Reset from '../pages/Auth/Reset'
function AuthLayout() {

  const routes = <>
    <Route path="/login" element={<Login/>} />
    <Route path="/sign" element={<Register/>} />
    <Route path="/verify/:token" element={<VerifyEmail/>} />
   <Route path="/forgot-password" element={<Forgetpass/>} />
 <Route path="/reset-password/:token" element={<Reset />} />


    <Route path='*'
      element={ 
        <Navigate to={"/login"} />
      } />
  </>
  return (
    <>
      <Routes>
        {routes}
      </Routes>
    </>
  )
}

export default AuthLayout