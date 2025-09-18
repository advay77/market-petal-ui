import { post } from '../lib/http';
import { BASEURL } from '../lib/http';
import { User } from '../types/user';

interface APIUser {
  id: string;
  name: string;
  email: string;
  role: 'main-admin' | 'partner-admin';
  avatarUrl?: string;
}

// Convert API user response to frontend User type
const convertApiUserToUser = (apiUser: APIUser): User => {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.role,
    avatar: apiUser.avatarUrl,
    preferences: {
      theme: 'dark',
      layout: 'modern',
      notifications: {
        email: true,
        push: true,
        marketing: false,
      },
    },
  };
};

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: 'main-admin' | 'partner-admin';
  companyName?: string;
}

export interface SigninPayload {
  email: string;
  password: string;
  userType: 'admin' | 'partner';
}

export const signupApi = async (payload: SignupPayload) => {
  try {
    const data = await post(`${BASEURL}/auth/signup`, payload);
    const token = data.data.accessToken;
    localStorage.setItem("jwt-token", token);
    const apiUser = data.data.user as APIUser;
    const user = convertApiUserToUser(apiUser);
    return [user, null] as [User, null];
  } catch (err) {
    return [null, err] as [null, Error];
  }
};

export const signinApi = async (payload: SigninPayload) => {
  try {
    const data = await post(`${BASEURL}/auth/signin`, payload);
    const token = data.data.accessToken;
    localStorage.setItem("jwt-token", token);
    const apiUser = data.data.user as APIUser;
    const user = convertApiUserToUser(apiUser);
    return [user, null] as [User, null];
  } catch (err) {
    return [null, err] as [null, Error];
  }
};

export const signoutApi = async () => {
  try {
    await post(`${BASEURL}/auth/signout`);
    localStorage.removeItem("jwt-token");
    return [true, null] as [boolean, null];
  } catch (err) {
    return [null, err] as [null, Error];
  }
};

export const refreshTokenApi = async () => {
  try {
    const data = await post(`${BASEURL}/auth/refresh-token`);
    const token = data.data.accessToken;
    localStorage.setItem("jwt-token", token);
    const apiUser = data.data.user as APIUser;
    const user = convertApiUserToUser(apiUser);
    return [user, null] as [User, null];
  } catch (err) {
    return [null, err] as [null, Error];
  }
};
