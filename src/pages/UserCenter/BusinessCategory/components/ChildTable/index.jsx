import React, { Component, Fragment, } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, } from "antd";
import { isEqual,} from 'lodash';
import { ExtTable, utils, ExtIcon, } from 'suid';
import { constants, } from '@/utils';

import FormModal from './FormModal';

import styles from "../../index.less";
const { communityService,} = constants;

const { authAction } = utils;

@connect(({ businessCategory, loading, }) => ({ businessCategory, loading, }))
class ChildTable extends Component {
  state = {
    delRowId: null,
    selectedRowKeys: [],
  }

  reloadData = _ => {
    const { businessCategory, } = this.props;
    const { currPRowData } = businessCategory;
    if (currPRowData) {
      this.tableRef && this.tableRef.remoteDataRefresh();
    }
  };

  handleSave = (rowData) => {
    const { dispatch, } = this.props;

    dispatch({
      type: "businessCategory/save",
      payload: rowData,
    }).then(res => {
      if (res.success) {
        this.setState({
          selectedRowKeys: [],
        });
        this.reloadData();
      }
    });
  }

  add = _ => {
    const { dispatch } = this.props;

    dispatch({
      type: 'businessCategory/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: null,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'businessCategory/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: rowData,
      },
    });
    e.stopPropagation();
  };

  del = record => {
    const { dispatch, businessCategory } = this.props;
    const { currCRowData, } = businessCategory;
    this.setState(
      {
        delRowId: record.id,
      },
      _ => {
        dispatch({
          type: 'businessCategory/delCRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currCRowData && currCRowData.id === record.id) {
              dispatch({
                type: 'businessCategory/updatePageState',
                payload: {
                  currCRowData: null,
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


  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: "businessCategory/saveChild",
      payload: data,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'businessCategory/updatePageState',
          payload: {
            cVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  closeFormModal = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: 'businessCategory/updatePageState',
      payload: {
        cVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['businessCategory/delCRow'] && delRowId === row.id) {
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

  getExtableProps = () => {
    const { selectedRowKeys, } = this.state;
    const { businessCategory,  } = this.props;
    const { currPRowData, } = businessCategory;
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
        width: 180,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
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
        </Fragment>
      )
    };
    return {
      bordered: false,
      cascadeParams: {
        parentId: currPRowData && currPRowData.id,
      },
      selectedRowKeys,
      searchProperties: ['code', 'name'],
      onSelectRow: (selectedKeys) => {
        let tempKeys = selectedKeys;
        if (isEqual(selectedKeys, selectedRowKeys)) {
          tempKeys = []
        }
        this.setState({
          selectedRowKeys: tempKeys,
        });
      },
      columns,
      // remotePaging: true,
      toolBar: toolBarProps,
      allowCancelSelect: true,
      store: {
        url: `${communityService}/category/biz/list/${currPRowData && currPRowData.id}`,
      },
    };
  };

  getFormModalProps = () => {
    const { loading, businessCategory, } = this.props;
    const { currPRowData, currCRowData, cVisible, } = businessCategory;

    return {
      onSave: this.save,
      pRowData: currPRowData,
      rowData: currCRowData,
      visible: cVisible,
      onCancel: this.closeFormModal,
      saving: loading.effects["businessCategory/saveChild"]
    };
  };

  render() {
    return (
      <div className={cls(styles["container-box"])} >
        <ExtTable onTableRef={inst => this.tableRef = inst} {...this.getExtableProps()} />
        <FormModal {...this.getFormModalProps()} />
      </div>
    );
  }
}

export default ChildTable;
