import React from 'react';
import cls from 'classnames';
import styles from './index.less';

const LayoutContainer = ({ children, className }) => {
  return (
    <div className={cls(styles['layout-container'], className)}>
      {children}
    </div>
  );
};

export default LayoutContainer;