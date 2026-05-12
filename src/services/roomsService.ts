import { axiosInstance } from "../api/axiosInstace"


export const fetchRoomsList=async(page:number ,size: number)=>{
    const response=await axiosInstance.get(`/admin/rooms`,{
        params:{page,size}
    });
    return response?.data?.data

}
// ********delete room***************
export const deleteRoom = async (roomId: string) => {
  
  const response = await axiosInstance.delete(`/admin/rooms/${roomId}`);
  return response.data;
};