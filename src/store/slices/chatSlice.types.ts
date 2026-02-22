import type { User, Session } from '@/types/chat';

export interface PendingSessionName {
  readonly sessionId: string;
  readonly name: string;
}

export interface ChatState {
  readonly user: User | null;
  readonly sessions: Session[];
  readonly sessionsCount: number;
  readonly currentSession: Session | null;
  readonly pendingSessionName: PendingSessionName | null;
  readonly isTablet: boolean;
  readonly isMobile: boolean;
  readonly sidebarCollapsed: boolean;
  readonly loading: {
    readonly user: boolean;
    readonly sessions: boolean;
    readonly messages: boolean;
    readonly currentSession: boolean;
  };
  readonly error: {
    readonly user: string | null;
    readonly sessions: string | null;
    readonly messages: string | null;
    readonly currentSession: string | null;
  };
  readonly pagination: {
    readonly sessions: {
      readonly page: number;
      readonly pageSize: number;
      readonly totalPages: number;
      readonly totalCount: number;
      readonly hasNext: boolean;
      readonly hasPrevious: boolean;
    };
    readonly messages: {
      readonly page: number;
      readonly pageSize: number;
      readonly totalPages: number;
      readonly totalCount: number;
      readonly hasNext: boolean;
      readonly hasPrevious: boolean;
    };
  };
}
