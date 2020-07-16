import React from 'react';
import { Spin, message } from 'antd';
import { withRouter, router, } from "umi";
import qs from 'qs';
import { connect } from 'dva';
import { userUtils,  } from '@/utils';
import { getUserByXsid, getAuthorizedFeatures } from './service.js';

const { setSessionId, setCurrentUser, setCurrentAuth } = userUtils;

@withRouter
@connect(({}) => ({}))
class SsoWrapperPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const queryObj = qs.parse(window.location.href.split('?')[1]);
    if (queryObj._s) {
      setSessionId(queryObj._s);
      getUserByXsid({
        sid: queryObj._s,
      })
      .then(result => {
        const { data, success } = result;
        if (success) {
          setCurrentUser(data);
          getAuthorizedFeatures().then(res => {
            const { success: getSuccess, data: authData} = res;
            if (getSuccess) {
              setCurrentAuth(authData['/sei-help-web/center'] || [])
            }
          });
          router.push('/homepage');
        } else {
          message.error('您没有权限');
        }
      })
      .catch(err => {
        message.error('接口异常');
      })
    } else {
      message.error('您没有权限');
    }

  }

  render() {
    const { loading } = this.state;
    return (
      <Spin spinning={loading}>
        <div style={{
          height: 'calc(100vh)',
        }}></div>
      </Spin>
    );
  }
}

export default SsoWrapperPage;
