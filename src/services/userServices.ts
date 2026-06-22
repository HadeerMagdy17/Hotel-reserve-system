import { axiosInstance } from "../api/axiosInstace";
import { getRoomDetails, PORTAL_URLS } from "../api/endpoints";
import type { IRoomsResponse , FavoritesResponseType, FavoriType} from "../interface/userTypes";

export const fetchExploreRooms = async (page: number): Promise<IRoomsResponse> => {
  const response = await axiosInstance.get(getRoomDetails, {
    params: {
      page: page,
      size: 8,
    },
  });
  return {
    rooms: response.data.data.rooms,
    totalCount: response.data.data.totalCount,
  };
};

export const fetchFavoriteRooms = async (): Promise<FavoriType[]> => {
  const response = await axiosInstance.get<FavoritesResponseType>(PORTAL_URLS.favoriRoom);
  return response.data.data.favoriteRooms || [];
};


// 3. إضافة أو حذف غرفة من المفضلة
export const toggleFavoriteRoom = async ({ roomId, isFav }: { roomId: string; isFav: boolean }) => {
  if (!isFav) {
    return await axiosInstance.post(PORTAL_URLS.favoriRoom, { roomId });
  } else {
    return await axiosInstance.delete(`${PORTAL_URLS.favoriRoom}/${roomId}`, {
      data: { roomId },
    });
  }
};