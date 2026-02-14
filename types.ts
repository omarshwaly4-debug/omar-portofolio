
export enum Category {
  MORNING = 'صباح',
  EVENING = 'مساء',
  SLEEP = 'نوم',
  WAKEUP = 'استيقاظ',
  TRAVEL = 'سفر',
  PRAYER = 'صلاة',
  ANXIETY = 'هم وكرب',
  QURANIC = 'أدعية قرآنية',
  FOOD = 'طعام وشراب',
  FAVORITES = 'المفضلة',
  MOSQUE = 'المسجد',
  HOME = 'المنزل',
  WUDU = 'الوضوء',
  HAJJ = 'الحج والعمرة',
  FUNERAL = 'الجنائز'
}

export interface Zikr {
  id: string;
  text: string;
  repeat: number;
  count: number;
  description?: string;
  category: Category;
  reference?: string;
  isFavorite?: boolean;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
