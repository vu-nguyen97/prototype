interface BaseType {
  id: string;
  active: boolean;
  name: string;
}

interface Theme extends BaseType {
  attributionClickUrl: string;
  attributionImpressionUrl: string;
  rawAppId: string;
  storeId: string;
  storeUrl: string;
  unityLinked: boolean;
}

export interface App extends BaseType {
  themes: Theme[];
}
