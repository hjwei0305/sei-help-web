import React from 'react';
import { ExtIcon, } from 'suid';
import { router, } from 'umi';

export default class BackIcon extends React.Component {
  state = {
    isFullscreen: false,
  };


  handleBack = () => {
    router.goBack()
  };

  render() {
    const { className } = this.props;

    return (
      <span onClick={this.handleBack} className={className}>
        <ExtIcon tooltip={{ title: '返回' }} type="rollback" antd />
      </span>
    );
  }
}
