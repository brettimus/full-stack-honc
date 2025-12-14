import type { createAuth } from '../auth';

export type AuthUser = ReturnType<
  typeof createAuth
>['$Infer']['Session']['user'];
export type AuthSession = ReturnType<typeof createAuth>['$Infer']['Session'];
