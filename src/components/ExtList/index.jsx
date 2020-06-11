import React, { Component } from 'react';
import { Link } from 'umi';
import { Avatar, List, Icon, Tag, Tooltip, Pagination } from 'antd';
import { ScrollBar, } from 'suid';
import cls from 'classnames';
import moment from 'moment';
import 'moment/locale/zh-cn';
import pagination from './pagination.js';

import styles from './index.less';

const DATEFORMATSTR = 'YYYY-MM-DD HH:mm';

class ExtList extends Component {

  getPagination = () => {
    const { onPage, pageInfo, } = this.props;

    if (pageInfo) {
      return pagination(pageInfo, {
        onPageNumChange: (current, pageSize) => {
          onPage && onPage({pageSize, pageNo: current, });
        },
        onPageSizeChange: (current, pageSize) => {
          onPage && onPage({pageSize, pageNo: current, });
        },
      });
    }
    return false;
  };

  getTitle = (topic) => {
    const { renderTitle, } = this.props;
    if (renderTitle) {
      return renderTitle(topic);
    }
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
        { tabName ? <Tag className={cls('tag-border-font-color')}>{tabName}</Tag> : null }
        { bizName? <Tag className={cls('tag-border-font-color')}>{bizName}</Tag> : null }
        {cmp}
        { top ? <Tag color="red" style={{ float: 'right', }}>置顶</Tag> : null }
      </div>
    );
  }

  getContent = (topic) => {
    const { renderContent, } = this.props;
    if (renderContent) {
      return renderContent(topic);
    }
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

  getAvatar = (item) => {
    const { renderAvatar, } = this.props;
    if (renderAvatar) {
      return renderAvatar(item);
    }
    return (
      <Avatar size="large" style={{ width: 20, height: 20, backgroundColor: '#364760' }}></Avatar>
    );
  }

  getTopics = () => {
    const { topics, } = this.props;

    return (
      <List
        itemLayout="horizontal"
        dataSource={topics}
        renderItem={item => {
          return (
            <List.Item>
              <List.Item.Meta
                avatar={this.getAvatar(item)}
                title={this.getTitle(item)}
                description={this.getContent(item)}
              />
            </List.Item>
          );
        }}
      />
    );
  }

  render() {

    return (
      <div className={cls(styles["ext-list-wrapper"])}>
        <div className="list-container">
          <ScrollBar>
            {this.getTopics()}
          </ScrollBar>
        </div>
        <div className="tcl-footer">
          <Pagination size="small" {...this.getPagination()} />
        </div>
      </div>
    )
  }
}

export default ExtList;
