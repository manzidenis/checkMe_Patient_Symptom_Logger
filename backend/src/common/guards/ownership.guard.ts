import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

// PATIENT users can only access routes where :id matches their own patientId
// CLINICIAN users pass through automatically
@Injectable()
export class OwnershipGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const paramId = request.params.id;

        if (user.role === 'CLINICIAN') {
            return true;
        }

        if (user.role === 'PATIENT' && user.patientId !== paramId) {
            throw new ForbiddenException('You can only access your own patient data');
        }

        return true;
    }
}
