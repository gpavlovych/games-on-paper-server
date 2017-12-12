export interface CreateGameRequest {
    gameDefinition: string;
    invitedUsers: string[];
    acceptedUsers: string[];
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
    invitedUsers?: GameInfoUser[];
    acceptedUsers?: GameInfoUser[];
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
    invitedUsers?: GameInfoUser[];
    acceptedUsers?: GameInfoUser[];
    winner?: GameInfoUser;
    stats?: any;
    data?: any;
}

export interface InviteGameRequest {
    users: string[];
    gameDefinition: string;
}

export interface UpdateGameRequest {
    _id: string;
    gameDefinition: string;
    invitedUsers?: string[];
    acceptedUsers?: string[];
    winner?: string;
    stats?: any;
    data?: any;
}

export interface UpdateGameResponse {
    _id: string;
    gameDefinition: GameInfoGameDefinition;
    invitedUsers?: GameInfoUser[];
    acceptedUsers?: GameInfoUser[];
    winner?: GameInfoUser;
    stats?: any;
    data?: any;
}

export interface DeleteGameResponse {
    _id: string;
    gameDefinition: GameInfoGameDefinition;
    invitedUsers?: GameInfoUser[];
    acceptedUsers?: GameInfoUser[];
    winner?: GameInfoUser;
    stats?: any;
    data?: any;
}