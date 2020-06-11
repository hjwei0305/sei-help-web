import React, { Component, Fragment } from 'react';
import { connect, } from 'dva';
import { router, } from 'umi';
import { Button, Row, Checkbox, Col, Spin, Skeleton, } from 'antd';
import { ScrollBar, } from 'suid';
import cls from 'classnames';
import TopicForm from './form';

import styles from './index.less';

@connect(({ post, homepage, loading, }) => ({ post, homepage, loading, }))
class EditPost extends Component {

  state = {
    editData: null,
  };

  componentDidMount() {
    const { dispatch, match, } = this.props;
    dispatch({
      type: 'post/getPostDetail',
      payload: {
        id: match.params.id,
      }
    }).then(result => {
      const { success, data, } = result;
      if (success) {
        this.setState({
          editData: data.topic,
        });
      }
    });
  }

  /** 创建话题 */
  create = () => {
    if (this.topicFormRef) {
      const { dispatch } = this.props;
      this.topicFormRef.onSubmit({ anonymous: this.anonymous})
      .then(values => {
        dispatch({
          type: 'post/createTopic',
          payload: values,
        }).then(result => {
          const { success, data, } = result;
          if (success) {
            router.push(`/postDetail/${data.id}`);
          }
        });
      })
    }
  }

  render() {
    const { loading, } = this.props;
    const { editData, } = this.state;

    return (
      <div className={cls(styles['post-warpper'])}>
        <ScrollBar>
          <Spin spinning={loading.global}>
            { editData ? (
              <Fragment>
                <TopicForm editData={editData} onRef={inst => this.topicFormRef = inst }/>
                <Row
                  type="flex"
                  style={{
                    marginTop: 10,
                    justifyContent: 'flex-end'
                  }}
                >
                  <Col>
                    <Checkbox onChange={(e) => {
                      this.anonymous = e.target.checked;
                    }}>匿名</Checkbox>
                    <Button style={{ marginRight: 10 }} type="primary" onClick={() => { this.create() }}>发布</Button>
                  </Col>
                </Row>
              </Fragment>
            ) : (
              <Fragment>
                <Skeleton active />
                <Skeleton active />
                <Skeleton active />
              </Fragment>
            ) }

          </Spin>
        </ScrollBar>
      </div>
    );
  }
}

export default EditPost;
