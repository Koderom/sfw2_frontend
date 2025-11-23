import { UserDto } from "./user.dto";

export interface LoginDto{
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    usuario: UserDto
}