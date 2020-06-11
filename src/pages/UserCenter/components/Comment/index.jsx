import React, { Component } from 'react';
import { connect, } from 'dva';
import ExtList from '@/components/ExtList';
import PageWrapper from '@/components/PageWrapper';

@connect(({ userCenter, loading, }) => ({ userCenter, loading, }))
class Comment extends Component {
  handlePage = (pageParams) => {
    this.getMyComments(pageParams);
  }

  getMyComments = (params) => {
    const { dispatch, userCenter, } = this.props;
    const { pageSize, detail, } = userCenter.comments;
    let { page, } = detail || {};
    dispatch({
      type: 'userCenter/getPostInfo',
      optType: 'comments',
      payload: {
        pageNo: page || 1,
        pageSize,
        ...params
      },
    });
  }

  componentDidMount() {
    this.getMyComments();
  }

  render() {
    const { userCenter, } = this.props;
    const { comments, } = userCenter;
    const { pageSize, detail, } = comments;
    let extList = [];
    let pageInfo = {
      pageNum: 1,
      pageSize: pageSize,
      totalRows: 0,
    };
    if (detail) {
      const { page, records, rows,  } = detail;
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

export default Comment;
