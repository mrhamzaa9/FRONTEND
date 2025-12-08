import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
function AuthLayout() {

  const routes = <>
    <Route path="/login" element={<Login/>} />
    <Route path="/sign" element={<Register/>} />
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