import { I18nTranslations } from '@/common/generated/i18n.type'
import { NestedKeyOf, NestedKeyOfErrors, NestedKeyOfSecond } from '@/common/types/nested-keyof.type'

export type I18nTranslationKeys = NestedKeyOf<I18nTranslations>

export type I18nTranslationKeysOfError = NestedKeyOfErrors<I18nTranslations>

export type I18nTranslateKeysInSecond = NestedKeyOfSecond<I18nTranslations>
