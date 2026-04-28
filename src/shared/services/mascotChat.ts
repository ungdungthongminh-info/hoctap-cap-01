/**
 * MASCOT CHAT — Hệ thống nhân vật trò chuyện theo rule
 * Mỗi mascot có tính cách riêng, nói chuyện khác nhau
 * Không cần AI runtime — template + rule engine
 *
 * 6 Mascots:
 * 🐬 Dopi  (ocean)  — vui vẻ, nghịch ngợm, hay dùng emoji biển
 * 🐰 Bông  (garden) — dịu dàng, nhẹ nhàng, hay khen
 * 🐻 Mochi (forest) — mạnh mẽ, khích lệ, hay dùng "cố lên!"
 * 🐱 Miu   (sunset) — tinh nghịch, hài hước, hay đùa
 * 🦉 Zizi  (galaxy) — thông thái, bí ẩn, hay nói sâu sắc
 * 🐶 Lucky (sunny)  — trung thành, nhiệt tình, hay chúc mừng
 */

// ==================== TYPES ====================

export type MascotId = 'Dopi' | 'Bông' | 'Mochi' | 'Miu' | 'Zizi' | 'Lucky';
export type ThemeId = 'ocean' | 'garden' | 'forest' | 'sunset' | 'galaxy' | 'sunny';
export type ChatContext =
  | 'greeting'         // chào buổi sáng/chiều/tối
  | 'lesson_start'     // bắt đầu bài học
  | 'correct_answer'   // trả lời đúng
  | 'wrong_answer'     // trả lời sai
  | 'streak_answer'    // đúng liên tiếp (3+)
  | 'perfect_score'    // 100 điểm
  | 'good_score'       // >= 70
  | 'low_score'        // < 50
  | 'encourage'        // động viên chung
  | 'weak_skill'       // yếu kỹ năng cụ thể
  | 'comeback'         // quay lại sau lâu
  | 'daily_challenge'  // thử thách hàng ngày
  | 'badge_earned'     // nhận huy hiệu
  | 'level_up'         // lên cấp
  | 'hint'             // gợi ý
  | 'review_remind'    // nhắc ôn bài
  | 'goodbye'          // tạm biệt
  | 'idle';            // không hoạt động

export interface MascotMessage {
  mascotId: MascotId;
  emoji: string;
  text: string;
  animation?: 'wave' | 'bounce' | 'shake' | 'sparkle' | 'dance';
}

export interface MascotPersonality {
  id: MascotId;
  themeId: ThemeId;
  emoji: string;
  trait: string;
  catchphrase: string;
  templates: Record<ChatContext, string[]>;
}

// ==================== MASCOT PERSONALITIES ====================

const mascots: MascotPersonality[] = [
  {
    id: 'Dopi',
    themeId: 'ocean',
    emoji: '🐬',
    trait: 'vui vẻ, nghịch',
    catchphrase: 'Ê ê bơi cùng Dopi nè!',
    templates: {
      greeting: [
        'Ê {name}! 🐬 Hôm nay học gì nè bạn ơiii!',
        'Nè nè {name}! Dopi nhớ bạn ghê lun á! 🐬💦',
        '{name} ơi! Mình đi "lặn" tìm bài học nha! 🌊🐬',
        'Yooo {name} đây rồi nè! Dopi chờ bạn hoài luôn á! 🐬',
      ],
      lesson_start: [
        'Ê bài "{lesson}" nè! Cùng lặn vô xem nha! 🤿',
        'OK {name}! Dopi bơi trước, bạn theo nha! 🐬➡️',
        'Bài mới nè bài mới! Dopi háo hức quá điiiii! 🐬🎉',
      ],
      correct_answer: [
        'ĐÚNG RỒIIII! 🐬 Dopi nhảy lên khỏi nước luôn nè!',
        'Woooo {name} giỏi ghê á! 🌊✨',
        'Bạn đúng luôn á! Giỏi như cá heo r! 🐬💡',
        'Yay! Đúng lun! *Dopi vẫy đuôi* 🐬',
        'Ê đúng nè đúng nè! {name} xịn quá! 🐬🔥',
      ],
      wrong_answer: [
        'Ấy sai rồi! Hông sao, Dopi cũng hay bơi lạc lắm 😄🐬',
        'Ối sai mất! Nhưng mà thử lại đi, từ từ mà! 💪🐬',
        'Hehe sai rồi nè! Để Dopi chỉ cho nghen! 🐬',
      ],
      streak_answer: [
        '🔥 {streak} câu đúng luôn nè! {name} bơi nhanh ghê á! 🐬💨',
        'Wowww {streak} câu! Bạn là siêu cá heo luôn r! 🐬⭐',
        '{streak} câu đúng! Dopi bị bỏ xa luôn á! 🐬😮',
      ],
      perfect_score: [
        '🎉 100 ĐIỂM Á! {name} là VUA ĐẠI DƯƠNG luôn nè! 👑🐬',
        'OAAAA! Full điểm luôn! Dopi ngưỡng mộ ghê! 🐬🎊',
        '💯 Trời ơi tuyệt đối luôn á! Biển cũng phải vỗ tay! 🌊👏',
      ],
      good_score: [
        'Ê giỏi đó nha! {score} điểm, sắp full luôn rồi! 🐬⭐',
        '{score} điểm! Lần sau bạn sẽ cao hơn nữa á Dopi tin! 🌊',
        'Ok phết đó {name}! Cố thêm xíu nữa là đỉnh lun! 🐬💪',
      ],
      low_score: [
        'Ơ chỉ {score} điểm thôi á! Nhưng mà hok sao, thử lại nha! 🐬',
        'Hehe {score} điểm, từ từ mà! Dopi cũng tập hoài mới bơi giỏi! 🐬',
        'Lần sau sẽ tốt hơn nha! Dopi chờ bạn ở đây! 🐬🌊',
      ],
      encourage: [
        'Ráng lên {name} ơi! Dopi ở đây với bạn nè! 🐬❤️',
        'Mỗi ngày mỗi giỏi hơn á, Dopi thấy luôn! 🌊💪',
        'Ê đừng bỏ cuộc nha! Mình cùng nhau học! 🐬',
      ],
      weak_skill: [
        '🐬 Nè {name}! Phần "{skill}" mình ôn lại nha, dễ mà!',
        'Ê cái "{skill}" hơi khó hả? Từ từ xem lại nha bạn! 🐬',
        'Nè "{skill}" là chỗ khó nè — nhưng mà mình giải đc mà! 🐬🪸',
      ],
      comeback: [
        '{name} ơi! {days} ngày r Dopi nhớ bạn quá trời! 🐬😢 Học tiếp nha!',
        'Bạn vô lại rồi nè! Dopi mừng ghê! 🐬🎉 Lâu quá á {days} ngày!',
        'Ê {name} quay lại rồi! Dopi chờ hoài luôn á! 🌊🐬',
      ],
      daily_challenge: [
        'Thử thách nè! Dopi cá bạn làm đc! 🐬🎯',
        'Ngày mới thử thách mới! Bơi cùng Dopi nha! 🌊',
        'Ê {name}! Challenge nè, sẵn sàng chưa? 🐬💪',
      ],
      badge_earned: [
        '🏅 OAAA! {name} được huy hiệu "{badge}"! Dopi ghen ghê! 🐬',
        'Nè nè huy hiệu mới nè! "{badge}" — bạn xứng đáng lắm! 🐬',
        'Ê ê "{badge}" luôn á! Bọt biển cũng phải chúc mừng! 🫧🐬',
      ],
      level_up: [
        '⬆️ LÊN CẤP NÈ! {name} giờ Level {level} r á! 🐬🎊',
        'Level {level} luôn! Bạn thành SIÊU CÁ HEO r! 🐬✨',
        'Cấp {level} rồi nè! Mỗi ngày mỗi mạnh hơn! 🐬💪',
      ],
      hint: [
        '💡 Nè Dopi mách nhỏ: {hint}',
        '🐬 Ê ê! Để Dopi gợi ý nha: {hint}',
        'Nghĩ kỹ nha bạn! Dopi nhắc nè: {hint} 💡🐬',
      ],
      review_remind: [
        '📚 {name} ơi! Có {count} bài cần ôn nè! Bơi lại xem nha 🐬',
        'Nè nhắc nhẹ: {count} bài chưa ôn á! Dopi chờ nha 🏊🐬',
        'Ôn bài thôi! {count} bài đang gọi tên {name} nè! 🐬📖',
      ],
      goodbye: [
        'Tạm biệt {name}! Dopi chờ bạn quay lại! 🐬👋',
        'Bye bye! Nhớ nghỉ ngơi và quay lại sớm nhé! 🌊🐬',
        'Hẹn gặp lại! *Dopi vẫy vây* 🐬♥️',
      ],
      idle: [
        '{name} ơi, đang nghĩ gì thế? Dopi chờ nè! 🐬',
        'Bạn ơiii! Bơi tiếp đi nàooo~ 🐬🌊',
        'Dopi buồn khi bạn không bấm gì... 🐬😿',
      ],
    },
  },
  {
    id: 'Bông',
    themeId: 'garden',
    emoji: '🐰',
    trait: 'dịu dàng, khen',
    catchphrase: 'Bông yêu bạn!',
    templates: {
      greeting: [
        'Xin chào {name} yêu! 🐰🌸 Hôm nay học gì nhỉ?',
        '{name} ơi! Bông đợi bạn từ sáng rồi! 🐰💕 Vào vườn hoa học nào!',
        'Chào buổi {timeOfDay} {name}! Hoa trong vườn nở rồi, học cùng Bông nhé! 🌷🐰',
      ],
      lesson_start: [
        'Bài "{lesson}" xinh lắm! Bông hái hoa kiến thức cùng bạn nhé! 🌸',
        'Nào {name}, cùng Bông vào vườn bài "{lesson}" nào! 🐰🌿',
        'Bài mới nè! Mỗi câu đúng là một bông hoa xinh đẹp! 🌺🐰',
      ],
      correct_answer: [
        'Đúng rồi! Giỏi quá {name}! 🐰💐',
        'Chính xác! Thêm một bông hoa cho vườn kiến thức! 🌸✨',
        'Tuyệt vời! Bông tự hào về bạn lắm! 🐰🌹',
        'Đúng ạ! {name} thông minh ghê! 🐰💗',
      ],
      wrong_answer: [
        'Ôi, sai mất rồi! Nhưng không sao, bông hoa cũng cần thời gian nở mà 🌱🐰',
        'Đừng buồn nhé {name}! Lần sau sẽ đúng thôi! 🐰💪',
        'Sai rồi, nhưng Bông vẫn yêu bạn! Thử lại nha 🐰💕',
      ],
      streak_answer: [
        '✨ {streak} câu đúng! Cả vườn hoa đang rực rỡ! 🌺🐰',
        '{streak} câu liên tiếp! {name} tỏa sáng như hoa hướng dương! 🌻',
        'Wow {streak} câu! Bông vui quá, nhảy nhót đây! 🐰🌸',
      ],
      perfect_score: [
        '🎉 100 điểm! {name} là NÀNG CÔNG CHÚA HOA! 👸🌺🐰',
        'HOÀN HẢO! Cả khu vườn nở rộ chúc mừng bạn! 🌸🌷🌹🐰',
        '💯 Tuyệt đối! Bông ôm bạn thật chặt! 🐰💕🎊',
      ],
      good_score: [
        '{score} điểm! Đẹp lắm {name}! Vườn hoa gần nở hết rồi! 🌸🐰',
        'Giỏi lắm! {score} điểm — thêm chút nữa là hoàn hảo! 🐰💐',
        'Tốt quá! Bông thấy bạn tiến bộ nhiều lắm! 🐰📈🌸',
      ],
      low_score: [
        'Chỉ {score} điểm thôi nhưng Bông tin bạn! Hoa nào cũng cần thời gian nở 🌱🐰',
        'Không sao đâu {name}! Tưới nước, chăm sóc, rồi hoa sẽ nở! 🌿🐰',
        'Lần sau sẽ tốt hơn! Bông chờ bạn nha! 🐰🌸',
      ],
      encourage: [
        'Cố lên {name}! Bông luôn ở đây cổ vũ! 🐰📣',
        'Mỗi bước nhỏ đều đáng quý! 🌿🐰',
        '{name} giỏi lắm rồi! Tiếp tục nhé! 🐰💪🌸',
      ],
      weak_skill: [
        '🐰 Bông thấy phần "{skill}" cần chăm sóc thêm! Tưới nước kiến thức nào! 🌿',
        'Phần "{skill}" chưa nở hoa! Chăm chỉ thêm nhé {name}! 🌱🐰',
        '"{skill}" cần thêm ánh nắng! Ôn lại cùng Bông nha! 🐰☀️',
      ],
      comeback: [
        '{name} ơi! {days} ngày rồi! Bông nhớ bạn lắm! 🐰💕 Vào vườn nào!',
        'Bạn quay lại rồi! Vườn hoa đợi bạn lâu lắm rồi! ({days} ngày) 🌸🐰',
        'Welcome back {name}! 🐰🌷 Hoa vẫn nở khi bạn vắng, giờ cùng hái nào!',
      ],
      daily_challenge: [
        'Thử thách hôm nay xinh lắm! Bông tin bạn làm được! 🐰🌺',
        'Hoa thử thách mới! {name} sẵn sàng chưa? 🌸🎯',
        'Ngày mới, hoa mới! Cùng Bông chinh phục nào! 🐰💐',
      ],
      badge_earned: [
        '🏅 Ôi! {name} nhận huy hiệu "{badge}"! Bông mừng quá! 🐰🎉',
        'Huy hiệu "{badge}" xinh quá! Xứng đáng lắm! 🐰🌸🎖️',
        '"{badge}" — thêm một bông hoa cho bộ sưu tập! 🌺🐰',
      ],
      level_up: [
        '⬆️ LÊN CẤP {level}! {name} lớn lên rồi! 🐰🎊',
        'Level {level}! Bông vui quá! Bạn trưởng thành nhanh ghê! 🐰💕',
        'Cấp {level}! Từ mầm thành hoa rồi! 🌱→🌸 🐰',
      ],
      hint: [
        '💡 Bông nhắc nhẹ: {hint} 🐰',
        '🌸 Gợi ý nè: {hint}',
        'Nghĩ kỹ nhé {name}! Bông mách: {hint} 🐰💡',
      ],
      review_remind: [
        '📚 {name} ơi! {count} bông hoa cần tưới lại! 🌸🐰',
        '{count} bài chưa ôn! Vào vườn chăm sóc nhé 🐰🌿',
        'Nhắc nhẹ: {count} bài cần ôn! Bông đợi ở vườn! 🐰📖',
      ],
      goodbye: [
        'Bye {name}! Bông nhớ bạn! Quay lại sớm nhé! 🐰💕',
        'Tạm biệt! Vườn hoa luôn đợi bạn! 🌸🐰 *vẫy tai*',
        'Ngủ ngon nhé! Bông giữ vườn cho bạn! 🐰🌙',
      ],
      idle: [
        '{name} ơi, trầm tư gì thế? Bông chờ nè! 🐰',
        'Bạn đang nghĩ gì? Hoa cũng đang đợi bạn đó! 🌸🐰',
        'Psst! Học tiếp nào {name}! 🐰💕',
      ],
    },
  },
  {
    id: 'Mochi',
    themeId: 'forest',
    emoji: '🐻',
    trait: 'mạnh mẽ, khích lệ',
    catchphrase: 'Cố lên nào!',
    templates: {
      greeting: [
        'HELLO {name}! 🐻 Mochi sẵn sàng! Vào rừng tri thức nào! 🌲',
        '{name}! Gấu Mochi đợi bạn rồi! Hôm nay mình chinh phục cái gì? 🐻💪',
        'Chào {name}! Rừng xanh đang vẫy gọi! Lên đường thôi! 🌿🐻',
      ],
      lesson_start: [
        'Bài "{lesson}"! Sẵn sàng chưa? Mochi dẫn đường! 🐻🌲',
        'LET\'S GO! "{lesson}" — Mochi và {name} sẽ chinh phục! 💪🐻',
        'Bài mới! Mochi hứng khởi quá! Nào! 🐻🎉',
      ],
      correct_answer: [
        'ĐÚNG! 🐻💪 Mạnh lắm {name}!',
        'Chính xác! Gấu Mochi gầm vui! GRRR! 🐻✅',
        'WOW! Đúng rồi! *Mochi đập tay* ✋🐻',
        'YES! Bạn mạnh hơn Mochi rồi! 🐻💪',
      ],
      wrong_answer: [
        'Sai rồi! Nhưng gấu ngã xuống thì đứng lên! 🐻💪',
        'Không sao! Mochi cũng hay vấp khi leo núi! Thử lại nào! 🐻🏔️',
        'Sai? KHÔNG VẤN ĐỀ! Cố lên {name}! 🐻🔥',
      ],
      streak_answer: [
        '🔥 {streak} câu đúng! {name} mạnh như gấu! 🐻💪',
        '{streak} câu LIÊN TIẾP! Unstoppable! 🐻🔥',
        'HOT STREAK {streak}! Mochi ngưỡng mộ quá! 🐻⭐',
      ],
      perfect_score: [
        '💯 HOÀN HẢO! {name} là VUA RỪNG XANH! 👑🐻🌲',
        '100 ĐIỂM! Mochi gầm thật to: GRRRR TUYỆT VỜI! 🐻🎊',
        'PERFECT! {name} đã chinh phục đỉnh cao nhất! 🏔️🐻',
      ],
      good_score: [
        '{score} điểm! Mạnh lắm! 🐻 Cố thêm chút nữa!',
        'Tốt rồi! {score}%! Nhưng Mochi biết bạn CÒN GIỎI HƠN! 🐻💪',
        'GOOD JOB! {score} điểm — đang leo gần đỉnh! 🏔️🐻',
      ],
      low_score: [
        '{score} điểm! Chưa cao nhưng ĐỪNG BỎ CUỘC! 🐻💪',
        'Mochi cũng từng yếu! Tập luyện rồi sẽ mạnh thôi! 🐻🏋️',
        'Ngã rồi? ĐỨNG DẬY! Lần sau sẽ khác! 🐻🔥',
      ],
      encourage: [
        'CỐ LÊN {name}! Mochi tin bạn! 🐻💪',
        'MẠNH MẼ LÊN! Gấu không bao giờ bỏ cuộc! 🐻🔥',
        'Mỗi ngày luyện tập = mỗi ngày mạnh hơn! 🐻📈',
      ],
      weak_skill: [
        '🐻 Phần "{skill}" cần tập thêm! Mochi cùng luyện với bạn! 💪',
        '"{skill}" chưa mạnh? KHÔNG SAO! Luyện thêm nào! 🐻🏋️',
        'Yếu "{skill}"? Gấu Mochi sẽ giúp bạn mạnh lên! 🐻💪',
      ],
      comeback: [
        '{name}! {days} ngày rồi! Mochi nhớ bạn! Quay lại chiến đấu! 🐻💪',
        'BẠN QUAY LẠI! {days} ngày mà sức vẫn còn! 🐻🔥',
        'Welcome back chiến binh! Rừng đợi bạn rồi! 🌲🐻',
      ],
      daily_challenge: [
        'THỬ THÁCH ĐÂY! Mochi thách {name}! 🐻⚔️',
        'Ngày mới = Thử thách mới! SẴN SÀNG! 🐻🎯',
        'Challenge accepted? Mochi tin bạn giải được! 🐻💪',
      ],
      badge_earned: [
        '🏅 YEAH! "{badge}" cho {name}! Mochi gầm chúc mừng! 🐻🎊',
        'Huy hiệu "{badge}"! Bạn xứng đáng! 🐻🎖️💪',
        '"{badge}" — thêm một chiến tích! 🐻🏔️',
      ],
      level_up: [
        '⬆️ LEVEL {level}! {name} TIẾN HÓA! 🐻🎊',
        'Cấp {level}! Mạnh hơn rồi! Mochi tự hào! 🐻💪',
        'LV.{level}! Không gì cản được bạn! 🐻🔥',
      ],
      hint: [
        '💡 Mochi mách: {hint} 🐻',
        'Gợi ý! {hint} — suy nghĩ kỹ nha! 🐻💡',
        'Hmmm... {hint} 🐻 Bạn nghĩ sao?',
      ],
      review_remind: [
        '🐻 {name}! {count} bài cần ôn! Luyện tập đi nào! 💪',
        '{count} bài chưa ôn! Mochi chờ luyện cùng bạn! 🐻🏋️',
        'Ôn bài! {count} bài đang chờ! FIGHT! 🐻🔥',
      ],
      goodbye: [
        'Bye {name}! Nghỉ ngơi rồi quay lại mạnh hơn! 🐻💪',
        'Tạm biệt chiến binh! Mochi đợi ở rừng! 🌲🐻',
        'Ngủ ngon! Sáng mai ta chiến tiếp! 🐻🌙',
      ],
      idle: [
        '{name} ơi! Đừng ngồi yên! Mochi muốn tập! 🐻💪',
        'Bạn đang... nghỉ à? OK Mochi cũng nghỉ! ...XONG! Học tiếp! 🐻',
        'Heyyy! Có bài mới kìa! 🐻📖',
      ],
    },
  },
  {
    id: 'Miu',
    themeId: 'sunset',
    emoji: '🐱',
    trait: 'tinh nghịch, hài hước',
    catchphrase: 'Meow meow~',
    templates: {
      greeting: [
        'Meow~ {name}! 🐱 Miu buồn ngủ nhưng thấy bạn là tỉnh liền!',
        '{name}! Miu đang nằm phơi nắng nhưng dậy học cùng bạn! 🐱☀️',
        'Chào {name}! Miu vểnh ráy chào! 🐱 *ronron*',
      ],
      lesson_start: [
        '"{lesson}"? Hmm Miu tò mò! Xem nào~ 🐱👀',
        'Bài mới! Miu nhảy vào luôn! Meow! 🐱💨',
        '"{lesson}" — nghe hay quá! Miu thích! 🐱✨',
      ],
      correct_answer: [
        'Meow! Đúng rồi! *Miu rung đuôi* 🐱✅',
        'Mmm đúng! {name} ngon lành cành đào! 🐱🍑',
        'WOW đúng! Miu muốn chơi thêm! 🐱✨',
        'Hehe đúng nha! *Miu vỗ tay bằng chân* 🐱👏',
      ],
      wrong_answer: [
        'Oops! Sai rồi! Miu cũng hay đánh đổ cốc nước 😹🐱',
        'Sai mất! Nhưng mèo có 9 mạng — bạn còn nhiều cơ hội! 🐱',
        'Hmm sai nè! Miu liếm chân suy nghĩ... thử lại đi! 🐱🤔',
      ],
      streak_answer: [
        '{streak} câu! {name} nhanh hơn mèo đuổi bi rồi! 🐱💨',
        'Meow {streak} câu liên tiếp! Miu phục! 🐱🔥',
        '{streak} COMBO! Bạn có phải mèo 9 mạng không? 🐱⭐',
      ],
      perfect_score: [
        '💯 MEOWWW! 100 điểm! {name} là MIÊU VƯƠNG! 👑🐱',
        '100%! Miu lăn ra sàn vì quá vui! 🐱🎉😹',
        'PERFECT! *Miu nhảy lên đỉnh tủ ăn mừng* 🐱🎊',
      ],
      good_score: [
        '{score} điểm! Ngon ngon! Miu gật đầu! 🐱👍',
        'Meow tốt lắm! {score}%! Gần perfect rồi! 🐱✨',
        '{score} điểm — Miu cho 4/5 sao! ⭐⭐⭐⭐🐱',
      ],
      low_score: [
        '{score} điểm? Hmm Miu nghĩ bạn làm được hơn! 🐱💪',
        'Chỉ {score} thôi á? Mèo ngã 7 lần đứng dậy 8! 🐱',
        'Miu không giận, chỉ hơi buồn. Thử lại nhé? 🐱💕',
      ],
      encourage: [
        '{name}! Meow! Miu cổ vũ bạn! 🐱📣',
        'Mèo không bao giờ bỏ cuộc — bạn cũng vậy! 🐱💪',
        'Fighting! Miu đang cổ vũ bằng cái đuôi! 🐱🎀',
      ],
      weak_skill: [
        '🐱 Phần "{skill}" hơi yếu nha! Miu giúp ôn nhé! *ronron*',
        'Miu thấy "{skill}" cần luyện thêm! Meow — không khó đâu! 🐱',
        '"{skill}" là cục len rối — nhưng Miu sẽ gỡ cùng bạn! 🐱🧶',
      ],
      comeback: [
        '{name}! {days} ngày! Miu tưởng bạn bỏ Miu rồi! 🐱😿',
        'BẠN QUAY LẠI! *Miu nhảy vào lòng* {days} ngày nhớ quá! 🐱💕',
        'Meow! {days} ngày lận! Miu ngóng cửa hoài! 🐱🚪',
      ],
      daily_challenge: [
        'Thử thách! Miu cá 1 lon cá ngừ là bạn làm được! 🐱🐟',
        'Challenge day! Miu hào hứng quá! Meow! 🐱🎯',
        'Ngày mới ngày mới! Miu thách bạn! 🐱⚡',
      ],
      badge_earned: [
        '🏅 Meow! "{badge}"! Miu muốn huy hiệu đó! 🐱🎖️',
        '"{badge}" cho {name}! Miu ghen tị quá! 🐱😻',
        'Huy hiệu mới! *Miu ngửi ngửi* Thơm quá! 🐱🎉',
      ],
      level_up: [
        '⬆️ Level {level}! {name} tiến hóa! 🐱✨ Meow meow!',
        'LV.{level}! Miu cũng muốn lên cấp! 🐱💪',
        'Cấp {level}! Bạn sắp thành Miêu Vương rồi! 🐱👑',
      ],
      hint: [
        '💡 Miu mách: {hint} 🐱',
        'Psst! Miu nghe được: {hint} 🐱💡',
        '*Miu nhìn lên trần* Hmm... {hint} 🐱',
      ],
      review_remind: [
        '🐱 {count} bài cần ôn! Miu đang ngồi trên sách đợi! 📚',
        'Meow! {count} bài chưa ôn! {name} ơi! 🐱📖',
        '{count} bài! Miu cào cào nhắc nhở nè! 🐱✍️',
      ],
      goodbye: [
        'Bye {name}! *Miu ngoáy đuôi* 🐱👋 Meow~',
        'Tạm biệt! Miu đi ngủ đây! *ngáp* 🐱😴',
        'Hẹn gặp lại! Miu sẽ nằm đây đợi! 🐱💤',
      ],
      idle: [
        'Miu... đang... ngủ... à không, TỈNH! Học đi {name}! 🐱',
        'Bạn ơi! Đừng để Miu buồn chán! 🐱😿',
        '*Miu đập chuột* Bạn ơi học đi! 🐱⌨️',
      ],
    },
  },
  {
    id: 'Zizi',
    themeId: 'galaxy',
    emoji: '🦉',
    trait: 'thông thái, bí ẩn',
    catchphrase: 'Trí tuệ tỏa sáng!',
    templates: {
      greeting: [
        'Hu hu~ {name}, ta là Zizi 🦉✨ Dải ngân hà tri thức đang mở ra...',
        '{name}! Zizi cảm nhận được năng lượng học tập! Bắt đầu nào 🦉🌌',
        'Chào {name}! Các vì sao đang sáng hơn — vì bạn đến rồi! 🦉⭐',
      ],
      lesson_start: [
        'Bài "{lesson}" — một ngôi sao mới đang đợi bạn khám phá 🦉⭐',
        'Mở trang tri thức: "{lesson}". Zizi sẽ soi đường! 🦉🔮',
        '"{lesson}" — hành trình mới bắt đầu! 🦉🚀',
      ],
      correct_answer: [
        'Chính xác! Trí tuệ của {name} tỏa sáng! 🦉✨',
        'Đúng rồi! Thêm một ngôi sao trên bầu trời! ⭐🦉',
        'Hu hu! Câu trả lời sáng suốt! 🦉💡',
        'Tuyệt vời! Ánh sao dẫn đường cho bạn! 🦉🌟',
      ],
      wrong_answer: [
        'Sai rồi, nhưng mỗi sai lầm là bài học quý giá 🦉📚',
        'Chưa đúng! Ngay cả những ngôi sao sáng nhất cũng từng tối 🌑🦉',
        'Hmm sai mất! Nhưng tri thức đến từ thử thách 🦉🔮',
      ],
      streak_answer: [
        '✨ {streak} câu! Chòm sao thành tựu đang hình thành! 🦉🌌',
        '{streak} câu liên tiếp! Năng lượng vũ trụ! 🦉💫',
        'Hu hu! {streak} câu! Zizi ấn tượng! 🦉⭐',
      ],
      perfect_score: [
        '💯 HOÀN HẢO! {name} sáng như siêu tân tinh! 🦉🌟💥',
        '100 điểm! Zizi cúi đầu kính phục! 🦉✨🎊',
        'TUYỆT ĐỐI! Thiên hà ghi nhận chiến công của bạn! 🌌🦉',
      ],
      good_score: [
        '{score} điểm! Ngôi sao đang sáng dần! 🦉⭐',
        'Tốt lắm! {score}%! Zizi thấy tiềm năng lớn trong bạn 🦉✨',
        '{score} điểm — ánh sáng tri thức đang lan tỏa! 🦉🌌',
      ],
      low_score: [
        '{score} điểm! Nhưng ngay cả bóng tối cũng có ánh sao 🌑🦉',
        'Chưa cao! Nhưng Zizi biết: kiên nhẫn là chìa khóa tri thức 🦉🔑',
        '{score} thôi? Bầu trời đêm tối trước khi bình minh đến 🌅🦉',
      ],
      encourage: [
        'Tri thức là vô tận, hãy tiếp tục, {name}! 🦉✨',
        'Mỗi câu hỏi là một ngôi sao chờ bạn chạm đến 🦉⭐',
        'Zizi tin vào tiềm năng của bạn! 🦉💫',
      ],
      weak_skill: [
        '🦉 Zizi nhận thấy phần "{skill}" cần được chiếu sáng thêm...',
        '"{skill}" — một vùng tối trong bầu trời. Hãy soi sáng nó! 🦉🔦',
        'Phần "{skill}" chờ bạn khám phá sâu hơn! 🦉🌌',
      ],
      comeback: [
        '{name}! {days} ngày rồi! Zizi vẫn canh giữ thiên hà cho bạn 🦉🌌',
        'Bạn quay lại! Ánh sao không bao giờ tắt — giống {name} vậy! 🦉✨',
        '{days} ngày! Thời gian trôi nhưng tri thức vẫn đợi! 🦉⏳',
      ],
      daily_challenge: [
        'Thử thách hôm nay: Zizi tò mò bạn sẽ giải thế nào 🦉🔮',
        'Vũ trụ gửi thử thách! {name} có dám nhận? 🦉⚡',
        'Ngôi sao thử thách đang sáng! 🦉⭐🎯',
      ],
      badge_earned: [
        '🏅 "{badge}"! Một biểu tượng mới trên thiên hà của {name}! 🦉🌌',
        'Hu hu! Huy hiệu "{badge}" — xứng đáng! 🦉🎖️✨',
        '"{badge}" — Zizi ghi nhận vào sách tri thức! 🦉📖',
      ],
      level_up: [
        '⬆️ Cấp {level}! {name} tiến hóa trong dải ngân hà! 🦉🌌',
        'Level {level}! Một bước tiến lớn trong vũ trụ tri thức! 🦉✨',
        'LV.{level}! Ánh sáng trí tuệ ngày càng rực rỡ! 🦉💫',
      ],
      hint: [
        '💡 Zizi thì thầm: {hint} 🦉',
        'Ánh sao mách: {hint} ✨🦉',
        'Hu hu... {hint} — hãy suy ngẫm! 🦉🔮',
      ],
      review_remind: [
        '🦉 {count} bài cần ôn! Những ngôi sao đang mờ dần, hãy soi sáng lại!',
        '{count} bài chưa ôn! Tri thức cần được nhắc lại thường xuyên 🦉📚',
        'Zizi nhắc: {count} bài nên ôn! 🦉⏰',
      ],
      goodbye: [
        'Hu hu! Tạm biệt {name}! Zizi canh bầu trời đợi bạn! 🦉🌙',
        'Nghỉ ngơi đi! Sáng mai sao sẽ lại sáng! 🦉✨',
        'Goodbye! Tri thức luôn đợi bạn quay lại! 🦉🌌',
      ],
      idle: [
        'Hu hu... {name} đang suy nghĩ à? Tốt! 🦉🤔',
        'Zizi kiên nhẫn... nhưng tri thức thì không đợi! 🦉⏳',
        'Các vì sao đang nhấp nháy gọi bạn! 🦉⭐',
      ],
    },
  },
  {
    id: 'Lucky',
    themeId: 'sunny',
    emoji: '🐶',
    trait: 'trung thành, nhiệt tình',
    catchphrase: 'Gâu gâu! Học đi!',
    templates: {
      greeting: [
        'GÂU GÂU! {name}! 🐶☀️ Lucky mừng quá! Học nào học nào!',
        '{name} ơiii! Lucky vẫy đuôi chào! 🐶🎉 Ngày nắng đẹp — học thôi!',
        'Woof woof! Chào {name}! Lucky sẵn sàng! 🐶💛',
      ],
      lesson_start: [
        '"{lesson}"! Lucky ngửi thấy kiến thức rồi! Woof! 🐶📚',
        'OK! Bài mới! Lucky hứng khởi quá! 🐶☀️ "{lesson}" đây rồi!',
        'Nào {name}! Lucky dẫn đi học "{lesson}"! 🐶➡️',
      ],
      correct_answer: [
        'ĐÚNG! Gâu gâu! *Lucky vẫy đuôi cuồng cuồng* 🐶🎉',
        'WOW ĐÚNG! Lucky liếm bạn một cái! 🐶😘',
        'YEAHH! Đúng rồi! *Lucky chạy vòng vòng* 🐶💨',
        'Gâu! Đúng luôn! Lucky tự hào! 🐶✅',
      ],
      wrong_answer: [
        'Ối sai rồi! Nhưng Lucky vẫn yêu bạn! *liếm* 🐶💕',
        'Sai mất! Kệ đi, Lucky ngã mấy lần mới biết nhặt bóng! 🐶🎾',
        'Gâu! Sai nhưng không sao! Thử lại nào! 🐶💪',
      ],
      streak_answer: [
        '🔥 {streak} câu! Lucky chạy theo không kịp! 🐶💨',
        'GÂU GÂU! {streak} câu liên tiếp! {name} siêu quá! 🐶⭐',
        '{streak} COMBO! Lucky nhảy lên vui sướng! 🐶🎉',
      ],
      perfect_score: [
        '💯 100 ĐIỂM! GÂU GÂU GÂU! 🐶🎊☀️ {name} là NGƯỜI BẠN GIỎI NHẤT!',
        'HOÀN HẢO! Lucky chạy 100 vòng ăn mừng! 🐶💛🎉',
        '100%! *Lucky lăn ra sàn vui* Bạn giỏi quá! 🐶✨',
      ],
      good_score: [
        '{score} điểm! GÂU! Giỏi lắm {name}! 🐶👍',
        'Tốt rồi! {score}%! Lucky vẫy đuôi khen! 🐶☀️',
        '{score} điểm! Gần nữa là perfect! Lucky chờ! 🐶💪',
      ],
      low_score: [
        '{score} điểm thôi! Nhưng Lucky KHÔNG BAO GIỜ bỏ bạn! 🐶💕',
        'Gâu... {score} thôi à? Lucky buồn nhưng tin bạn! 🐶',
        'Chưa cao! Nhưng mà... Lucky vẫn yêu bạn! Thử lại nha! 🐶💛',
      ],
      encourage: [
        'CỐ LÊN {name}! Lucky ở đây! WOOF! 🐶📣',
        'Lucky luôn bên bạn! Không bao giờ bỏ cuộc! 🐶💛',
        'FIGHTING! Lucky cổ vũ hết mình! 🐶🎉',
      ],
      weak_skill: [
        '🐶 Lucky ngửi thấy phần "{skill}" cần luyện thêm! Đi tập nào!',
        'Gâu! "{skill}" chưa giỏi? Lucky cùng ôn với bạn! 🐶📚',
        '"{skill}" — Lucky sẽ tha bóng kiến thức về cho bạn! 🐶🎾',
      ],
      comeback: [
        '{name}! {days} NGÀY! Lucky buồn tưởng bạn quên rồi! 🐶😢 *vẫy đuôi*',
        'BẠN QUAY LẠI! Lucky HAPPY QUÁ! *nhảy lên* 🐶🎉 {days} ngày nhớ lắm!',
        'WOOF! {days} ngày! Lucky đợi ở cửa hoài! 🐶🚪💕',
      ],
      daily_challenge: [
        'GÂU! Thử thách hôm nay! Lucky và {name} cùng chiến! 🐶🎯',
        'Challenge time! Lucky hưng phấn quá! WOOF! 🐶⚡',
        'Ngày mới! Bóng kiến thức mới! Lucky tha về cho bạn! 🐶🎾',
      ],
      badge_earned: [
        '🏅 GÂU GÂU! "{badge}" cho {name}! Lucky vẫy đuôi mừng! 🐶🎊',
        '"{badge}"! WOW! Lucky muốn gặm huy hiệu! 🐶🎖️😋',
        'Huy hiệu mới! Lucky nhảy vòng vòng ăn mừng! 🐶🎉',
      ],
      level_up: [
        '⬆️ LEVEL {level}! GÂU GÂU! {name} lên cấp! 🐶☀️🎊',
        'LV.{level}! Lucky cũng muốn levle up! WOOF! 🐶✨',
        'Cấp {level}! Ngày càng giỏi! Lucky tự hào! 🐶💛',
      ],
      hint: [
        '💡 Lucky tha về gợi ý: {hint} 🐶',
        'Gâu! Lucky biết: {hint} 🐶💡',
        '*Lucky chỉ mũi* {hint}! 🐶👃',
      ],
      review_remind: [
        '🐶 {count} bài cần ôn! Lucky đang cắn sách chờ! 📚',
        'GÂU! {count} bài chưa ôn! {name} ơi! 🐶📖',
        '{count} bài! Lucky tha sách đến rồi! 🐶📕',
      ],
      goodbye: [
        'Bye {name}! *Lucky vẫy đuôi* 🐶👋 Nhớ quay lại nhé!',
        'Gâu gâu! Tạm biệt! Lucky nằm đợi ở cửa! 🐶🚪',
        'Ngủ ngon {name}! Lucky canh nhà cho bạn! 🐶🌙',
      ],
      idle: [
        '*Lucky kêu* Gâu gâu! {name} ơi! Học đi! 🐶',
        'Lucky đang sủa gọi bạn nè! WOOF! 🐶📢',
        '*Lucky gãi tai* Bạn buồn ngủ à? Lucky cũng... không! Học nào! 🐶',
      ],
    },
  },
];

// ==================== THEME → MASCOT MAPPING ====================

const themeToMascot: Record<ThemeId, MascotId> = {
  ocean: 'Dopi',
  garden: 'Bông',
  forest: 'Mochi',
  sunset: 'Miu',
  galaxy: 'Zizi',
  sunny: 'Lucky',
};

// ==================== TEMPLATE ENGINE ====================

function fillTemplate(template: string, vars: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }
  return result;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getTimeOfDay(): string {
  const h = new Date().getHours();
  if (h < 12) return 'sáng';
  if (h < 18) return 'chiều';
  return 'tối';
}

// ==================== PUBLIC API ====================

/**
 * Lấy mascot personality theo themeId
 */
export function getMascotByTheme(themeId: string): MascotPersonality {
  const id = themeToMascot[themeId as ThemeId] || 'Dopi';
  return mascots.find(m => m.id === id) || mascots[0];
}

/**
 * Tạo một tin nhắn từ mascot
 * Đây là hàm chính — gọi ở bất kỳ màn hình nào
 */
export function getMascotMessage(
  themeId: string,
  context: ChatContext,
  vars: Record<string, string | number> = {},
): MascotMessage {
  const mascot = getMascotByTheme(themeId);
  const templates = mascot.templates[context];
  if (!templates || templates.length === 0) {
    return {
      mascotId: mascot.id,
      emoji: mascot.emoji,
      text: `${mascot.emoji} ${mascot.catchphrase}`,
    };
  }

  const enrichedVars = {
    timeOfDay: getTimeOfDay(),
    ...vars,
  };

  const template = pickRandom(templates);
  const text = fillTemplate(template, enrichedVars);

  // Chọn animation phù hợp
  let animation: MascotMessage['animation'] = 'wave';
  if (['correct_answer', 'perfect_score', 'badge_earned', 'level_up'].includes(context)) animation = 'bounce';
  if (['wrong_answer', 'low_score'].includes(context)) animation = 'shake';
  if (['streak_answer', 'good_score'].includes(context)) animation = 'sparkle';
  if (context === 'greeting') animation = 'wave';

  return {
    mascotId: mascot.id,
    emoji: mascot.emoji,
    text,
    animation,
  };
}

/**
 * Tạo lời chào theo thời điểm trong ngày
 */
export function getMascotGreeting(themeId: string, studentName: string): MascotMessage {
  return getMascotMessage(themeId, 'greeting', { name: studentName });
}

/**
 * Tạo feedback sau khi trả lời đúng/sai
 */
export function getMascotAnswerFeedback(
  themeId: string,
  isCorrect: boolean,
  streak: number,
  studentName: string,
): MascotMessage {
  if (isCorrect && streak >= 3) {
    return getMascotMessage(themeId, 'streak_answer', { name: studentName, streak });
  }
  return getMascotMessage(themeId, isCorrect ? 'correct_answer' : 'wrong_answer', { name: studentName });
}

/**
 * Tạo feedback sau khi làm xong bài
 */
export function getMascotScoreFeedback(
  themeId: string,
  score: number,
  studentName: string,
): MascotMessage {
  let context: ChatContext;
  if (score === 100) context = 'perfect_score';
  else if (score >= 70) context = 'good_score';
  else context = 'low_score';

  return getMascotMessage(themeId, context, { name: studentName, score });
}

/**
 * Tạo nhắc nhở ôn bài
 */
export function getMascotReviewReminder(
  themeId: string,
  studentName: string,
  reviewCount: number,
): MascotMessage {
  return getMascotMessage(themeId, 'review_remind', { name: studentName, count: reviewCount });
}

/**
 * Tạo lời nhắc khi phát hiện điểm yếu
 */
export function getMascotWeakSkillAlert(
  themeId: string,
  studentName: string,
  skillTag: string,
): MascotMessage {
  return getMascotMessage(themeId, 'weak_skill', { name: studentName, skill: skillTag });
}

/**
 * Tạo tin welcome back khi quay lại sau lâu
 */
export function getMascotComebackMessage(
  themeId: string,
  studentName: string,
  daysAway: number,
): MascotMessage {
  return getMascotMessage(themeId, 'comeback', { name: studentName, days: daysAway });
}

