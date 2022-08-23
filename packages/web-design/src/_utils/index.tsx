export const defaultPrefixCls = 'lilith-plat';

let globalPrefixCls: string;

export function getGlobalPrefixCls() {
  return globalPrefixCls || defaultPrefixCls;
}

export function getPrefixCls(suffixCls?: string, customizePrefixCls?: string) {
  console.log('????');

  if (customizePrefixCls) {
    return customizePrefixCls;
  }
  return suffixCls ? `${getGlobalPrefixCls()}-${suffixCls}` : getGlobalPrefixCls();
}
