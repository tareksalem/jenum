export const Aliases =
  (aliases: string[] | number[] | boolean[]) =>
  (target: any, propertyKey: string) => {
    target[propertyKey].setAliases(aliases);
  };

export const OverrideEnumName =
  (name: string, options?: { exact?: boolean }) =>
  (target: any, propertyKey: string) => {
    target[propertyKey].setOverrideName(name, options);
    // target.prototype[propertyKey] = {
    //   ...(target.prototype[propertyKey] || {}),
    //   overrideName: name,
    //   exact: options?.exact || false,
    //   aliases: [],
    // };
  };

export const ExposedEnumName =
  (name: string) => (target: any, propertyKey: string) => {
    target[propertyKey].setExposedName(name);
    // target.prototype[propertyKey] = {
    //   ...(target.prototype[propertyKey] || {}),
    //   exposedName: name,
    // };
  };
