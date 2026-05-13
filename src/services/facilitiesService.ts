import { axiosInstance } from "../api/axiosInstace";
import type { IFacilitiesResponse } from "../interface/Facilities";

//get all facilities
export const fetchFacilitiesList = async (page: number, size: number): Promise<IFacilitiesResponse> => {
  const response = await axiosInstance.get("/admin/room-facilities", {
    params: { page, size }
  });
  return response.data.data; 
};

// 2. delete
export const deleteFacility = async (id: string) => {
  const response = await axiosInstance.delete(`/admin/room-facilities/${id}`);
  return response.data;
};