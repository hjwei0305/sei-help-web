import React, { Component, Fragment, } from 'react';
import { connect, } from 'dva';
import cls from 'classnames';
import { router, } from 'umi';
import moment from 'moment';
import { Tooltip, Row, Col, Icon, Divider, Empty, Modal, message, Skeleton} from 'antd';
import { Attachment, ScrollBar, utils } from 'suid';
import { constants, optAuths, userUtils, } from '@/utils';
import ExtTag from '@/components/ExtTag';
import withSessionUser from '@/components/withSessionUser';
import CommentList from './components/CommentList';
import styles from './index.less';

const { authAction, } = utils;
const { isCurrUser, } = userUtils;
const { SEIEDMSERVICE, } = constants;
const DATEFORMATSTR = 'YYYY-MM-DD HH:mm';

@withSessionUser
@connect(({ postDetail, loading, }) => ({ postDetail, loading, }))
class PostDetail extends Component {
  constructor(props) {
    super(props);
    this.postDetailId = this.props.match.params.id;
    this.state = {
      detail: null,
    }
  }

  reloadPostDetail = () => {
    const { dispatch, postDetail } = this.props;
    const { detail, } = postDetail;
    dispatch({
      type: 'postDetail/getPostDetail',
      payload: {
        id: detail.topic.id,
      },
    }).then(result => {
      const { success, data} = result;
      if(success) {
        this.setState({
          detail: data
        });
      }
    });
  }

  handleReply = () => {
    this.commentRef.focusEditor()
  }

  handleEdit = () => {
    const { postDetail } = this.props;
    const { detail, } = postDetail;
    router.push(`/post/edit/${detail.topic.id}`);
  }

  handleDel = () => {
    const { dispatch, postDetail } = this.props;
    const { detail, } = postDetail;
    Modal.confirm({
      title: '温馨提示',
      content: '真的要删除这个话题吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'postDetail/deleteTopic',
          payload: {
            id: detail.topic.id,
          },
        }).then(result => {
          const { success, message: msg, } = result || {};
          if(success) {
            router.push('/homepage');
          } else {
            message.error(msg);
          }
        });
      }
    });
  }

  handleCollect = (collect) => {
    const { dispatch, postDetail } = this.props;
    const { detail, } = postDetail;
    let payload = { topic: { id: detail.topic.id, } }
    if (collect) {
      payload = {
        topicId: detail.topic.id,
      };
    }
    dispatch({
      type: 'postDetail/collectTopic',
      optType: collect ? 'del': '',
      payload,
    }).then(result => {
      const { success, } = result;
      if (success) {
        this.reloadPostDetail();
      }
    });
  }

  handleTop = () => {
    const { dispatch, postDetail } = this.props;
    const { detail, } = postDetail;
    dispatch({
      type: 'postDetail/topTopic',
      payload: {
        id: detail.topic.id,
      },
    }).then(result => {
      const { success, } = result;
      if (success) {
        this.reloadPostDetail();
      }
    });
  }

  handleGood = () => {
    const { dispatch, postDetail } = this.props;
    const { detail, } = postDetail;
    dispatch({
      type: 'postDetail/goodTopic',
      payload: {
        id: detail.topic.id,
      },
    }).then(result => {
      const { success, } = result;
      if (success) {
        this.reloadPostDetail();
      }
    });
  }

  componentDidMount() {
    const { dispatch, match, } = this.props;
    dispatch({
      type: 'postDetail/getPostDetail',
      payload: {
        id: match.params.id,
      },
    }).then(result => {
      const { success, data} = result;
      if(success) {
        this.setState({
          detail: data
        });
      }
    });
  }

  render() {
    const { loading, } = this.props;
    const { detail, } = this.state;
    const { topic, comments, collect } = detail || {};

    return (
      <div ref={inst => this.wrapper=inst} className={cls(styles['post-detail-warpper'])}>
        <ScrollBar>
        { topic ? (
          <Fragment>
            <div className={cls('post-detail')}>
              <header className={cls('detail-header')}>
                <h1 className={cls('title')}>
                  {/* <ExtTag bgColor="#5FB878">{topic.tabName}</ExtTag>
                  <ExtTag bgColor="#5FB878">{topic.bizName}</ExtTag> */}
                  {topic.title}
                  <span style={{ float: 'right' }}>
                    {topic.top ? (<ExtTag bgColor="#393D49">已置顶</ExtTag>) : null}
                    { collect ? (<ExtTag bgColor="#FF5722">已收藏</ExtTag>) : null}
                    {topic.good ? (<ExtTag bgColor="#FF5722">精华</ExtTag>) : null}
                  </span>
                </h1>
              </header>
              <Row type="flex" justify="space-between">
                <Col>
                  <span style={{ marginRight: 10, }}>{topic.userInfo}</span>
                  <span style={{ marginRight: 10, }}>
                    <Tooltip placement="bottom" title={moment(topic.createdDate).format(DATEFORMATSTR)}>
                      {moment(topic.createdDate).fromNow()}
                    </Tooltip>
                  </span>
                </Col>
                <Col>
                  <span className={cls('info-item')} onClick={this.handleReply}>
                    <Icon type="message" style={{ fontSize: 16, }} />{topic.commentCount}
                  </span>
                  <span className={cls('info-item')}><Icon type="eye" style={{ fontSize: 16, }} />{topic.view}</span>
                </Col>
              </Row>
              <Row>
              {authAction([
                <ExtTag borderFont key={optAuths.EDIT_TOPIC} ignore={isCurrUser(topic.creatorId)} color="#009688" onClick={this.handleEdit}>编辑</ExtTag>,
                <ExtTag borderFont key={optAuths.DEL_TOPIC} ignore={isCurrUser(topic.creatorId)} loading={loading.effects['postDetail/deleteTopic']} color="#009688" onClick={this.handleDel}>删除</ExtTag>,
                <ExtTag borderFont ignore={isCurrUser(topic.creatorId)} key={optAuths.GOOD_TOPIC} loading={loading.effects['postDetail/goodTopic']} color="#009688" onClick={this.handleGood}>{topic.good ? '取消加精' : '加精'}</ExtTag>,
                <ExtTag borderFont ignore={isCurrUser(topic.creatorId)} key={optAuths.TOP_TOPIC} loading={loading.effects['postDetail/topTopic']} color="#009688" onClick={this.handleTop}>{topic.top ? '取消置顶' : '置顶'}</ExtTag>,
              ])}
                  <ExtTag key="collect" borderFont loading={loading.effects['postDetail/collectTopic']} color="#009688" onClick={() => this.handleCollect(collect)}>{ collect ? '取消收藏' : '收藏'}</ExtTag>
              </Row>
              <Divider />
                {
                  topic.content ?
                  (
                    <React.Fragment>
                      <div className={cls('detail-concent')} dangerouslySetInnerHTML={{__html: topic.content}}></div>
                      <Divider
                        dashed={true}
                      >
                        附件
                      </Divider>
                      <Attachment
                        allowUpload={false}
                        allowDelete={false}
                        serviceHost={SEIEDMSERVICE}
                        entityId = {topic.id}
                        onChange = { (docIds) => {
                          this.setState({
                            attachNum: docIds.length
                          });
                        } }
                      />
                    </React.Fragment>
                  )
                  : <Empty description="暂无话题内容" />
                }
            </div>
            <CommentList onRef={inst => this.commentRef = inst} dataSource={comments} />
          </Fragment>
        ) : <Fragment>
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </Fragment> }
        </ScrollBar>
        {/* <BackTop target={() =>  this.wrapper}></BackTop> */}
      </div>
    );
  }
}

export default PostDetail;
