import type { AuthSession, AuthUser } from './lib/auth/types';

export type HonoAppType = {
  Bindings: Cloudflare.Env;
  Variables: {
    user: AuthUser | null;
    session: AuthSession | null;
  };
};
