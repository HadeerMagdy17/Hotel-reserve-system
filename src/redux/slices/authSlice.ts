import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


interface UserData{
    _id:string;
    userName:string;
    role:string;
}
export interface AuthState {
  user: UserData |null;
  token:string | null;
  role:string | null;
}

const initialState: AuthState = {
 user: JSON.parse(localStorage.getItem('user') ||"null" ),
 token: localStorage.getItem("token"),
 role:localStorage.getItem("role")
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
  setLogin:(state, action: PayloadAction<{user:UserData;token:string;role:string}>)=>{
    state.user =action.payload.user;
    state.token =action.payload.token;
    state.role =action.payload.role;

    localStorage.setItem('token',action.payload.token);
     localStorage.setItem('role',action.payload.role);
      localStorage.setItem('user',JSON.stringify(action.payload.user));
  },

  setLogout:(state)=>{
     state.user =null;
    state.token =null;
    state.role =null;
    localStorage.clear()
  }
  },
})

// Action creators are generated for each case reducer function
export const {setLogin,setLogout } = authSlice.actions

export default authSlice.reducer