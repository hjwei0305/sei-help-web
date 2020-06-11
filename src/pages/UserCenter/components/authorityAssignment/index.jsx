import React from 'react';
import {
	Button,
	message,
	Modal,
  Table,
  Checkbox,
} from 'antd';
import {
	BusinessTable,
	FormModal
} from 'seid'
import PageWrapper from '@/components/PageWrapper';
import {
	save,
	deleteByAccount,
	findAllAuthority,
} from './service.js';
import { constants, } from '@/utils';
const { communityService, SERVER_PATH, } = constants;

export default class  extends React.Component {

	state = {
		modalTitle: '',
		modalVisible: false,
		editData: null,
    authorities: [],
	}

  componentDidMount() {
    findAllAuthority().then(result => {
      if (result && result.length) {
        let tempResult = result.filter(item => !item.frozen);
        this.setState({
          authorities: tempResult.map(item => ({ label: item.name, value: item.code })),
        });
      }
    });
  }

	handleOk = (err, values) => {
		if (!err) {
			this.setState({
				modalVisible: false,
			});
      const { authorities } = this.state;
      const temp = authorities.filter(item => values.authorities.includes(item.value));
			save({ ...values, authorities: temp.map(item=>({ authorityCode: item.value, authorityName: item.label}))}).then(result => {
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
				deleteByAccount(record.account).then(result => {
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

  /** 嵌套子表格数据 */
  expandedRowRender = (record, index, indent, expanded) => {
    const columns = [{
      title: '权限代码',
      width: 150,
      align: 'center',
      dataIndex: 'authorityCode',
    }, {
      title: '权限名称',
      width: 250,
      align: 'center',
      dataIndex: 'authorityName'
    }];

    return (
      <Table rowKey="authorityCode"  columns={columns} dataSource={record.authorities} pagination={false} />
    );
  }

	getBusinessTableProps = () => {
		const styleObj = {  marginRight: 5 };

		return {
			url: `${SERVER_PATH}${communityService}/userAuthority/findAll`,
			method: 'get',
      rowKey: 'account',
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
					const buttons = [(
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
				title: '员工号',
				dataIndex: 'account',
				sorter: true,
			}, {
        title: '员工名称',
        dataIndex: 'userName',
      },],
      expandedRowRender: this.expandedRowRender,
		};
	}

	getFormModalProps = () => {
		const {
			modalTitle,
			modalVisible,
			editData,
      authorities,
		} = this.state;

		const formList = [{
			field: 'id',
			config: {
				hidden: true,
			}
		}, {
      field: 'account',
      label: '员工号',
      rules: [{
        required: true,
        message: '员工号不能为空！',
      }]
    }, {
      field: 'userName',
      label: '员工名称',
      rules: [{
        required: true,
        message: '员工名称不能为空！',
      }]
    }, {
      type: 'RadioGroup',
			field: 'authorities',
			label: '功能项',
      comp: (
        <Checkbox.Group options={authorities} />
      ),
      config: {
        options: authorities,
      },
			rules: [{
				required: true,
				message: '功能项不能为空！',
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
				initData: { ...editData, authorities: editData ? editData.authorities.map(item => item.authorityCode) : []},
			}
		}
	}

	render() {
		const styleObj = {
    	height: '100%'
    };

		return (
			<PageWrapper >
        <BusinessTable ref={inst => this.businessTableRef=inst } {...this.getBusinessTableProps()} />
        <FormModal {...this.getFormModalProps()}/>
	    </PageWrapper>
		);
	}
}
