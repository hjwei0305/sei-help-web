import React, { Fragment, PureComponent, } from 'react';
import withRouter from "umi/withRouter";
import { connect, } from 'dva';
import Header from './components/Header';
import Content from './components/Content';

@withRouter
@connect(({ global, }) => ({ global, }))
class Layout extends PureComponent {

  render() {
    const { children, } = this.props;
    return (
      <Fragment>
        <Header></Header>
        <Content>
          {children}
        </Content>
      </Fragment>
    );
  }
}

export default Layout;

