/**
 * Client-side API functions for chat operations.
 * This file remains the stable public entrypoint.
 */

export { fetchUser } from './chat.user';

export {
  fetchSession,
  fetchSessions,
  fetchAllSessions,
  renameSession,
  toggleStarSession,
  deleteSession,
  deleteAllSessions,
  generateSessionName,
  cancelChatGeneration,
} from './chat.session';

export {
  fetchMessages,
  updateMessageFeedback,
} from './chat.message';

export type {
  GenerateNameParams,
  GenerateNameResponse,
} from './chat.types';
