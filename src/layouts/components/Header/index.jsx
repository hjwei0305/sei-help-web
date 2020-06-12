import React, { Component } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { Tooltip } from 'antd';
import { Link, withRouter } from 'umi';
import LayoutContainer from '@/components/Layout/LayoutContainer';
import FullScreen from '@/components/FullScreen';
import UserIcon from './components/UserIcon';
import BackIcon from './components/BackIcon';
import styles from './index.less';

@withRouter
@connect(({ homepage, laoding, }) => ({ homepage, laoding, }))
class Header extends Component {

  isHomePage = () => {
    console.log(this.props.history);
    const { location: { pathname } } = this.props.history || { location: {} }
    if (pathname === '/homepage') {
      return true;
    }

    return false;
  }

  render() {
    return (
      <div className={cls(styles['sei-header'])} >
        <LayoutContainer className={cls('header-layout-wraper')}>
          <Link to="/homepage" className={cls('logo')}>
            帮助中心
          </Link>
          <div className={cls('user-nav')}>
            {
              !this.isHomePage() ?
              <Tooltip title="返回" placement="bottom">
                <BackIcon className={cls('trigger')} />
              </Tooltip>
              : null
            }
            <UserIcon />
            <FullScreen className={cls('trigger')} />
          </div>
        </LayoutContainer>
      </div>
    );
  }
}

export default Header;
