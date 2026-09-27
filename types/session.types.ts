import type { IronSessionData } from 'iron-session';

export interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: string;
  roleId: number;
  isAdmin: boolean;
}

declare module 'iron-session' {
  interface IronSessionData {
    user?: SessionUser;
  }
}

export type { IronSessionData };
