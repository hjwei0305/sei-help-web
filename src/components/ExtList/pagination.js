export default function (
    data,
    callback = {},
    options = {
      pageSizeOptions: ["10", "20", "30"],
      showSizeChanger: true
    }
  ) {
    return {
      onChange: callback.onPageNumChange,
      current: data.pageNum,
      pageSize: data.pageSize,
      total: Number(data.totalRows),
      pageSizeOptions: options.pageSizeOptions,
      showSizeChanger: options.showSizeChanger,
      onShowSizeChange: callback.onPageSizeChange,
      showTotal: () => {
        return `共${data.totalRows}条`;
      },
      showQuickJumper: true
    };
  }
    