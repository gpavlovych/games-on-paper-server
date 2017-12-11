export interface CreateGameRequest {
    userIds: string[];
    winnerId: string;
    stats: any;
    data: any;
}

export interface CreateGameResponse{
    _id: string;
}

export interface GameInfo {
    _id: string;
    userIds?: string[];
    winnerId?: string|null;
    stats?: any;
    data?: any;
}

export interface GameDetailsResponse {
    _id: string;
    userIds?: string[];
    winnerId?: string|null;
    stats?: any;
    data?: any;
}

export interface InviteGameRequest {

}

export interface InviteGameResponse {

}

export interface AcceptGameRequest {

}

export interface AcceptGameResponse {

}

export interface DeclineGameRequest {

}

export interface DeclineGameResponse {

}

export interface UpdateGameRequest {

}

export interface UpdateGameResponse {

}

export interface DeleteGameResponse {

}