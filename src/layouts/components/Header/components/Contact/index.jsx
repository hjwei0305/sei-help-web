import React from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { router, } from 'umi';
import { Icon, Menu, } from 'antd';
import ExtDropdown from '@/components/ExtDropdown';

import styles from './index.less';

@connect(() => ({}))
class UserIcon extends React.Component {

  handleSetting = () => {
    router.push('/usercenter');
  };

  dropdownRender = () => {
    const menu = (
      <Menu selectedKeys={[]}>
        <Menu.Item key="setting" onClick={this.handleSetting}>
          <Icon type="user" />
          用户中心
        </Menu.Item>
      </Menu>
    );

    return menu;
  };

  render() {
    return (
      <ExtDropdown overlay={this.dropdownRender()}>
        <span className={cls(styles['contact-icon-wrapper'], 'trigger')}>
          <Icon type="phone" size="13" />
        </span>
      </ExtDropdown>
    );
  }
}

export default UserIcon;
