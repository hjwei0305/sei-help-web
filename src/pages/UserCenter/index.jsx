import React, { Component } from 'react';
import { connect, } from 'dva';
import { Tabs, } from 'antd';
import cls from 'classnames';
import PageWrapper from '@/components/PageWrapper';
import Post from './MyPost';
import Collect from './MyCollect';
import Comment from './MyComment';
// import AuthorityAssignment from './components/authorityAssignment';
// import AuthorityManagement from './components/authorityManagement';
import Contacts from './Contacts';
import BusinessCategory from './BusinessCategory';

import styles from './index.less';

// import StatisCategory from './components/category/statisCategory';
const { TabPane } = Tabs;
@connect(({ userCenter, loading, }) => ({ userCenter, loading, }))
class UserCenter extends Component {



  render() {
    return (
      <PageWrapper className={cls(styles['user-center-wrapper'])}>
        <Tabs tabPosition='left'>
          <TabPane tab="用户中心" key="user-post">
            <Tabs>
              <TabPane tab="我发的帖" key="my-posts">
                <Post />
              </TabPane>
              <TabPane tab="我收藏的帖" key="collect-posts">
                <Collect />
              </TabPane>
              <TabPane tab="我评论过的帖子" key="my-comments">
                <Comment />
              </TabPane>
            </Tabs>
          </TabPane>
          {/* <TabPane tab="权限管理" key="auth-manage">
            <AuthorityManagement />
          </TabPane>
          <TabPane tab="权限分配" key="auth-assign">
            <AuthorityAssignment />
          </TabPane> */}
          <TabPane tab="联系人" key="contact">
            <Contacts />
          </TabPane>
          <TabPane tab="话题分类" key="category">
            <BusinessCategory />
          </TabPane>
          {/* <TabPane tab="统计分类" key="statis">
            <StatisCategory />
          </TabPane> */}
        </Tabs>
      </PageWrapper>
    );
  }
}

export default UserCenter;
