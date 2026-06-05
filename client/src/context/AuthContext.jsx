import {useState, useEffect, createContext, useContext} from 'react'
import { api } from '../api/axios'

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchUser = async()=>{
        try {
            const response = await api.get("/api/auth/me");
            setUser(response.data.user);
        } catch (error) {
            setUser(null)
        } finally {
            setLoading(false)
        }
      }
    
      fetchUser();
      
    }, [])
    
    const logout = async()=>{
        await api.post("/api/auth/logout");
        localStorage.removeItem('token');
        setUser(null)
    }

  return (
    <AuthContext.Provider value={{
        user,
        loading,
        isAuthenticated: !! user,
        setUser,
        logout,
    }} >
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = ()=>{
    return useContext(AuthContext)
}
