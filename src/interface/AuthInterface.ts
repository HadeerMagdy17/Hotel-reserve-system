export interface IUser {
  _id: string;
  email: string;
  userName: string;
  role: "admin" | "user"; // عشان نحدد الأدوار المسموحة بس
}

export interface ILoginInputs {
  email: string;
  password: string;
}

export interface ILoginResponse {
  message: string;
  data: {
    token: string;
    user: IUser;
  };
}
// **************
export interface IForgotPasswordInputs {
  email: string;
}

export interface IForgotPasswordResponse {
  success: boolean;
  message: string;
  data: null;
}
// ******************

export interface IResetPasswordInputs {
  email: string;
  password: string;
  confirmPassword: string;
  seed: string; // الـ OTP كود
}

export interface IResetPasswordResponse {
  success: boolean;
  message: string;
  data: any;
}
// +++++++++++++++
export interface IRegisterInputs {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  country: string;
  role: string;
  profileImage?: FileList; // لأن مكتبة react-hook-form بتجيب الصورة كـ FileList
}
// ----------------
export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}