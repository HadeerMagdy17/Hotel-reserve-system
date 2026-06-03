
export interface IBookingUser {
  _id: string;
  userName: string;
}

export interface IBookingRoom {
  _id: string;
  roomNumber: string;
}

export interface IBooking {
  _id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  user: IBookingUser;
  room: IBookingRoom | null; // بيقبل null لحماية الكود بناءً على داتا بوستمان
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface IBookingsResponse {
  booking: IBooking[];
  totalCount: number;
}