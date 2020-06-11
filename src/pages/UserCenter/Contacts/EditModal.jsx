import React, { PureComponent } from "react";
import { Form, Input, InputNumber } from "antd";
import { ExtModal } from 'suid';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};

@Form.create()
class FormModal extends PureComponent {

  handleSave = _ => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, editData, formData);
      onSave && onSave(params);
    });
  };

  render() {
    const { form, editData, onClose, saving, visible } = this.props;
    const { getFieldDecorator } = form;
    const title = editData ? '编辑' : '新增';

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        onOk={this.handleSave}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="名称">
            {getFieldDecorator("name", {
              initialValue: editData && editData.name,
              rules: [{
                required: true,
                message: "名称不能为空"
              }]
            })(<Input />)}
          </FormItem>
          <FormItem label="电话号码">
            {getFieldDecorator('telNumber', {
              initialValue: editData && editData.telNumber,
              rules: [{
                required: true,
                message: "电话号码不能为空"
              }]
            })(<Input />)}
          </FormItem>
          <FormItem label="排序">
            {getFieldDecorator('rank', {
              initialValue: (editData && editData.rank) || 0,
            })(<InputNumber style={{ width: '100%' }} />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
