import React, { Component } from 'react';
import { connect, } from 'dva';
import moment from 'moment';
import { Tooltip, List, Row, Col, Icon, Checkbox, Button, Modal, message, Divider, Drawer } from 'antd';
import { Attachment, utils, } from 'suid';
import cls from 'classnames';

// 引入编辑器组件
import BraftEditor from 'braft-editor';
import ExtTag from '@/components/ExtTag';

import { userUtils, constants, optAuths } from '@/utils';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

import styles from './index.less';
// import { rules } from 'marked/src/InlineLexer';

const { isCurrUser, } = userUtils;
const { SEIEDMSERVICE, } = constants;
const { authAction, } = utils;

const { DEL_COMMENT, EDIT_COMMENT, TOP_COMMENT, } = optAuths
const DATEFORMATSTR = 'YYYY-MM-DD HH:mm';

@connect(({postDetail, loading, }) => ({ postDetail, loading, }))
class CommentList extends Component {

  state = {
    editorState: BraftEditor.createEditorState(null),
    editId: undefined,
    editIndex: -1,
    action: 'create',
    drawerVisible: false,
  }

  reloadPostDetail = () => {
    const { dispatch, postDetail } = this.props;
    const { detail, } = postDetail;
    dispatch({
      type: 'postDetail/getPostDetail',
      payload: {
        id: detail.topic.id,
      },
    });
  }

  handleSave = (e) => {
    if (e.charCode === 13 && (e.ctrlKey || e.metaKey)) {
      this.handleComment();
    }
  }

  handleComment = () => {
    const { replyId, editId, action, } = this.state;
    const { dispatch, postDetail, } = this.props;
    const { detail, } = postDetail;
    let tempFiles = this.attachmentRef.getAttachmentStatus().fileList;
    if(tempFiles) {
      this.docIds = tempFiles.map(attach => attach.id || attach.uid);
    }
    const content = this.editorStateContent;
    const reg = /<p>\s*<\/p>/;
    if (!content || reg.test(content)) {
      message.error('亲，请先添加评论内容哦');
      this.editorContainer.focus();
      return;
    } else {
      dispatch({
        type: 'postDetail/saveComment',
        optType: action,
        payload: {
          id: editId,
          topic: { id: detail.topic.id },
          content,
          docIds: this.docIds,
          anonymous: !!this.anonymous,
          parentId: replyId
        },
      }).then(result => {
        const { success, } = result;
        if (success) {
          this.reloadPostDetail();
        }
      });
    }
  }

  handleReply = (replyId, userName) => {
    this.setState({
      replyId: replyId,
      editId: undefined,
    }, () => {
      this.setState({
        editorState: BraftEditor.createEditorState(`@${userName}`)
      }, () => {
        this.editorContainer.focus();
      });
    });
  }

  handleEditComment = (id, content, index) => {
    this.setState({
      editId: id,
      editIndex: index,
      action: 'create',
      editorState: BraftEditor.createEditorState(content)
    }, () => {
      this.editorContainer.focus();
    });
  }

  handleDelComment = (id) => {
    const { dispatch, } = this.props;

    Modal.confirm({
      title: '温馨提示',
      content: '真的要删除这个评论吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'postDetail/deleteComment',
          payload: {
            id,
          }
        }).then(result => {
          const { success } = result;
          if (success) {
            this.reloadPostDetail()
          }
        });
      }
    });
  }

  handleToggleLikeComment = (item, index) => {
    const { dispatch, postDetail, } = this.props;
    const { comments, } = postDetail;
    const { liked, likeCount=0, id, topicId } = item;
    let optType = 'like';
    if(liked) {
      optType = 'dislike';
    }
    dispatch({
      type: 'postDetail/toggleLikeComment',
      optType,
      payload: {
        commentId: id,
        topicId,
      }
    }).then(result => {
      const { success, message: msg, } = result;
      if (success) {
        const tempLikeCount = optType === 'like' ? likeCount + 1 : likeCount - 1;
        const tempItem = { ...item, liked: !liked, likeCount: tempLikeCount };
        comments.splice(index, 1, tempItem)
        dispatch({
          type: 'postDetail/updateState',
          payload: {
            comments,
          },
        });
      } else {
        message.error(msg);
      }
    });
  }

  handleGoodComment = (item, index) => {
    const { dispatch, postDetail, } = this.props;
    const { comments, } = postDetail;
    const { good, id, } = item;
    dispatch({
      type: 'postDetail/goodComment',
      payload: {
        id,
      },
    }).then(res => {
      const { success, message: msg, } = res;
      if (success) {
        const tempItem = { ...item, good: !good };
        comments.splice(index, 1, tempItem)
        dispatch({
          type: 'postDetail/updateState',
          payload: {
            comments,
          },
        });
      } else {
        message.error(msg);
      }
    });
  }

  handleEditorChange = (editorState) => {
    this.setState({
      editorState,
    }, () => {
      this.editorStateContent = editorState.toHTML();
    });
  }

  focusEditor = (isClear=true) => {
    if (isClear) {
      this.setState({
        editorState: BraftEditor.createEditorState(null),
        replyId: '',
        editId: undefined,
        action: 'create',
        drawerVisible: true,
      }, () => {
        this.editorContainer.focus();
      });
    } else {
      this.editorContainer.focus();
    }
  }

  componentDidMount() {
    const { onRef } = this.props;
    this.editorContainer = document.querySelector(`.${styles['comment-list-wrapper']} .public-DraftEditor-content`);
    onRef && onRef(this)
  }

  getListItemTitle = (comment) => {
    const { userInfo, createdDate, good, } = comment;

    return <div>
      {`${userInfo}`}
      <Tooltip placement="bottom" title={moment(createdDate).format(DATEFORMATSTR)}>
        {moment(createdDate).fromNow()}
      </Tooltip>
      { good ? <span style={{ float: 'right', }}><ExtTag bgColor="#FF5722">加精</ExtTag></span> : null}

    </div>;
  }

  getListItemContent = (comment, index) => {
    const { content, good, likeCount, id, userInfo, creatorId: userId, liked, createdDate, } = comment;

    return (
      <Row>
        <Col>
          <p className="comment-content" dangerouslySetInnerHTML={{__html: content}}></p>
        </Col>
        <Col>
          <Row type="flex" justify="space-between">
            <Col>
              <span className={cls('info-item')}>
                {userInfo}
              </span>
              <span className={cls('info-item')}>
                <Tooltip placement="bottom" title={moment(createdDate).format(DATEFORMATSTR)}>
                  {moment(createdDate).fromNow()}
                </Tooltip>
              </span>
              { good ? <span className={cls('info-item')} ><ExtTag bgColor="#FF5722">精华</ExtTag></span> : null}
            </Col>
            <Col>
            <span
                className={cls('info-item')}
                onClick={() => this.handleReply(id, userInfo) }
              >
                <Icon
                  type="message"
                  style={{
                    fontSize: 20,
                  }}
                />
                回复
              </span>
              <span
                className={cls({'info-item': true, 'like-item': true, 'like-item_active': liked, })}
                onClick={() => this.handleToggleLikeComment(comment, index) }
              >
                <Icon type="like" theme="filled" style={{
                  fontSize: 20,
                }} />
                {likeCount}
              </span>
              {
                authAction([
                  <span
                    key={EDIT_COMMENT}
                    ignore={isCurrUser(userId)}
                    className={cls('info-item')}
                    onClick={() => this.handleEditComment(id, content, index)}
                  >
                    编辑
                  </span>,
                  <span
                    key={DEL_COMMENT}
                    ignore={isCurrUser(userId)}
                    className={cls('info-item')}
                    onClick={() => this.handleDelComment(id, index)}
                  >
                    删除
                  </span>,
                  <span
                    key={TOP_COMMENT}
                    ignore={isCurrUser(userId)}
                    className={cls('info-item')}
                    onClick={() => this.handleGoodComment(comment, index)}
                  >
                    { good ? '取消加精': '加精' }
                  </span>
                ])
              }
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  getCommentList = () => {
    const { postDetail } = this.props;
    const { comments, } = postDetail;

    return (
      <List
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={(item, index) => {
          return (
            <List.Item>
              <List.Item.Meta
                // title={this.getListItemTitle(item)}
                description={this.getListItemContent(item, index)}
              />
            </List.Item>
          );
        }}
      />
    );
  }

  render() {
    const { editorState, editId, } = this.state;
    const { loading, postDetail } = this.props;
    const { comments, } = postDetail;

    return (
      <div className={cls(styles['comment-list-wrapper'])}>
        <div className="edit-icon">
          <Tooltip title="评论">
            <Icon type="form" onClick={this.focusEditor}/>
          </Tooltip>
        </div>
        <Divider>{`评论【${comments.length}】`}</Divider>
        {this.getCommentList()}
          <BraftEditor
            style={{
              marginTop: 5,
            }}
            value={editorState}
            onKeyPress={this.handleSave}
            placeholder="写点什么!"
            onChange={this.handleEditorChange}
          />
          <Attachment
            key={editId}
            onAttachmentRef={inst => this.attachmentRef = inst}
            entityId = {editId}
            serviceHost={SEIEDMSERVICE}
          />
          <Row>
            <Col style={{ float: 'right', marginTop: 10,}}>
              <Checkbox
                onChange={(e) => {
                  this.anonymous = e.target.checked;
                }}
              >
                匿名
              </Checkbox>
              <Button
                type="primary"
                loading={loading.effects['postDetail/saveComment']}
                onClick={this.handleComment}
              >
                评论
              </Button>
            </Col>
          </Row>
      </div>
    );
  }
}

export default CommentList;
