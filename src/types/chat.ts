import { UIMessage } from "@ai-sdk/react";

export interface User {
  readonly id?: string;
  readonly cookie_id: string;
  readonly category?: string;
  readonly created_at?: string;
}

export interface Session {
  readonly id: string;
  readonly name: string;
  readonly latest_turn_number: number;
  readonly created_at: string;
  readonly updated_at: string;
  readonly starred: boolean;
}

export interface SessionsResponse {
  readonly count: number;
  readonly total_count: number;
  readonly page: number;
  readonly page_size: number;
  readonly total_pages: number;
  readonly has_next: boolean;
  readonly has_previous: boolean;
  readonly results: readonly Session[];
}

export interface Message extends UIMessage {
  readonly turn_number: number;
  readonly feedback: 'liked' | 'disliked' | null;
  readonly created_at: string;
}

export interface MessagesResponse {
  readonly count: number;
  readonly total_count: number;
  readonly page: number;
  readonly page_size: number;
  readonly total_pages: number;
  readonly has_next: boolean;
  readonly has_previous: boolean;
  readonly results: readonly Message[];
}
