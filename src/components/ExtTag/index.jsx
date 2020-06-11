import React from 'react';
import cls from 'classnames';
import { Tag, Icon,  } from 'antd';

import styles from './index.less';

const ExtTag = ({ children, borderFont, color="#ffffff", bgColor='#ffffff', onClick, loading, }) => {
  const style = {
    color: color,
    border: borderFont ? `1px solid ${color}` : 'none',
    backgroundColor: bgColor,
  };

  return (
    <Tag className={cls({
      [styles['ext-tag-warpper']]: true,
      [styles['ext-tag-warpper_loading']]: loading,
     })}
     style={style}
     onClick={() => !loading && onClick && onClick() }
    >
      { loading ? (
        <Icon type="loading" />
      ) : null }
      {children}
    </Tag>
  );
}

export default ExtTag;
