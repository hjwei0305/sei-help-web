import React, { Component } from 'react';
import { connect, } from 'dva';
import ExtList from '@/components/ExtList';
import PageWrapper from '@/components/PageWrapper';

@connect(({ userCenter, loading, }) => ({ userCenter, loading, }))
class Post extends Component {

  handlePage = (pageParams) => {
    this.getMyPosts(pageParams);
  }

  getMyPosts = (params) => {
    const { dispatch, userCenter, } = this.props;
    const { pageSize, detail, } = userCenter.posts;
    let { page, } = detail || {};
    dispatch({
      type: 'userCenter/getPostInfo',
      optType: 'posts',
      payload: {
        pageNo: page || 1,
        pageSize,
        ...params
      },
    });
  }

  componentDidMount() {
    this.getMyPosts();
  }

  render() {
    const { userCenter, } = this.props;
    const { posts, } = userCenter;
    const { pageSize, detail, } = posts;
    let extList = [];
    let pageInfo = {
      pageNum: 1,
      pageSize: pageSize,
      totalRows: 0,
    };
    if (detail) {
      const { page, records, total, rows,  } = detail;
      extList = rows;
      pageInfo = {
        pageSize,
        totalRows: records,
        pageNum: page,
      };
    }
    return (
      <PageWrapper>
        <ExtList topics={extList} pageInfo={pageInfo} onPage={this.handlePage} />
      </PageWrapper>
    );
  }
}

export default Post;
