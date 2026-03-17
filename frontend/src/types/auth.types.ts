export interface User {
    id: number;
    name: string;
    lastName: string;
    email: string;
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginResponse {
    tokens: Tokens;
    user: User;
}

export interface RefreshTokensResponse {
    error?: boolean;
    tokens?: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface SignUpResponse {
    user?: {
        email: string;
    };
    error?: boolean;
}
