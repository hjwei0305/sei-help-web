import React, { Component } from 'react';
import { List, Icon, Skeleton } from 'antd';
import { Link, } from 'umi';

class HotPostList extends Component {

  getTitle = (post) => {
    const { title, commentCount, id, } = post;

    return (<>
      <Link to={`/postDetail/${id}`}>{title}</Link>
      <span style={{ float: 'right' }}>
        <Icon type="message"/>
        {` ${commentCount}`}
      </span>
    </>);
  }

  getPostList = () => {
    const { dataSource, } = this.props;

    return (
      <List
        itemLayout="horizontal"
        dataSource={dataSource}
        renderItem={item => {
          return (
            <List.Item>
              <List.Item.Meta
                title={this.getTitle(item)}
              />
            </List.Item>
          );
        }}
      />
    );
  }

  render() {
    const { loading, } = this.props;
    return (
      <div>
        { loading ? (<Skeleton active />): this.getPostList() }
      </div>
    );
  }
}

export default HotPostList;