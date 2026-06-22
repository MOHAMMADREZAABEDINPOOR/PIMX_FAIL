/**
 * این اسکریپت استارتاپ‌های جدید را به data.ts اضافه می‌کند
 * هر استارتاپ به 10 زبان ترجمه می‌شود
 * 
 * زبان‌های پشتیبانی‌شده:
 * en, fa, ar, de, zh, es, fr, it, ru, tr
 */

import fs from 'fs';
import path from 'path';

// فقط برای نمایش - داده‌های واقعی را باید دستی وارد کنیم
const BATCH_1_STARTUPS_EN = [
  // استارتاپ‌های 1 تا 100 اینجا قرار می‌گیرند
  // هر استارتاپ شامل تمام فیلدهای لازم است
];

console.log('✅ Ready to add startups manually');
console.log('📝 Please see the data.ts file structure for reference');
