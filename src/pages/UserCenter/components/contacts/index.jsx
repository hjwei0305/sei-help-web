import React from 'react';
import {
    message,
    Modal
} from 'antd';
import {
    BusinessTable,
    FormModal
} from 'seid'
import {
    save,
    deleteById
} from './service.js';
import { constants, } from '@/utils';

const { communityService, SERVER_PATH, } = constants;

export default class  extends React.Component {

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
            save(values).then(result => {
        const {
          code,
          description
        } = result;
        if (code === 200) {
          message.success(description);
          this.businessTableRef.refreshData();
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
          const {
            code,
            description
          } = result;
          if (code === 200) {
            message.success(description);
            this.businessTableRef.refreshData();
          }
                });
            },
        });
    }

    getBusinessTableProps = () => {
        const styleObj = {  marginRight: 5 };

        return {
            url: `${SERVER_PATH}${communityService}/contractInfo/findAll`,
            method: 'get',
            toolBarCfg: {
                left: [{
                    title: '新增',
                    onClick: () => {
                        this.setState({
                            modalVisible: true,
                            modalTitle: '新增'
                        });
                    }
                }]
            },
            columns: [{
                title: '操作',
                align: 'center',
                render: (text, record) => {
                    let buttons = [(
                        <a
              key="edit"
              style={styleObj}
              onClick={() => { this.handleEdit(record) } }
            >
              编辑
            </a>
                    ), (
                        <a
              key="del"
              onClick={() => { this.handleDel(record) }}
            >
              删除
            </a>
          )];
                    return buttons;
                }
            }, {
        title: '名称',
        dataIndex: 'name',
      }, {
        title: '电话号码',
        dataIndex: 'telNumber',
      }, {
                title: '排序',
                dataIndex: 'rank',
            }]
        };
    }

    getFormModalProps = () => {
        const {
            modalTitle,
            modalVisible,
            editData
        } = this.state;
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
      field: 'telNumber',
      label: '电话号码',
      rules: [{
        required: true,
        message: '电话号码不能为空！',
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
        const styleObj = {
        height: '100%',
    };

        return (
            <div style={styleObj}>
        <BusinessTable ref={inst => this.businessTableRef=inst } {...this.getBusinessTableProps()} />
        <FormModal {...this.getFormModalProps()}/>
        </div>
        );
    }
}
