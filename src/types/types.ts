export interface ServerData {
  id: string;
  name: string;
  icon: string | null;
  iconURL: string | null;
  memberCount: number;
}

export interface MemberData {
  user_id: string;
  username: string;
  nickname: string | null;
  globalName: string;
  avatar_url: string;
  roles: {
    role_id: string;
    name: string;
    position: number;
    color: string;
  }[];
}
