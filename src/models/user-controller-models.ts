export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    userId: string;
    userDisplayName: string;
    userRoleName: string;
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
    _id: string;
    displayName: string;
    roleName: string;
    email: string;
}

export interface UserDetailsResponse {
    _id: string;
    displayName: string;
    roleName: string;
    email: string;
    games?: UserDetailsGameInfo[];
}

export interface UserDetailsGameInfo {
    _id: string;
    gameDefinitionName: string;
    info: string;
    isWinner: boolean|null;
}

export interface PutUserRequest {
    displayName: string;
}

export interface PutUserResponse {
    _id: string;
    displayName: string;
    email: string;
}


export interface DeleteUserResponse {
    _id: string;
    displayName: string;
    email: string;
}