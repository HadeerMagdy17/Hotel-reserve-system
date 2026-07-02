export interface RoomType {
  _id: string;
  roomNumber: string;
  price: number;
  capacity?: number;
  discount?: number;
  images?: string[];
}

export interface IRoomsResponse {
  rooms: RoomType[];
  totalCount: number;
}

export interface FavoriType {
  _id: string;
  rooms: RoomType[]; 
  user: {
    _id: string;
    userName: string;
  };
}

export interface FavoritesResponseType {
  data: {
    favoriteRooms: FavoriType[];
    totalCount: number;
  };
}
// ************one room details*************
export interface IRoomDetails {
  _id: string;
  roomNumber: string;
  price: number;
  capacity: number;
  discount: number;
  facilities: string[]; // أو كائن لو السيرفر بيفكه، بناءً على الـ Postman هو راجع IDs حالياً
  images: string[];
  createdAt: string;
}

export interface IReview {
  _id: string;
  rating: number;
  comment: string;
  user: {
    _id: string;
    userName: string;
    email: string;
  };
}

export interface IRoomDetailsResponse {
  success: boolean;
  message: string;
  data: {
    room: IRoomDetails;
    reviews: IReview[];
  };
}