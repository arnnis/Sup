export interface PaginationResult {
  has_more: boolean;
  pin_count: number;
  response_metadata: {
    next_cursor: string;
  };
}

export interface User {
  id: string;
  name: string;
  online?: boolean;
  real_name: string;
  tz: string;
  tz_label: string;
  is_admin: boolean;
  is_owner: boolean;
  is_primary_owner: boolean;
  is_restricted: boolean;
  is_ultra_restricted: boolean;
  is_bot: boolean;
  color: string;
  profile: {
    avatar_hash: string;
    status_text: string;
    status_emoji: string;
    real_name: string;
    display_name: string;
    real_name_normalized: string;
    display_name_normalized: string;
    email?: string;
    image_24: string;
    image_32: string;
    image_48: string;
    image_72: string;
    image_192: string;
    image_512: string;
    team: string;
    title: string;
  };
  updated: number;
  is_app_user: boolean;
  has_2fa: boolean;
  deleted: boolean;
  presence: string;
}

export interface Team {
  domain: string;
  email_domain: string;
  icon: {
    image_34: string;
    image_44: string;
    image_68: string;
    image_88: string;
    image_102: string;
    image_132: string;
    image_230: string;
    image_default: true;
  };

  id: string;
  name: string;
}

export type ChatType = 'im' | 'group';

export interface Chat {
  dm_count: number;
  id: string;
  is_ext_shared: boolean;
  is_im: boolean;
  is_open: boolean;
  is_starred: boolean;
  name: string;
  user_id: string;

  // channel and group
  is_archived: boolean;
  is_member: boolean;
  is_mpim: boolean;
  is_muted: boolean;
  is_pending_ext_shared: boolean;
  is_private: boolean;
  mention_count: number;
  mention_count_display: number;
  name_normalized: string;
  unread_count: number;
  unread_count_display: number;
}

export interface Message {
  type: 'message';
  subtype?: MessageSubType;
  hidden?: boolean; // Some subtypes have a special hidden property. These indicate messages that are part of the history of a channel but should not be displayed to user
  user: string;
  text: string;
  ts: string;
  edited?: {
    user: string;
    ts: string;
  };
  deleted_ts?: string;
  event_ts?: string;
  is_starred?: boolean;
  pinned_to?: string[];
  reactions?: MessageReaction[];
  files?: MessageAttachement[];
}

export type MessageSubType =
  | 'bot_message'
  | 'channel_archive'
  | 'channel_join'
  | 'channel_leave'
  | 'channel_name'
  | 'channel_purpose'
  | 'channel_topic'
  | 'channel_unarchive'
  | 'ekm_access_denied'
  | 'file_comment'
  | 'file_mention'
  | 'file_share'
  | 'group_archive'
  | 'group_join'
  | 'group_leave'
  | 'group_name'
  | 'group_purpose'
  | 'group_topic'
  | 'group_unarchive'
  | 'me_message'
  | 'message_changed'
  | 'message_deleted'
  | 'message_replied'
  | 'pinned_item'
  | 'reply_broadcast'
  | 'thread_broadcast'
  | 'unpinned_item';

export interface MessageReaction {
  name: string;
  count: number;
  users: string[];
}

export interface MessageAttachement {
  name: string;
  fallback: string;
  color: string;
  pretext: string;
  author_name: string;
  author_link: string;
  author_icon: string;
  title: string;
  title_link: string;
  text: string;
  fields: AttachmentField[];
  image_url: string;
  thumb_64: string;
  thumb_80: string;
  thumb_160: string;
  thumb_360: string;
  footer: string;
  mimetype: string;
  url_private_download: string;
  url_private: string;
  footer_icon: string;
  ts: number;
  permalink: string;
  size: number;
  filetype: string;
  id: string;
  created: number;
  timestamp: number;
  pretty_type: string;
  user: string;
  editable: boolean;
  mode: string;
  is_external: boolean;
  external_type: string;
  is_public: boolean;
  public_url_shared: boolean;
  display_as_bot: boolean;
  username: string;
  thumb_360_w: number;
  thumb_360_h: number;
  thumb_360_gif: string;
  image_exif_rotation: number;
  original_w: number;
  original_h: number;
  deanimate_gif: string;
  pjpeg: string;
  permalink_public: string;
  channels: string[];
  groups: string[];
  ims: string[];
  comments_count: number;
}

interface AttachmentField {
  title: string;
  value: string;
  short: boolean;
}

export type MessageInput = SocketMessageResult & {
  id?: number;
  type: 'message' | 'ping';
  channel?: string;
  text?: string;
};

export interface SocketMessageResult {
  ok?: boolean;
  reply_to?: number;
  ts?: string;
}

export type PendingMessage = MessageInput;
