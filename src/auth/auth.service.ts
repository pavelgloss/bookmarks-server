import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {

    validateUser(username: string, password: string): boolean {
        return username === 'pavel' && password === 'pavel';
    }
}