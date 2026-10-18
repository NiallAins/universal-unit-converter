export enum eDomain {
    Time,
    Length,
    Area,
    Volume,
    Mass,
    Acceleration,
    Force,
    Temperature,
    Angle
};

export interface iValue {
    baseScale: number;
    baseSiUnits: tSiUnits;
};

export type tSiUnits = {
    s?: number,
    kg?: number,
    m?: number,
    c?: number,
    w?: number
}

export type tSiUnitKeys = (keyof tSiUnits)[];

export type tUnit = {
    name: string,
    symbol: string,
    domain: eDomain,
    description: string,
    scale: number,
    offset: number,
    category: string,
    searchString: string,
    string: [string, string],
    siPrepend: boolean
};