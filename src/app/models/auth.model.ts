export interface AuthToken {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
}

export const MapAuthToken = (data: any): AuthToken => {
    return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + data.expires_at * 1000,
    };
};
