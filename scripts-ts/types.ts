export enum eDomain {
    Time,
    Length,
    Area,
    Volume,
    Mass,
    Speed,
    Acceleration,
    Force,
    Temperature,
    Angle,
    Current,
    Amount,
    Luminosity
};

export enum eCategory {
    Metric,
    Imperial,
    Us,
    Troy,
    Scientific,
    Navigational,
    NonAnglo,
    Paper,
    PaperUs,
    Typo,
    ArchaicTypo,
    Informal,
    Archaic
};

export interface iValue {
    baseScale: number;
    baseSiUnits: tSiUnits;
};

export type tSiUnits = {
    s?: number,
    kg?: number,
    m?: number,
    r?: number,
    e?: number,
    c?: number,
    kw?: number,
    mw?: number
}

export type tSiUnitKeys = (keyof tSiUnits)[];

export type tUnit = {
    name: string,
    symbol: string,
    domain: eDomain,
    description: string,
    scale: number,
    offset: number,
    invert: boolean,
    category: eCategory,
    searchString: string,
    string: [string, string],
    siPrepend: boolean
};