import axios from 'axios'

export const axiosInstance =axios.create({
    baseURL: "https://upskilling-egypt.com:3000/api/v0",
});

axiosInstance.interceptors.request.use((config)=>{
    const token=localStorage.getItem('token')
    if(token){
        config.headers.Authorization =token
    }
    return config
});