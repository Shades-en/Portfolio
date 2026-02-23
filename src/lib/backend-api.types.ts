export interface GenerateNameParams {
  readonly cookieId: string;
  readonly query?: string;
  readonly sessionId?: string;
  readonly turnsBetweenChatName?: number;
  readonly maxChatNameLength?: number;
  readonly maxChatNameWords?: number;
}

export interface GenerateNameResponse {
  readonly name: string;
  readonly session_id: string | null;
}
