export interface IRoom {
  _id: string;
  roomNumber: string;
  images: string[]; 
  price: number;
  description: string;
  capacity: number;
  facilities: IFacility[]; 
  createdAt: string;
}

export interface IFacility {
  _id: string;
  name: string;
}