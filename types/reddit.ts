export interface RedditResponse {
  kind: string;
  data: {
    after: string;
    dist: number;
    modhash: string;
    children: Children[];
  };
}

interface Children {
  kind: string;
  data: Entry;
}

interface Entry {
  approved_at_utc?: Date;
  subreddit: string;
  selftext: string;
  author_fullname: string;
  saved: boolean;
  mod_reason_title?: string;
  gilded: number;
  clicked: boolean;
  title: string;
  link_flair_richtext: Linkflairrichtext[];
  subreddit_name_prefixed: string;
  hidden: boolean;
  pwls?: number;
  link_flair_css_class?: string;
  downs: number;
  thumbnail_height?: number;
  hide_score: boolean;
  name: string;
  quarantine: boolean;
  link_flair_text_color: string;
  author_flair_background_color?: string;
  subreddit_type: string;
  ups: number;
  total_awards_received: number;
  media_embed: Mediaembed;
  thumbnail_width?: number;
  author_flair_template_id?: string;
  is_original_content: boolean;
  user_reports: any[];
  secure_media?: Securemedia;
  is_reddit_media_domain: boolean;
  is_meta: boolean;
  category?: any;
  secure_media_embed: Mediaembed;
  link_flair_text?: string;
  can_mod_post: boolean;
  score: number;
  approved_by?: any;
  thumbnail: string;
  edited: boolean;
  author_flair_css_class?: string;
  author_flair_richtext: any[];
  gildings: Gildings;
  post_hint?: string;
  content_categories?: string[];
  is_self: boolean;
  mod_note?: any;
  created: number;
  link_flair_type: string;
  wls?: number;
  banned_by?: any;
  author_flair_type: string;
  domain: string;
  allow_live_comments: boolean;
  selftext_html?: any;
  likes?: any;
  suggested_sort?: string;
  banned_at_utc?: any;
  view_count?: any;
  archived: boolean;
  no_follow: boolean;
  is_crosspostable: boolean;
  pinned: boolean;
  over_18: boolean;
  preview?: Preview;
  all_awardings: Allawarding[];
  media_only: boolean;
  can_gild: boolean;
  spoiler: boolean;
  locked: boolean;
  author_flair_text?: string;
  visited: boolean;
  num_reports?: any;
  distinguished?: any;
  subreddit_id: string;
  mod_reason_by?: any;
  removal_reason?: any;
  link_flair_background_color: string;
  id: string;
  is_robot_indexable: boolean;
  report_reasons?: any;
  author: string;
  num_crossposts: number;
  num_comments: number;
  send_replies: boolean;
  whitelist_status?: string;
  contest_mode: boolean;
  mod_reports: any[];
  author_patreon_flair: boolean;
  author_flair_text_color?: string;
  permalink: string;
  parent_whitelist_status?: string;
  stickied: boolean;
  url: string;
  subreddit_subscribers: number;
  created_utc: number;
  discussion_type?: any;
  media?: Securemedia;
  is_video: boolean;
  link_flair_template_id?: string;
}

interface Allawarding {
  is_enabled: boolean;
  count: number;
  subreddit_id?: any;
  description: string;
  coin_reward: number;
  icon_width: number;
  icon_url: string;
  days_of_premium: number;
  id: string;
  icon_height: number;
  resized_icons: Source[];
  days_of_drip_extension: number;
  award_type: string;
  coin_price: number;
  subreddit_coin_reward: number;
  name: string;
}

interface Preview {
  images: Image[];
  enabled: boolean;
  reddit_video_preview?: Redditvideo;
}

interface Image {
  source: Source;
  resolutions: Source[];
  variants: Variants;
  id: string;
}

interface Variants {
  gif?: Gif;
  mp4?: Gif;
}

interface Gif {
  source: Source;
  resolutions: Source[];
}

interface Source {
  url: string;
  width: number;
  height: number;
}

interface Gildings {
  gid_1?: number;
  gid_2?: number;
  gid_3?: number;
}

interface Securemedia {
  reddit_video: Redditvideo;
}

interface Redditvideo {
  fallback_url: string;
  height: number;
  width: number;
  scrubber_media_url: string;
  dash_url: string;
  duration: number;
  hls_url: string;
  is_gif: boolean;
  transcoding_status: string;
}

interface Mediaembed {}

interface Linkflairrichtext {
  e: string;
  t: string;
}
