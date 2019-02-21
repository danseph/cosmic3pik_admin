import { addLocaleData } from 'react-intl'

import locale_en from 'react-intl/locale-data/en';
import locale_ko from 'react-intl/locale-data/ko';
import locale_zh from 'react-intl/locale-data/zh';

import en from './en.json';
import ko from './ko.json';
import zh from './zh.json';

addLocaleData([...locale_en, ...locale_ko, ...locale_zh]);

export default {
  en,
  ko,
  zh,
};