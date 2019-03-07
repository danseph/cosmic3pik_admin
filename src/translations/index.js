import { addLocaleData } from 'react-intl'

import locale_en from 'react-intl/locale-data/en';
import locale_ko from 'react-intl/locale-data/ko';
import locale_zh from 'react-intl/locale-data/zh';
import locale_ja from 'react-intl/locale-data/ja';

import en from './en.json';
import ko from './ko.json';
import zh from './zh.json';
import ja from './ja.json';

addLocaleData([...locale_en, ...locale_ko, ...locale_zh, ...locale_ja]);

export default {
  en,
  ko,
  zh,
  ja,
};