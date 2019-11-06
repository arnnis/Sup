export interface MessageEvent {
  type: 'message';
  channel: string;
  user: string;
  text: string;
  ts: string;
}

export interface UserTypingEvent {
  type: 'user_typing';
  channel: string;
  user: string;
}

export interface ChatMarkedEvent {
  type: 'im_marked' | 'channel_marked' | 'group_marked';
  channel: string;
  ts: string;
  dm_count?: number;
  unread_count_display: number;
}

export interface ReactionAddedEvent {
  type: 'reaction_added';
  user: string;
  reaction: string;
  item_user: string;
  item: {
    type: 'message';
    channel: string;
    ts: string;
  };
  event_ts: string;
}

export interface ReactionRemovedEvent {
  type: 'reaction_removed';
  user: string;
  reaction: string;
  item_user: string;
  item: {
    type: 'message';
    channel: string;
    ts: string;
  };
  event_ts: string;
}
