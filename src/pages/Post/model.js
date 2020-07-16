import { getPostDetail, createTopic, getCategory, getStaticCategory, getBusinessCategory, findById, } from "./service";
import { message } from "antd";

export default {
  namespace: "post",
  state: {
    currTabId: '',
    currSubTabId: '',
    optionsData: [],
    businessCategories: [],
    staticCategories: [],
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen(location => {
        if ("/post/create" === location.pathname) {
          dispatch({
            type: "getPreData"
          });
        }
      });
    }
  },
  effects: {
    * getPreData(_, { call, put, }) {
      const result = yield Promise.all([getCategory(), getStaticCategory()]);
      const [tabResult, staticResult] = result || [null, null];
      const { success: tabSuccess, data: tabCategories, } = tabResult || {};
      const { success: staticSuccess, data: staticCategories, } = staticResult || {};

      let businessCategories = []
      if (tabSuccess && tabCategories && tabCategories.length) {
        const businessResult = yield call(getBusinessCategory, tabCategories[0].id);
        const { success, data } = businessResult;
        if(success) {
          businessCategories = data;
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          businessCategories,
          staticCategories: staticSuccess ? staticCategories : [],
          optionsData: tabCategories,
        },
      });
    },
    * createTopic({ payload }, { call, put, }) {
      const result = yield call(createTopic, payload);
      const { success, message: msg,  } = result || {};
      message.destroy();
      message.config({
        top: 60,
      });
      if (!success) {
        message.error(msg);
      }
      return result;
    },
    * getBusinessCategory({ payload }, { call, put, }) {
      const result = yield call(getBusinessCategory, payload.id);
      const { success, data, } = result;
      if (success && data) {
        yield put({
          type: '_updateState',
          payload: {
            businessCategories: data,
            currSubTabId: '',
          },
        });
      }
      return result;
    },
    * getPostDetail({ payload }, { call, }) {
      const result = yield call(getPostDetail, payload);
      return result;
    },
    * updateState({ payload, }, { put, }) {
      yield put({
        type: '_updateState',
        payload,
      });
      return payload;
    },
  },
  reducers: {
    _updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
