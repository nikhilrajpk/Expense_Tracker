import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk(
    'auth/login', 
    async(credentials, {rejectWithValue})=> {
        try{
            const response = await axios.post('/api/auth/token/', credentials, {withCredentials:true});
            const userResponse = await axios.get('/api/auth/user/', {withCredentials:true});
            return userResponse.data; // {id, username, email, is_staff}
        }catch(error){
            return rejectWithValue(error.response?.data?.detail || 'Login failed');
        }
    }
)

export const register = createAsyncThunk(
    'auth/register',
    async(data, {rejectWithValue})=>{
        try {
            const response = await axios.post('/api/auth/register/', data, {withCredentials:true})
            return {message:'Registration successful'}
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Registration failed')
        }
    }
)

export const fetchUser = createAsyncThunk(
    'auth/fetchUser',
    async(_,{rejectWithValue})=>{
        try {
            const response = await axios.get('/api/auth/user/', {withCredentials:true})
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch user')
        }
    }
)


const authSlice = createSlice({
    name:'auth',
    initialState:{
        isAuthenticated:false,
        user:null,
        error:null,
        loading:false
    },
    reducers:{
        clearError : (state)=>{
            state.error = null;
        },
        logout : (state)=>{
            state.user = null
            state.isAuthenticated = false
        }
    },
    extraReducers : (builder)=> {
        builder
            .addCase(login.pending, (state)=>{
                state.loading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action)=>{
                state.loading = false
                state.user = action.payload
                state.isAuthenticated = true
            })
            .addCase(login.rejected, (state, action)=>{
                state.loading = false
                state.error = action.payload
            })
            .addCase(register.pending, (state)=>{
                state.loading = true
                state.error = null
            })
            .addCase(register.fulfilled, (state)=>{
                state.loading = false
            })
            .addCase(register.rejected, (state, action)=>{
                state.error = action.payload
                state.loading = false
            })
            .addCase(fetchUser.fulfilled, (state, action)=>{
                state.isAuthenticated = true
                state.user = action.payload
            })
            .addCase(fetchUser.rejected, (state)=>{
                state.isAuthenticated = false
                state.user = null
            })
    }
})

export const { clearError, logout } = authSlice.actions;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export default authSlice.reducer;