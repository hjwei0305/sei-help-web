import React, { Component } from 'react';
import { connect, } from 'dva';
import { Link,  } from 'umi';
import { Icon, Tooltip } from 'antd';
import cls from 'classnames';
import moment from 'moment';
import ExtList from '@/components/ExtList';
import PageWrapper from '@/components/PageWrapper';

const DATEFORMATSTR = 'YYYY-MM-DD HH:mm';

@connect(({ myPost, loading, }) => ({ myPost, loading, }))
class Comment extends Component {
  handlePage = (pageParams) => {
    this.getMyComments(pageParams);
  }

  getMyComments = (params) => {
    const { dispatch, myPost, } = this.props;
    const { pageSize, detail, } = myPost.comments;
    let { page, } = detail || {};
    dispatch({
      type: 'myPost/getPostInfo',
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

  renderContent = (item) => {
    const { topic, } = item;
    const {
      id,
      commentCount,
      userInfo,
      userId,
      createdDate,
      content,
      lastCommentUserInfo,
      lastCommentTime,
    } = topic;
    const user = {
      username: userInfo,
      userId,
    };

    return (
      <div className="topic-desc">
        <div>
          <div className="topic-desc-detail" dangerouslySetInnerHTML={{__html: content}} />
          { lastCommentUserInfo ? (
            <div style={{
              float: 'right',
            }}>
              <Link to={`/postDetail/${id}`}>
                <Icon type="message" theme="twoTone" />
                <span className={cls("tag-item")}>{lastCommentUserInfo}</span>
                <span className={cls("tag-item")}>
                  <Tooltip title={moment(lastCommentTime).format(DATEFORMATSTR)}>
                    {moment(lastCommentTime).fromNow()}
                  </Tooltip>
                </span>
              </Link>

            </div>
          ) : null }

        </div>
        <span className={cls("tag-item")}>
          {user.username}
       </span>
        <span className={cls("tag-item")}>
          <Tooltip title={moment(createdDate).format(DATEFORMATSTR)}>
            {moment(createdDate).fromNow()}
          </Tooltip>
        </span>
        <span style={{
          float: 'right',
        }}>
          <Link to={`/postDetail/${id}`} className={cls("tag-item")}>
            <Icon type="message"/>
            {` ${commentCount}`}
          </Link>
        </span>
      </div>
    );
  }

  render() {
    const { myPost, } = this.props;
    const { comments, } = myPost;
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
        <ExtList
          renderTitle={(item) => {
            const { topic} = item;
            const { url, id, title, bizName, top, tabName } = topic;
            let cmp = (
              <Link
                style={{ fontSize: 16, }}
                to={`/postDetail/${id}`}
              >
                {title}
              </Link>
            );
            if (url) {
              let hostname = new URL(url).hostname;
              cmp = (
                <span style={{
                  fontSize: 18,
                }}>
                  <a href={url} target="_blank" rel="noopener noreferrer">{`[转]${title}`}</a>
                  {`  ${hostname}`}
                </span>
              );
            }
            return (
              <div className="topic-title-wrapper">
                {/* { tabName ? <Tag className={cls('tag-border-font-color')}>{tabName}</Tag> : null } */}
                {/* { bizName? <Tag className={cls('tag-border-font-color')}>{bizName}</Tag> : null } */}
                {cmp}
                {/* { top ? <Tag color="red" style={{ float: 'right', }}>置顶</Tag> : null } */}
              </div>
            );
          }}
          renderContent={this.renderContent}
          topics={extList}

          pageInfo={pageInfo}
          onPage={this.handlePage}
        />
      </PageWrapper>
    );
  }
}

export default Comment;
