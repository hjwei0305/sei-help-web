import React, { Component } from 'react';
import { Form, Input, } from 'antd';
import { Attachment, ComboList } from 'suid';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
import { constants } from '@/utils';

// 引入编辑器样式
import 'braft-editor/dist/index.css';

const { Item: FormItem } = Form;
const { SEIEDMSERVICE, communityService, } = constants;

const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 18
  }
};

@Form.create({
  // mapPropsToFields(props) {
  //   const { tabId, bizId, } = props.editData || {};
  //   return {
  //     ...props.editData
  //     // username: Form.createFormField({
  //     //   ...props.username,
  //     //   value: props.username.value,
  //     // }),
  //   };
  // },
})
class TopicForm extends Component {

  state = {
    tabId: '',
  }

  componentDidMount() {
    const { onRef, } = this.props;

    if (onRef) {
      onRef(this);
    }
  }

  onSubmit = (extraParms) => {
    const { form: { validateFieldsAndScroll }, editData } = this.props;
    return new Promise((resolve, reject) => {
      validateFieldsAndScroll((err, values) => {
        if (err) {
          reject(err);
        }

        let tempFiles = values.Attachments;
        if (!tempFiles && this.attachmentRef) {
          tempFiles = this.attachmentRef.getAttachmentStatus().fileList;
        }
        resolve({
          ...editData,
          ...values,
          ...extraParms,
          content: values.content.toHTML(),
          url: values.url || '',
          docIds: tempFiles ? tempFiles.map(attach => attach.id || attach.uid) : [],
        });
      });
    });
  }

  getTabComboListProps = () => {
    const { form, } = this.props;

    return  {
      form,
      store: {
        autoLoad: false,
        url: `${communityService}/category/tab/list`,
      },
      name: 'tabName',
      placeholder: '请选择主题分类',
      reader: {
        name: 'name',
        field: ['id']
      },
      field: ['tabId'],
      afterSelect: (item) => {
        this.setState({
          tabId: item.id,
        }, () => {
          const { form: { setFieldsValue } } = this.props;
          setFieldsValue({
            bizId: '',
            bizName: '',
          });
        });
      }
    };
  }

  getBizComboListProps = () => {
    const { tabId, } = this.state;
    const { form, } = this.props;

    return  {
      form,
      key: tabId,
      store: {
        autoLoad: false,
        url: `${communityService}/category/biz/list/${tabId}`,
      },
      field: ['bizId'],
      name: 'bizName',
      placeholder: '请选择业务分类',
      reader: {
        name: 'name',
        field: ['id']
        // description: 'name',
      }
    };
  }

  render() {
    const { editData, form: { getFieldDecorator }, } = this.props;
    const { tabId='', tabName, bizId='', bizName='', title='', id='', url, content, } = editData || {};

    return (
      <div>
          <Form {...formItemLayout}>
            <FormItem label="主题分类Id" style={{ display: 'none' }}>
              {getFieldDecorator('tabId', {
                initialValue: tabId,
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="主题分类">
              {getFieldDecorator('tabName', {
                initialValue: tabName,
                rules: [{
                  required: true,
                  message: '主题分类不能为空'
                }],
              })(
                <ComboList {...this.getTabComboListProps()} />
              )}
            </FormItem>
            <FormItem label="业务分类Id" style={{ display: 'none' }}>
              {getFieldDecorator('bizId', {
                initialValue: bizId,
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="业务分类">
              {getFieldDecorator('bizName', {
                initialValue: bizName,
                rules: [{
                  required: true,
                  message: '业务分类不能为空'
                }],
              })(
                <ComboList {...this.getBizComboListProps()} />
              )}
            </FormItem>
            <FormItem label="标题">
              {getFieldDecorator('title', {
                initialValue: title,
                rules: [{
                  required: true,
                  message: '标题不能为空'
                }],
              })(
                <Input placeholder='标题' />
              )}
            </FormItem>
            <FormItem label="外链">
              {getFieldDecorator('url', {
                initialValue: url,
              })(
                <Input placeholder='外链' />
              )}
            </FormItem>
            <FormItem label="话题内容">
              {getFieldDecorator('content', {
                validateTrigger: 'onBlur',
                initialValue: BraftEditor.createEditorState(content),
                rules: [{
                  required: true,
                  validator: (_, value, callback) => {
                    if (value.isEmpty()) {
                      callback('内容不能为空')
                    } else {
                      callback()
                    }
                  }
                }],
              })(
                <BraftEditor placeholder="话题内容" />
              )}
            </FormItem>
            <FormItem label="附件">
            {getFieldDecorator("Attachments", {
              })(
                <Attachment
                  onAttachmentRef={inst => this.attachmentRef = inst}
                  entityId = {id}
                  serviceHost={SEIEDMSERVICE}
              />
              )}
            </FormItem>
          </Form>
      </div>
    );
  }
}

export default TopicForm;
