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
// ***********one room details by id ***************
export const fetchRoomDetails = async (id: string) => {
  const response = await axiosInstance.get(`/portal/rooms/${id}`);
  console.log(response?.data?.data?.room)
  return response?.data?.data?.room; // بنقرأ الـ room مباشرة جوه data
};

export const fetchRoomReviews = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/portal/room-reviews/${id}`);
    // بنرجع الـ reviews لو موجودة، لو مش موجودة بنرجع مصفوفة فاضية
    return response.data.data.roomReviews || response.data.data.reviews || [];
  } catch (error) {
    console.error("Error fetching reviews, returning empty array:", error);
    return []; // خط دفاع: لو ريكويست الريفيو فشل لأي سبب، الصفحة هتفتح برضه بس الكومنتات هتبقى فاضية
  }
};

// 1. واجهة البيانات الخاصة بالـ Review
interface PostReviewData {
  roomId: string | undefined;
  rating: number | null;
  review: string;
}

// 2. واجهة البيانات الخاصة بالـ Comment
interface PostCommentData {
  roomId: string | undefined;
  comment: string;
}

/**
 * func إرسال تقييم جديد لغرفة معينة
 */
export const postRoomReview = async (reviewData: PostReviewData) => {
  const response = await axiosInstance.post("/portal/room-reviews", reviewData);
  return response.data;
};

/**
 * func إرسال تعليق جديد لغرفة معينة
 */
export const postRoomComment = async (commentData: PostCommentData) => {
  const response = await axiosInstance.post("/portal/room-comments", commentData);
  return response.data;
};