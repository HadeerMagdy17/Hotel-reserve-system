import { axiosInstance } from "../api/axiosInstace"; 
import type { IBookingsResponse } from "../interface/Booking";


export const fetchBookingsList = async (page: number, size: number): Promise<IBookingsResponse> => {
  const response = await axiosInstance.get(`/admin/booking`, {
    params: { page, size },
  });
  return response.data.data;
};



export const deleteBooking = async (id: string): Promise<any> => {
  const response = await axiosInstance.delete(`/admin/booking/${id}`);
  return response.data;
};