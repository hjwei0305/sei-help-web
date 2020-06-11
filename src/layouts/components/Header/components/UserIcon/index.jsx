import React from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { router, } from 'umi';
import { Icon, Menu, Avatar } from 'antd';
import ExtDropdown from '@/components/ExtDropdown';
import { userUtils, } from '@/utils';

import styles from './index.less';

const { getCurrentUser, } = userUtils;


@connect(() => ({}))
class UserIcon extends React.Component {

  handleClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/userLogout',
    });
  };

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
    const { userName, } = getCurrentUser() || {};
    return (
      <ExtDropdown overlay={this.dropdownRender()}>
        <span className={cls(styles['user-icon-wrapper'], 'trigger')}>
          <Avatar icon="user" size="13" style={{ color: '#A9B7B7' }} />
          <span className={cls('username')}>{userName}</span>
        </span>
      </ExtDropdown>
    );
  }
}

export default UserIcon;
