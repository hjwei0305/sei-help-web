import React, { Component } from 'react';
import { connect, } from 'dva';
import ExtList from '@/components/ExtList';
import PageWrapper from '@/components/PageWrapper';

@connect(({ myPost, loading, }) => ({ myPost, loading, }))
class Collect extends Component {

  handlePage = (pageParams) => {
    this.getMyCollects(pageParams);
  }

  getMyCollects = (params) => {
    const { dispatch, myPost, } = this.props;
    const { pageSize, detail, } = myPost.collects;
    let { page, } = detail || {};
    dispatch({
      type: 'myPost/getPostInfo',
      optType: 'collects',
      payload: {
        pageNo: page || 1,
        pageSize,
        ...params
      },
    });
  }

  componentDidMount() {
    this.getMyCollects();
  }

  render() {
    const { myPost, } = this.props;
    const { collects, } = myPost;
    const { pageSize, detail, } = collects;
    let extList = [];
    let pageInfo = {
      pageNum: 1,
      pageSize: pageSize,
      totalRows: 0,
    };
    if (detail) {
      const { page, records, rows,  } = detail;
      extList = rows.map(({ topic }) => topic);
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

export default Collect;
