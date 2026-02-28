import { Outlet, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import MainLayout from './layout/MainLayout'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, UserSlicePath } from './provider/slice/user.slice'

function App() { 
  const [loading, SetLoading] = useState(true)
  const navigate= useNavigate() 
  const dispatch = useDispatch()
  const selector = useSelector(UserSlicePath)

  const fetchUser = async(token:string) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/profile`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })

      console.log("Fetched user:", data);
      dispatch(setUser(data)) // use data directly, not data.user
      SetLoading(false)
    } catch (error:any) {
      console.error("Fetch profile error:", error.response || error)
      localStorage.removeItem("token") // optional: remove invalid token
      navigate("/login")
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token") || ''

    if(!token){
      navigate("/login")
      return
    }

    if (selector?.email){
      SetLoading(false)
      return 
    }

    fetchUser(token)
  }, [])

  if (loading){
    return <div>loading....</div>
  }

  return (
    <>
      <Header />
      <MainLayout>
        <Outlet />
      </MainLayout>
    </>
  )
}

export default App