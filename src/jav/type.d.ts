// export declare const thing: number;
export interface UserInfo {
  id: number;
  username: string;
  hashpass: string;
  public_key: string;
  refresh_token: string;
  exp_refresh_token: number;
}

export interface QueryObject {
  text: string;
  values: (string | number)[];
}

export interface PayloadToken {
  id: number;
}

export interface NewTokenJWT {
  accessToken: string;
  refreshToken: string;
}

export type NewUser = [string, string];
