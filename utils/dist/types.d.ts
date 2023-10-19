export interface ITagInfo {
    tag: string | null;
    descriptions?: Array<string>;
}
export interface IDefinition {
    siteTextId: string;
    isWord: boolean;
    siteTextlikeString: string;
    definitionlikeString: string;
}
export type TLang = Omit<ITagInfo, 'tag'> & {
    tag: string;
};
export type TRegion = ITagInfo;
export type TDialect = ITagInfo;
export type LanguageInfo = {
    lang: TLang;
    dialect?: TDialect | undefined;
    region?: TRegion | undefined;
};
export type LanguageInput = {
    language_code: string;
    dialect_code: string | null;
    geo_code: string | null;
    filter?: string | null;
};
