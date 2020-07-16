import React, {Component, Fragment} from 'react';
import {Spin, message, } from 'antd';
import queryString from 'query-string';
import { userUtils, } from "@/utils";
import { getUserByXsid, getAuthorizedFeatures } from './service.js';

const { setSessionId, setCurrentUser, setCurrentAuth } = userUtils;

const withSessionUser = WrappedComponent => {
  return class extends Component {

    state = {
      loading: true,
    };

    componentDidMount() {
      const queryObj = queryString.parse(window.location.href.split('?')[1]);

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
                this.setState({
                  loading: false,
                });
              }
            });
          } else {
            message.error('您没有权限');
          }
        })
        .catch(err => {
          message.error('接口异常');
        })
      } else {
        this.setState({
          loading: false,
        });
      }
    }

    getRenderComponent = () => {
      const { loading, } = this.state;
      if (loading) {
        return <Spin spinning={true}></Spin>;
      }
      return ( <WrappedComponent {...this.props} />);
    }

    getChildren = () => {
      return this.getRenderComponent();
    }

    render() {
      return (
        <Fragment>
          {this.getChildren()}
        </Fragment>
      );
    }
  }
}

export default withSessionUser;
