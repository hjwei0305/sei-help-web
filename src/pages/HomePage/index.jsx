import React, { Component, Fragment } from 'react';
import { connect, } from 'dva';
import { router, } from 'umi';
import { Card, Row, Col, Button, Input, message, Icon, Tooltip, Skeleton, } from 'antd';
import { ScrollBar } from 'suid';
import cls from 'classnames';
import ExtList from '@/components/ExtList';
import ColumnLayout from '@/components/Layout/ColumnLayout';
import HotPostList from './components/HotPostList';
import ContactList from './components/ContactList';
import SubHeader from './components/SubHeader';
import styles from './index.less';
const { Search, } = Input;

@connect(({ homepage, loading,}) => ({homepage, loading}))
class HomePage extends Component {

  handlePage = (pageParams) => {
    const { dispatch, homepage } = this.props;
    const { currsubTabId, currTabId, } = homepage;
    dispatch({
      type: 'homepage/getTopicsByPage',
      payload: {
        tabId: currTabId,
        bizId: currsubTabId === 'all' ? undefined : currsubTabId,
        ...pageParams,
      },
    });
  }

  handleChange = (e) => {
    const { homepage, dispatch } = this.props;
    const { quickSearchValue, } = homepage;
    const { value, } = e.target;
    if (quickSearchValue !== value) {
      dispatch({
        type: 'homepage/updateState',
        payload: {
          quickSearchValue: value,
        },
      });
    }
  }

  handleSearch = () =>{
    const { homepage, dispatch } = this.props;
    const { currTabId, currsubTabId, quickSearchValue, } = homepage;
    dispatch({
      type: 'homepage/getTopicsByPage',
      payload: {
        tabId: currTabId,
        bizId: currsubTabId === 'all' ? undefined : currsubTabId,
        quickSearchValue,
      }
    });
  }

  handleReloadHotPosts = () => {
    const { dispatch, } = this.props;
    dispatch({
      type: 'homepage/getHotPosts',
    });
  }

  handleReloadContacts = () => {
    const { dispatch, } = this.props;
    dispatch({
      type: 'homepage/getContacts',
    });
  }

  handleTabNavClick = (item) => {
    const { dispatch, homepage, } = this.props;
    const { currTabId, } = homepage;
    const { id, } = item;
    if (currTabId !== id) {
      dispatch({
        type: 'homepage/updateState',
        payload: {
          currTabId: id,
          currTab: item,
          currsubTabId: 'all',
        },
      }).then(() => {
        dispatch({
          type: 'homepage/getBusinessCategory',
          payload: {
            id,
          }
        }).then(() => {
          dispatch({
            type: 'homepage/getTopicsByPage',
            payload: {
              tabId: id,
            },
          });
        });
      });
    }
  }

  componentDidMount() {
    const { dispatch, } = this.props;
    this.handleReloadHotPosts();
    this.handleReloadContacts();
    dispatch({
      type: 'homepage/getCategory',
    }).then(result => {
      const { success, data, } = result;
      if (success && data) {
        dispatch({
          type: 'homepage/getBusinessCategory',
          payload: {
            id: data[0].id
          },
        }).then(_ => {
          const { homepage, } = this.props;
          const { currTabId, currsubTabId, quickSearchValue,  } = homepage;
          dispatch({
            type: 'homepage/getTopicsByPage',
            payload: {
              tabId: currTabId,
              bizId: currsubTabId === 'all' ? undefined : currsubTabId,
              quickSearchValue,
            },
          });
        });
      } else {
        message.error('接口错误');
      }
    });
  }

  getCardExtra = () => {
    const { homepage, } = this.props;
    return (
      <Search
        value={homepage.quickSearchValue}
        onChange={this.handleChange}
        enterButton
        placeholder="请输入关键字查询"
        onSearch={this.handleSearch}
      />
    )
  }

  getHotCardProps = () => {
    const { loading, } = this.props;
    return ({
      title: '本周热议',
      bordered: false,
      extra: (
        <Tooltip title='刷新'>
          <Icon
            onClick={this.handleReloadHotPosts}
            twoToneColor
            type="sync"
            spin={loading.effects['homepage/getHotPosts']}
          />
        </Tooltip>
      )
    })
  }

  getContactCardProps = () => {
    const { loading, } = this.props;

    return {
      title: '负责人',
      bordered: false,
      extra: (
        <Tooltip title='刷新'>
          <Icon
            onClick={this.handleReloadContacts}
            twoToneColor
            type="sync"
            spin={loading.effects['homepage/getContacts']}
          />
        </Tooltip>
      )
    };
  }

  getTabNavs = () => {
    const { homepage } = this.props;
    const { categorys, currTabId } = homepage;
    let compnent = null;
    // const tempCateGorys = [{ id: '', name: '全部', }].concat(categorys);
    if (categorys && categorys.length) {
      compnent = categorys.map(item => {
        const { id, name, } = item;
        return (
          <li
            key={id}
            className={cls({
              'tab-nav-item': true,
              'tab-nav-item_actived': currTabId === id,
            })}
            onClick={() => this.handleTabNavClick(item) }
          >
            {name}
          </li>
        );
      });
    }
    return compnent;
  }

  handleCreatePost = () => {
    router.push('/post/create');
  }

  getPostCardTitle = () => {

    return (
      <Button type="primary" onClick={this.handleCreatePost}>发布新帖</Button>
    );

    // const optList = [{
    //   key: '',
    //   label: '全部',
    // }, {
    //   key: 'top',
    //   label: '置顶',
    // }, {
    //   key: 'good',
    //   label: '精华',
    // }];
    // return (
    //   <Fragment>
    //     {
    //       optList.map((item, index) => {
    //         if(index === 0) {
    //           return (
    //             <span key={item.key} className={cls({
    //               'opt-item': true,
    //               'opt-item-actived': true
    //             })}>{item.label}</span>
    //           );
    //         } else {
    //           return (
    //             <Fragment key={item.key}>
    //               <Divider type="vertial" />
    //               <span
    //                 className={cls({
    //                   'opt-item': true,
    //                   // 'opt-item-actived': true
    //                 })}
    //               >
    //                 {item.label}
    //               </span>
    //             </Fragment>
    //           );
    //         }
    //       })
    //     }
    //   </Fragment>
    // );
  }

  render() {
    const { homepage, loading, } = this.props;
    const { topicList, topicPageInfo, hotPostsDetail, contacts } = homepage;

    return (
      <div className={cls(styles['homepage-wrapper'])}>
        <ul className={cls('tab-nav')}>
          {this.getTabNavs()}
        </ul>
        <SubHeader />
        <ColumnLayout
          title={[this.getPostCardTitle(), null]}
          layout={[16, 8]}
          extra={[this.getCardExtra(), null]}
          className={cls('content-wrapper')}
        >
          <div className={cls('content-list-warpper')} slot="left">
            {
              loading.effects['homepage/getTopicsByPage'] ?
              <Fragment>
                <Skeleton active />
                <Skeleton active />
                <Skeleton active />
              </Fragment>
                : <ExtList topics={topicList} pageInfo={topicPageInfo} onPage={this.handlePage} />
            }
          </div>
          <Row className={cls('right-row')} gutter={[0, 8]} slot="right">
            <Col className={cls('right-col')}>
              <Card {...this.getHotCardProps()}>
                <ScrollBar>
                  <HotPostList dataSource={hotPostsDetail} loading={loading.effects['homepage/getHotPosts']} />
                </ScrollBar>
              </Card>
            </Col>
            <Col className={cls('right-col')}>
              <Card {...this.getContactCardProps()}>
                <ScrollBar>
                  <ContactList dataSource={contacts} loading={loading.effects['homepage/getContacts']} />
                </ScrollBar>
              </Card>
            </Col>
          </Row>
        </ColumnLayout>
      </div>
    );
  }
}

export default HomePage;
