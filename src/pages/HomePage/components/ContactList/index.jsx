import React, { Component, Fragment, } from 'react';
import { List, Typography, Skeleton } from 'antd';
import { Link, } from 'umi';

const { Paragraph } = Typography;

class ContactList extends Component {

  getTitle = (post) => {
    const { name, telNumber,} = post;
    return (
      <Fragment>
        <Link>{name}</Link>
        <span style={{ float: 'right' }}>
          <Paragraph copyable={{ text: telNumber, }}>
            {`${telNumber}`}
          </Paragraph>
        </span>
      </Fragment>
    );
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

export default ContactList;
