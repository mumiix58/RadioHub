const keys = ['greeting_morning', 'greeting_afternoon', 'greeting_evening', 'greeting_night', 'surprise_me', 'discover_surprise_hint', 'discover_tuning'] as const;

// Like the profile navigation, these labels remain localized while the remote
// dictionary is loading. Current-locale custom translations still take priority.
const rows: Record<string, readonly string[]> = {
  en: ['Good morning', 'Good afternoon', 'Good evening', 'Good night', 'Surprise me', 'Play a random station', 'Tuning in…'],
  tr: ['Günaydın', 'İyi günler', 'İyi akşamlar', 'İyi geceler', 'Beni şaşırt', 'Rastgele bir radyo çal', 'Radyo seçiliyor…'],
  de: ['Guten Morgen', 'Guten Tag', 'Guten Abend', 'Gute Nacht', 'Überrasch mich', 'Einen zufälligen Sender abspielen', 'Sender wird gewählt…'],
  es: ['Buenos días', 'Buenas tardes', 'Buenas noches', 'Buenas noches', 'Sorpréndeme', 'Reproducir una emisora al azar', 'Sintonizando…'],
  fr: ['Bonjour', 'Bon après-midi', 'Bonsoir', 'Bonne nuit', 'Surprenez-moi', 'Écouter une station au hasard', 'Connexion à la station…'],
  pt: ['Bom dia', 'Boa tarde', 'Boa noite', 'Boa noite', 'Surpreenda-me', 'Ouvir uma estação aleatória', 'Sintonizando…'],
  it: ['Buongiorno', 'Buon pomeriggio', 'Buonasera', 'Buonanotte', 'Sorprendimi', 'Ascolta una stazione a caso', 'Sintonizzazione…'],
  ru: ['Доброе утро', 'Добрый день', 'Добрый вечер', 'Доброй ночи', 'Удиви меня', 'Включить случайную станцию', 'Настройка…'],
  ar: ['صباح الخير', 'طاب نهارك', 'مساء الخير', 'ليلة سعيدة', 'فاجئني', 'شغّل محطة عشوائية', 'جارٍ اختيار المحطة…'],
  zh: ['早上好', '下午好', '晚上好', '晚安', '给我惊喜', '播放随机电台', '正在选择电台…'],
  ja: ['おはようございます', 'こんにちは', 'こんばんは', 'おやすみなさい', 'おまかせ再生', 'ランダムなラジオ局を再生', '選局中…'],
  ko: ['좋은 아침이에요', '좋은 오후예요', '좋은 저녁이에요', '좋은 밤이에요', '랜덤 재생', '임의의 라디오 방송 듣기', '방송 선택 중…'],
  hi: ['सुप्रभात', 'नमस्कार', 'शुभ संध्या', 'शुभ रात्रि', 'कुछ नया सुनाएँ', 'कोई भी रेडियो स्टेशन चलाएँ', 'स्टेशन चुना जा रहा है…'],
  he: ['בוקר טוב', 'צהריים טובים', 'ערב טוב', 'לילה טוב', 'הפתיעו אותי', 'ניגון תחנה אקראית', 'בוחר תחנה…'],
};

export function getProfileDiscoverCopy(language: string, translations?: Readonly<Record<string, string>>) {
  const locale = language.toLowerCase().split('-')[0];
  const row = rows[locale] || rows.en;
  return Object.fromEntries(keys.map((key, index) => {
    const value = translations?.[key]?.trim();
    return [key, value && !(locale !== 'en' && value.toLowerCase() === rows.en[index].toLowerCase()) ? value : row[index]];
  })) as Record<typeof keys[number], string>;
}
