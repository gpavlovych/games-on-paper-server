export interface CreateGameRequest {
    gameDefinition: string;
    users: string[];
    winner: string;
    stats: any;
    data: any;
}

export interface CreateGameResponse{
    _id: string;
}

export interface GameInfoGameDefinition {
    _id: string;
    displayName: string;
}

export interface GameInfoUser {
    _id: string;
    displayName: string;
}

export interface GameInfo {
    _id: string;
    gameDefinition: GameInfoGameDefinition;
    users?: GameInfoUser[];
    winner?: GameInfoUser;
    stats?: any;
}

export interface GameDetailsResponseUser{
    _id: string;
    displayName: string;
}

export interface GameDetailsResponseGameDefinition{
    _id: string;
    displayName: string;
    description: string;
}

export interface GameDetailsResponse {
    _id: string;
    gameDefinition: GameDetailsResponseGameDefinition;
    users?: GameDetailsResponseUser[];
    winner?: GameDetailsResponseUser;
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
    _id: string;
    gameDefinition: string;
    users: string[];
    winner: string;
    stats: any;
    data: any;
}

export interface UpdateGameResponse {
    _id: string;
    gameDefinition: string;
    users: string[];
    winner: string;
    stats: any;
    data: any;
}

export interface DeleteGameResponse {
    _id: string;
    gameDefinition: string;
    users: string[];
    winner: string;
    stats: any;
    data: any;
}