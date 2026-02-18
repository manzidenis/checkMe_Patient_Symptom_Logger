import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
    sub: string;
    role: string;
    patientId: string | null;
}

// Extracts and validates JWT from Authorization header, attaches payload to request.user
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'symptom-logger-jwt-secret',
        });
    }

    validate(payload: JwtPayload) {
        return {
            userId: payload.sub,
            role: payload.role,
            patientId: payload.patientId,
        };
    }
}
