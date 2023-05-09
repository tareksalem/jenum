import { BaseEnum, IBaseEnum, IEnumOptionSetting, IGetEnumOptions } from "./baseEnum";

/* eslint-disable @typescript-eslint/no-this-alias */
export interface IBaseComplexEnum<T> extends IBaseEnum<T> {
  toJSON(): string;
}

export type BaseComplexEnumType<T> = {
  new (option: T): IBaseComplexEnum<T>;
  GetFromString(name: string): IBaseEnum<T> | undefined | null;
  GetAvailableOptions(options?: IGetEnumOptions): T[];
  GetAvailableOptionsAsObjects(): IBaseEnum<T>[];
  GetAvailableOptionsAsMap(): Map<string, IBaseEnum<T>>;
  GetAvailableOptionsKeys(): string[];
};

export function ComplexEnum<T>(): BaseComplexEnumType<T> {
  class BaseComplexEnum extends BaseEnum<T>() implements IBaseComplexEnum<T> {
    private readonly option: T;
    private readonly settings: IEnumOptionSetting<T> = {};

    constructor(option: T) {
      super(option);
      this.option = option;
    }

    public static GetFromString(
      name: any,
    ): IBaseComplexEnum<T> | undefined | null {
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
        if (typeof value?.option === 'object' && value?.option !== null) {
          const foundOption = Object.keys(value.option).find((optionKey) => {
            const optionValue = value.option[optionKey];
            return (
              name === optionValue ||
              name?.toLowerCase?.() === optionKey?.toLowerCase?.() ||
              name?.toLowerCase?.() === optionValue ||
              name === optionValue?.toLowerCase?.()
            );
          });
          if (foundOption) {
            return foundOption;
          }
        }
        return (
          key === name ||
          key?.toLowerCase?.() === name?.toLowerCase?.() ||
          key?.toLowerCase?.() === name ||
          key === name?.toLowerCase?.() ||
          name === value ||
          name?.toLowerCase?.() === value?.option?.toLowerCase?.() ||
          name?.toLowerCase?.() === value.option ||
          name === value?.option?.toLowerCase?.() ||
          availableAliases.includes(name)
        );
      });
      if (foundItem) {
        return Enum[foundItem];
      }
      return null;
    }

    toString() {
      return JSON.stringify(this.option);
    }

    toJSON() {
      return JSON.stringify(this.option);
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
  }
  return BaseComplexEnum;
}
