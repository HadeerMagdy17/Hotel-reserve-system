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
//3.add
export const addFacility = async (name: string) => {
  const response = await axiosInstance.post("/admin/room-facilities", { name });
  return response.data;
};

// 4. edit
export const updateFacility = async (id: string, name: string) => {
  const response = await axiosInstance.put(`/admin/room-facilities/${id}`, { name });
  return response.data;
};