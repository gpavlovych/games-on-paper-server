export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    userId: string;
    userDisplayName:string;
    token: string;
    expiresInSeconds: number;
}

export interface RegisterRequest {
    displayName: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    userId: string;
}

export interface UserInfo {
    id: string;
    displayName: string;
    roleName: string;
    email: string;
}

export interface UserDetailsResponse {
    id: string;
    displayName: string;
    roleName: string;
    email: string;
    games: UserDetailsGameInfo[];
}

export interface UserDetailsGameInfo {
    id: string;
    gameDefinitionName: string;
    info: string;
    isWinner: boolean|null;
}

export interface PutUserRequest {
    displayName: string;
}

export interface PutUserResponse {
    id: string;
    displayName: string;
    email: string;
}


export interface DeleteUserResponse {
    id: string;
    displayName: string;
    email: string;
}