import React, { Component } from 'react';
import { Drawer, Checkbox, Button, Row, Col } from 'antd';
import { RichEditor, Attachment, } from 'suid';
import { constants,  } from '@/utils';

const { SEIEDMSERVICE, } = constants;


export class EditDrawer extends Component {
  render() {
    const { visible, onClose, title, editData, saving } = this.props;
    const { content, id: editId,  } = editData || {};
    return (
      <Drawer
        visible={visible}
        onClose={onClose}
        title={title}
      >
          <RichEditor
            style={{
              marginTop: 5,
            }}
            defaultValue={content}
            // value={editorState}
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
                loading={saving}
                onClick={this.handleComment}
              >
                评论
              </Button>
            </Col>
          </Row>
      </Drawer>
    );
  }
}

export default EditDrawer;
