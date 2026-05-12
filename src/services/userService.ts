import { axiosInstance } from "../api/axiosInstace"


export const fetchUsersList=async(page:number ,size: number)=>{
    const response=await axiosInstance.get(`/admin/users`,{
        params:{page,size}
    });
    return response?.data?.data

}