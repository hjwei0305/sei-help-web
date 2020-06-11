import React from 'react';
import { message, Modal, Checkbox, } from 'antd';
import { BusinessTable, FormModal } from 'seid'
import { saveTab } from '../service.js';
import { deleteById } from '../../service.js';
import { constants, } from '@/utils';

const { communityService, SERVER_PATH, } = constants;
export default class LeftTable extends React.Component {

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
      saveTab(values).then(result => {
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

  handleEdit = (record, e) => {
    this.setState({
      modalVisible: true,
      editData: record,
      modalTitle: '编辑'
    });
    e.stopPropagation();
  }

  handleDel = (record, e) => {
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
    e.stopPropagation();
  }

  getBusinessTableProps = () => {
    const { onSelectedRows } = this.props;
    const btnStyle = { marginRight: 5 };
    return {
      url: `${SERVER_PATH}${communityService}/category/tab/list`,
      isDefaultSelected: true,
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
      rowKey: 'id',
      columns: [{
        title: '操作',
        align: 'center',
        render: (text, record) => {
          let buttons = [(
            <a
              key="edit"
              style={btnStyle}
              onClick={(e) => { this.handleEdit(record, e) } }
            >
              编辑
            </a>
          ),
            (<a
              key="del"
              onClick={(e) => { this.handleDel(record, e) }}
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
      }],
      onSelectedRows: (rows) => {
        if (onSelectedRows) {
          onSelectedRows && onSelectedRows(rows);
        }
      }
    };
  }

  getFormModalProps = () => {
    const { modalTitle, modalVisible, editData } = this.state;
    const formList = [{
      field: 'id',
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
        initData: editData,
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
