// src/interface/ads.ts

export interface IAdRoom {
  _id: string;
  roomNumber: string;
  price: number;
  capacity: number;
  discount: number;
  facilities: string[];
  images: string[];
}

export interface IAdCreator {
  _id: string;
  userName: string;
}

export interface IAd {
  _id: string;
  isActive: boolean;
  room: IAdRoom; 
  createdBy: IAdCreator;
  createdAt: string;
  updatedAt: string;
}

// الـ Payload المطلوب عند الإضافة أو التعديل
export interface IAdPayload {
  room: string;       // الـ ID بتاع الغرفة كـ string
  isActive: boolean;
}

export interface IAdsResponse {
  ads: IAd[];
  totalCount: number;
}