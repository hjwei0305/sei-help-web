import React, { Component } from 'react';
import { connect, } from 'dva';
import ExtList from '@/components/ExtList';
import PageWrapper from '@/components/PageWrapper';

@connect(({ myPost, loading, }) => ({ myPost, loading, }))
class Post extends Component {

  handlePage = (pageParams) => {
    this.getMyPosts(pageParams);
  }

  getMyPosts = (params) => {
    const { dispatch, myPost, } = this.props;
    const { pageSize, detail, } = myPost.posts;
    let { page, } = detail || {};
    dispatch({
      type: 'myPost/getPostInfo',
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
    const { myPost, } = this.props;
    const { posts, } = myPost;
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
