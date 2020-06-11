import React from 'react';
import LayoutContainer from '@/components/Layout/LayoutContainer';
import cls from 'classnames';
import styles from './index.less';

const Content = ({ children, className, }) => {
  return (
    <LayoutContainer className={cls(styles['sei-content'], className)}>
      {children}
    </LayoutContainer>
  );
};

export default Content;