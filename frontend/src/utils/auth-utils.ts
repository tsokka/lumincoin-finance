import config from "../config/config";
import type {RefreshTokensResponse, User} from "../types/auth.types";

export class AuthUtils {
    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userInfoTokenKey: string = 'userInfo';

    public static setAuthInfo(
        accessToken: string | null,
        refreshToken: string | null,
        userInfo: User | null = null
    ): void {
        localStorage.setItem(this.accessTokenKey, accessToken ?? '');
        localStorage.setItem(this.refreshTokenKey, refreshToken ?? '');
        localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
    }

    public static removeAuthInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }

    public static getAuthInfo(key: string): string | null {
        if ([this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return localStorage.getItem(key);
        }
        return null;
    }

    // {
    //         [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
    //         [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
    //         [this.userInfoTokenKey]: localStorage.getItem(this.userInfoTokenKey)
    //     } as AuthInfoFull;
    // }

    public static async updateRefreshToken(): Promise<boolean> {
        let result = false;

        const refreshToken: string | null = this.getAuthInfo(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const tokens: RefreshTokensResponse = await response.json();

                if (tokens && !tokens.error && tokens.tokens) {
                    const existingUserInfo: string | null = this.getAuthInfo(this.userInfoTokenKey);
                    const userInfo: User | null = existingUserInfo ? JSON.parse(existingUserInfo) : null;

                    this.setAuthInfo(tokens.tokens.accessToken, tokens.tokens.refreshToken, userInfo);
                    result = true;
                }
            }
        }

        if (!result) {
            this.removeAuthInfo();
        }

        return result;
    }
}
