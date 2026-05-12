import { axiosInstance } from "../api/axiosInstace"


export const fetchRoomsList=async(page:number ,size: number)=>{
    const response=await axiosInstance.get(`/admin/rooms`,{
        params:{page,size}
    });
    return response?.data?.data

}