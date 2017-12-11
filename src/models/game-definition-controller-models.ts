export interface GameDefinitionInfo {
    _id: string;
    pictureUrl?: string;
    displayName: string;
    description: string;
}

export interface GameDefinitionDetails {
    _id: string;
    pictureUrl?: string;
    displayName: string;
    description: string;
}

export interface UpdateGameDefinitionRequest {
    pictureUrl?: string;
    displayName: string;
    description: string;
}

export interface UpdateGameDefinitionResponse {
    _id: string;
    pictureUrl?: string;
    displayName: string;
    description: string;
}