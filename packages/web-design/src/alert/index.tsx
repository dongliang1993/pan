import { PropsWithChildren } from 'react';

import { getPrefixCls } from '../_utils';
export interface AlertProps {
  /**
   * @description       Alert 的类型
   * @default           'info'
   */
  kind?: 'info' | 'positive' | 'negative' | 'warning';
}

export type KindMap = Record<Required<AlertProps>['kind'], string>;

const kinds: KindMap = {
  info: '#5352ED',
  positive: '#2ED573',
  negative: '#FF4757',
  warning: '#FFA502',
};

const Alert: React.FC<PropsWithChildren<AlertProps>> = ({ children, kind = 'info', ...rest }) => {
  const prefixCls = getPrefixCls('alert');

  return (
    <div
      className={prefixCls}
      style={{
        background: kinds[kind],
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Alert;
