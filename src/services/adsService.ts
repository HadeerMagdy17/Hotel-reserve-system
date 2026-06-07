import { axiosInstance } from "../api/axiosInstace"; 
import type { IAdPayload, IAdsResponse } from "../interface/Ads";


// 1. get all
export const fetchAdsList = async (page: number, size: number): Promise<IAdsResponse> => {
  const response = await axiosInstance.get(`/admin/ads`, {
    params: { page, size },
  });
  return response.data.data;
};

// 2.  create  
export const createAd = async (payload: IAdPayload): Promise<any> => {
  const response = await axiosInstance.post(`/admin/ads`, payload);
  return response.data;
};

// 3.  update
export const updateAd = async (id: string, payload: IAdPayload): Promise<any> => {
  const response = await axiosInstance.put(`/admin/ads/${id}`, payload);
  return response.data;
};

// 4. delete
export const deleteAd = async (id: string): Promise<any> => {
  const response = await axiosInstance.delete(`/admin/ads/${id}`);
  return response.data;
};