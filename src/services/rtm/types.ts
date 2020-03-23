export interface MessageEvent {
  type: 'message';
  channel: string;
  user: string;
  text: string;
  ts: string;
  thread_ts?: string;
}

export interface NotificationEvent {
  type: 'desktop_notification';
  avatarImage: string;
  channel: string;
  content: string;
  event_ts: string;
  imageUri: string | null;
  is_channel_invite: boolean;
  is_shared: boolean;
  launchUri: string;
  msg: string;
  ssbFilename: string;
  subtitle: string;
  title: string;
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

export interface PresencesQueryRequest {
  type: 'presence_query';
  ids: string[];
}

export interface PresenceSubscribeRequest {
  type: 'presence_sub';
  ids: string[];
}

export interface PresenceChangeEvent {
  type: 'presence_change';
  presence: 'away' | 'active';

  user: string;
}

export interface MessageReplyEvent {
  type: 'message';
  message: {
    type: 'message';
    user: string;
    text: string;
    thread_ts: string;
    reply_count: 1;
    replies: [
      {
        user: string;
        ts: string;
      },
    ];
    ts: string;
  };
  subtype: 'message_replied';
  hidden: true;
  channel: string;
  event_ts: string;
  ts: string;
}

export interface MessageDeletedEvent {
  type: string;
  subtype: string;
  hidden: boolean;
  deleted_ts: string;
  channel: string;
  previous_message: {
    type: string;
    text: string;
    user: string;
    ts: string;
    team: string;
  };
  event_ts: string;
  ts: string;
}
