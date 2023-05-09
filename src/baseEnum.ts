/* eslint-disable @typescript-eslint/no-this-alias */
export interface IBaseEnum<T> {
  toString(): string;
  getOption(): T;
  getAliases(): T[];
  getExposedName(): string;
  getOverrideName(): string;
}

export interface IGetEnumOptions {
  includeAliases?: boolean;
}

export interface IOverrideNameSetting {
  name: string;
  exact?: boolean;
}

export interface IEnumOptionSetting<T> {
  aliases?: T[];
  exposedName?: string;
  overrideName?: IOverrideNameSetting;
}

export type BaseEnumType<T> = {
  new (option: T): IBaseEnum<T>;
  GetFromString(name: string): IBaseEnum<T> | undefined | null;
  GetAvailableOptions(options?: IGetEnumOptions): T[];
  GetAvailableOptionsAsObjects(): IBaseEnum<T>[];
  GetAvailableOptionsAsMap(): Map<string, IBaseEnum<T>>;
  GetAvailableOptionsKeys(): string[];
};

export function BaseEnum<T>(): BaseEnumType<T> {
  class BaseEnumClass implements IBaseEnum<T> {
    private readonly option?: T;
    private readonly settings: IEnumOptionSetting<T> = {};

    constructor(option: T) {
      this.option = option;
    }

    static GetFromString(name: any): IBaseEnum<T> | undefined | null {
      const Enum = this;
      const foundItem = Object.keys(Enum).find((key) => {
        const value = Enum[key];
        const availableAliases = Enum[key].getAliases();
        const overrideName = Enum[key].settings.overrideName;
        if (overrideName && typeof overrideName?.name === 'string') {
          return overrideName?.exact
            ? overrideName.name === name || overrideName.name == name
            : overrideName.name?.toLowerCase() === name?.toLowerCase?.();
        }
        return (
          key === name ||
          key == name ||
          key?.toLowerCase?.() === name?.toLowerCase?.() ||
          key?.toLowerCase?.() === name ||
          key === name?.toLowerCase?.() ||
          name === value ||
          name == value ||
          name === value?._option ||
          name == value?._option ||
          name?.toLowerCase?.() === value?._option?.toLowerCase?.() ||
          name?.toLowerCase?.() === value._option ||
          name === value?._option?.toLowerCase?.() ||
          availableAliases.includes(name)
        );
      });
      if (foundItem) {
        return Enum[foundItem];
      }
      return null;
    }

    toString() {
      return `${this.option}`;
    }

    getOption(): T {
      return this.option;
    }

    private setAliases(aliases: T[]) {
      this.settings.aliases = aliases;
    }

    public getAliases(): T[] {
      return this.settings.aliases || [];
    }

    private setOverrideName(name: string, options: { exact?: boolean } = {}) {
      this.settings.overrideName = { name, ...options }
    }

    public getOverrideName() {
      return this.settings.overrideName?.name;
    }

    private setExposedName(name: string) {
      this.settings.exposedName = name;
    }

    public getExposedName() {
      return this.settings.exposedName;
    }

    static GetAvailableOptions(options: IGetEnumOptions = {}): T[] {
      const Enum = this;
      const keys = Object.keys(Enum);
      const result: T[] = [];
      keys.forEach((key) => {
        result.push(Enum[key].getOption());
        if (options.includeAliases) {
          result.push(...Enum[key].getAliases());
        }
      });
      return result;
    }

    static GetAvailableOptionsAsObjects(): BaseEnumClass[] {
      const Enum = this;
      const keys = Object.keys(Enum);
      return keys.map((key) => Enum[key]);
    }

    static GetAvailableOptionsAsMap(): Map<string, BaseEnumClass> {
      const Enum = this;
      return new Map(Object.entries(Enum));
    }

    static GetAvailableOptionsKeys(): string[] {
      const Enum = this;
      const keys = Object.keys(Enum);
      return keys.map((key) => {
        if (Enum[key].settings.exposedName) {
          return Enum[key].settings.exposedName;
        }
        return key;
      });
    }
  }

  return BaseEnumClass;
}
