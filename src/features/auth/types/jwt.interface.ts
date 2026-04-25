import { JWTPayload } from 'jose';

export interface Payload extends JWTPayload {
  sub: string;
  email: string;
}
