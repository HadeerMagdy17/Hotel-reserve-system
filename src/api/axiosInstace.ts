// import axios from 'axios'

// export const axiosInstance =axios.create({
//     baseURL: "https://upskilling-egypt.com:3000/api/v0",
// });

// axiosInstance.interceptors.request.use((config)=>{
//     const token=localStorage.getItem('token')
//     if(token){
//         config.headers.Authorization =token
//     }
//     return config
// });
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) =>{
//         if(error.response?.status === 401){
//             localStorage.clear();
//             window.location.href ='/auth/login'
//         }
//         return Promise.reject(error)
//     }
// )
import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: "https://upskilling-egypt.com:3000/api/v0",
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = token
    }
    return config
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // 🚨 تعديل ذكي: لو الريكويست اللي فشل كان رايح لتفاصيل الغرفة أو الريفيوهات، متطردش المستخدم!
        const url = error.config?.url || "";
        const isPublicEndpoint = url.includes("/portal/rooms") || url.includes("/portal/room-reviews");

        if (error.response?.status === 401) {
            if (isPublicEndpoint) {
                // سيبه يكمل عادي وميعملش حظر أو تحويل، عشان الـ Front-end يعرض الرسايل والمودال بمزاجه
                return Promise.reject(error);
            }

            // لو أي endpoint تانية محمية وجابت 401، اطرده عادي للـ login
            localStorage.clear();
            window.location.href = '/auth/login';
        }
        return Promise.reject(error)
    }
);