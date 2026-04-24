/**
 * Tập trung tất cả localStorage / sessionStorage keys
 * Dùng các hằng này thay vì string literal rải rác trong codebase.
 */
export const STORAGE_KEYS = {
  /** Trạng thái chính của app (student, progress, practiceSets, answers) */
  APP_STATE: 'hhk_app_state',
  /** Tổng XP của học sinh */
  XP: 'hhk_xp',
  /** ID theme đang chọn */
  THEME: 'hhk-theme',
  /** Emoji avatar đang trang bị */
  AVATAR_EMOJI: 'hhk_avatar_emoji',
  /** Danh sách huy hiệu đã mở khoá */
  ACHIEVEMENTS: 'hhk_achievements',
  /** Thẻ ghi nhớ trong Memory Room */
  MEMORY_CARDS: 'hhk_memory_cards',
  /** Danh sách item đã mua trong Avatar Shop */
  SHOP_PURCHASED: 'hhk_shop_purchased',
  /** Item đang trang bị trong Avatar Shop */
  SHOP_EQUIPPED: 'hhk_shop_equipped',
  /** Trạng thái Daily Challenge */
  DAILY_CHALLENGE: 'hhk_daily_challenge',
  /** Cài đặt AI chat (provider, model, apiKey, link mua API) */
  AI_CHAT_SETTINGS: 'hhk_ai_chat_settings',
} as const;

export const SESSION_KEYS = {
  /** Flag admin đã unlock trong session hiện tại */
  ADMIN_UNLOCKED: 'hhk_admin_unlocked',
} as const;

/** Danh sách tất cả keys thuộc về một profile học sinh */
export const PROFILE_KEYS: ReadonlyArray<keyof typeof STORAGE_KEYS> = [
  'APP_STATE',
  'XP',
  'ACHIEVEMENTS',
  'MEMORY_CARDS',
  'SHOP_PURCHASED',
  'SHOP_EQUIPPED',
  'DAILY_CHALLENGE',
];
