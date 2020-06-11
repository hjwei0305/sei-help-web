import React, { Component } from 'react';
import cls from 'classnames';
import { connect, } from 'dva';
// import { Button, } from 'antd';
import { router, } from 'umi';
import LayoutContainer from '@/components/Layout/LayoutContainer';
import styles from './index.less';

@connect(({homepage, loading, }) => ({ homepage, loading, }))
class SubHeader extends Component {

  handleCreatePost = () => {
    router.push('/post/create');
  }

  handleSubTabClick = (item) => {
    const { homepage, dispatch, } = this.props;
    const { currsubTabId, currTabId } = homepage;
    if (currsubTabId !== item.id) {
      dispatch({
        type: 'homepage/updateState',
        payload: {
          currsubTabId: item.id,
          currSubTab: item,
        }
      }).then(() => {
        dispatch({
          type: 'homepage/getTopicsByPage',
          payload: {
            tabId: currTabId,
            bizId: item.id === 'all' ? undefined : item.id,
          },
        });
      });
    }
  }

  getSubTabNav = () => {
    const { homepage } = this.props;
    const { businessCategorys, currsubTabId, } = homepage;
    let component = null;
    if (businessCategorys) {
      component = [{ id: 'all', name: '全部' }].concat(businessCategorys).map(item => {
        const { id, name, } = item;

        return (
          <li
            key={id}
            onClick={() => this.handleSubTabClick(item)}
            className={cls({
              "sub-tab-nav-item": true,
              "sub-tab-nav-item_actived": currsubTabId === id,
            })}
          >
            {name}
          </li>
        );
      })
    }
    return component;
  }

  render() {
    return (
      <div className={cls(styles['sei-sub-header'])}>
        <LayoutContainer>
          <ul className="sub-tab-nav">
            {this.getSubTabNav()}
          </ul>
          <div></div>
          <div className={cls('sub-header-right')}>
            {/* <Button type="primary" onClick={this.handleCreatePost}>发布新帖</Button> */}
          </div>
        </LayoutContainer>
      </div>
    );
  }
}

export default SubHeader;
