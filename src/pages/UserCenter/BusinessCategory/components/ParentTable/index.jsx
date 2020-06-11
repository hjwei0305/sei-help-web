import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, Tooltip, Tag } from 'antd';
import { utils, ExtIcon, ExtTable, } from 'suid';
import { constants, } from '@/utils';

import FormModal from './FormModal';
import styles from './index.less';

const { communityService,} = constants;

const { authAction } = utils;

@connect(({ businessCategory, loading }) => ({ businessCategory, loading }))
class CascadeTableMaster extends Component {
  state = {
    delRowId: null,
    selectedRowKeys: [],
  };

  add = _ => {
    const { dispatch } = this.props;

    dispatch({
      type: 'businessCategory/updatePageState',
      payload: {
        pVisible: true,
        isAddP: true,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'businessCategory/updatePageState',
      payload: {
        pVisible: true,
        isAddP: false,
        currPRowData: rowData,
      },
    });
    e.stopPropagation();
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'businessCategory/saveParent',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'businessCategory/updatePageState',
          payload: {
            pVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  del = record => {
    const { dispatch, businessCategory } = this.props;
    const { currPRowData, } = businessCategory;
    this.setState(
      {
        delRowId: record.id,
      },
      _ => {
        dispatch({
          type: 'businessCategory/delPRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currPRowData && currPRowData.id === record.id) {
              dispatch({
                type: 'businessCategory/updatePageState',
                payload: {
                  currPRowData: null,
                }
              }).then(() => {
                this.setState({
                  delRowId: null,
                });
              });
            } else {
              this.setState({
                delRowId: null,
              });
            }
            this.reloadData();
          }
        });
      },
    );
  };

  closeFormModal = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: 'businessCategory/updatePageState',
      payload: {
        pVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['businessCategory/delPRow'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return (
      <ExtIcon
        onClick={e => e.stopPropagation()}
        tooltip={{ title: '删除' }}
        className="del"
        type="delete"
        antd
      />
    );
  };

  getFormModalProps = () => {
    const { loading, businessCategory } = this.props;
    const { pVisible, currPRowData, isAddP } = businessCategory;

    return {
      osSave: this.save,
      rowData: isAddP ? null : currPRowData,
      visible: pVisible,
      onCancel: this.closeFormModal,
      saving: loading.effects['businessCategory/saveParent'],
    };
  };

  reloadData = _ => {
    this.tableRef && this.tableRef.remoteDataRefresh();
  };

  getExtableProps = () => {
    const { dispatch, } = this.props;
    const columns = [
      {
        title: "操作",
        key: "operation",
        width: 85,
        align: "center",
        dataIndex: "id",
        className: "action",
        required: true,
        render: (_, record) => {
          return (
            <>
              <div className="action-box" onClick={e => e.stopPropagation()}>
                {authAction(
                  <ExtIcon
                    key={'edit'}
                    className="edit"
                    onClick={e => this.edit(record, e)}
                    type="edit"
                    ignore="true"
                    tooltip={
                      { title: '编辑' }
                    }
                    antd
                  />,
                )}
                {record.frozen ? null : (
                  <Popconfirm
                    key='delete'
                    placement="topLeft"
                    title="确定要删除吗？"
                    onCancel={e => e.stopPropagation()}
                    onConfirm={e => {
                      this.del(record);
                      e.stopPropagation();
                    }}
                  >
                    {this.renderDelBtn(record)}
                  </Popconfirm>
                )}
              </div>
            </>
          );
        }
      },
      {
        title: "代码",
        dataIndex: "code",
        width: 120,
        required: true,
      },
      {
        title: "名称",
        dataIndex: "name",
        width: 160,
        required: true,
        render: (text, record) => <Tooltip title={record.className}>{text}</Tooltip>
      },
    ];

    const toolBarProps = {
      left: (
        <>
          {authAction(
            <Button
              key={'add'}
              type="primary"
              onClick={this.add}
              ignore='true'
            >
              新建
            </Button>
          )}
          <Button onClick={this.reloadData}>
            刷新
          </Button>
        </>
      )
    };
    return {
      bordered: false,
      // remotePaging: true,
      // searchProperties: ['code', 'name'],
      columns,
      toolBar: toolBarProps,
      onSelectRow: (_, selectedRows) => {
        dispatch({
          type: 'businessCategory/updatePageState',
          payload: {
            currPRowData: selectedRows[0],
          },
        });
      },
      store: {
        url: `${communityService}/category/tab/list`,
      },
    };
  };

  render() {
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => this.tableRef = inst} {...this.getExtableProps()} />
        <FormModal {...this.getFormModalProps()} />
      </div>
    );
  }
}

export default CascadeTableMaster;
