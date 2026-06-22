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