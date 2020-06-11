import React from 'react';
import { message, Modal, Checkbox } from 'antd';
import { BusinessTable, FormModal } from 'seid'
import { saveBiz } from '../service.js';
import { deleteById } from '../../service.js';
import { constants, } from '@/utils';

const { communityService, SERVER_PATH, } = constants;
export default class RightTable extends React.Component {

  state = {
    modalTitle: '',
    modalVisible: false,
    editData: null,
  }

  handleOk = (err, values) => {
    if (!err) {
      this.setState({
        modalVisible: false,
      });
      saveBiz(values).then(result => {
        const { code, description: msg } = result;
        if (code === 200) {
          message.success(msg);
          this.businessTableRef.refreshData();
        } else {
          message.error(msg);
        }
      });
    }
  }

  handleCancel = () => {
    this.setState({
      modalVisible: false,
      editData: null,
    });
  }

  handleEdit = (record) => {
    this.setState({
      modalVisible: true,
      editData: record,
      modalTitle: '编辑'
    });
  }

  handleDel = (record) => {
    Modal.confirm({
      title: '温馨提示',
      content: '删除后不可恢复，确定要删除？',
      onOk: () => {
        deleteById(record.id).then(result => {
          const { code, description: msg } = result;
          if (code === 200) {
            message.success(msg);
            this.businessTableRef.refreshData();
          } else {
            message.error(msg);
          }
        });
      },
    });
  }

  getBusinessTableProps = () => {
    const { leftTableRowId } = this.props;
    const btnStyle = { marginRight: 5 };

    return {
      url: `${SERVER_PATH}${communityService}/category/biz/list/${leftTableRowId}`,
      isInitFetchData: false,
      rowKey: 'id',
      // params: { leftTableRowId },
      toolBarCfg: { left: [{
        title: '新增',
        type: 'primary',
        onClick: () => {
          this.setState({
            modalVisible: true,
            modalTitle: '新增'
          });
        }
      }] },
      columns: [{
        title: '操作',
        align: 'center',
        render: (text, record) => {
          let buttons = [(
            <a
              key="edit"
              style={btnStyle}
              onClick={() => { this.handleEdit(record) } }
            >
              编辑
            </a>
          ),
            (<a
              key="del"
              onClick={() => { this.handleDel(record) }}
            >
              删除
            </a>)
          ]
          return buttons;
        }
      },{
        title: '名称',
        dataIndex: 'name',
      },{
        title: '排序',
        dataIndex: 'rank',
      }, {
        title: '删除',
        dataIndex: 'isDel',
        render(text) {
          return (
            <Checkbox checked={text} />
          );
        }
      }]
    };
  }

  getFormModalProps = () => {
    const { modalTitle, modalVisible, editData } = this.state;
    const { leftTableRowId } = this.props;

    const formList = [{
      field: 'id',
      config: {
        hidden: true,
      }
    }, {
      field: 'parentId',
      config: {
        hidden: true,
      }
    }, {
      field: 'name',
      label: '名称',
      rules: [{
        required: true,
        message: '名称不能为空！',
      }]
    }, {
      type: 'InputNumber',
      field: 'rank',
      label: '排序',
      rules: [{
        required: true,
        message: '排序不能为空！',
      }]
    }];

    return {
      modalProps: {
        title: modalTitle,
        visible: modalVisible,
        destroyOnClose: true,
        onOk: this.handleOk,
        onCancel: this.handleCancel
      },
      formProps: {
        formList,
        initData: { ...editData, parentId: leftTableRowId },
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <BusinessTable ref={inst => this.businessTableRef=inst } {...this.getBusinessTableProps()} />
        <FormModal {...this.getFormModalProps()}/>
      </React.Fragment>
    );
  }
}
