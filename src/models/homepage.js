import {
  getCategory,
  getBusinessCategory,
  getTopicsByPage,
  getHotPosts,
  getContacts,
} from "@/services/homepage";

export default {
  namespace: "homepage",
  state: {
    categorys: [],
    contacts: [],
    businessCategorys: [],
    currTabId: '',
    currTab: null,
    currsubTabId: 'all',
    currSubTab: null,
    topicList: [],
    quickSearchValue: '',
    topicPageInfo: {
      pageNum: 1,
      pageSize: 10,
      totalRows: 0,
    },
    hotPostsDetail: [],
  },
  effects: {
    * getCategory(_, { call, put, }) {
      const result = yield call(getCategory);
      const { success, data } = result;
      if (success && data.length) {
        yield put({
          type: '_updateState',
          payload: {
            categorys: data,
            currTabId: data[0].id,
            currTab: data[0],
          },
        });
      }
      return result;
    },
    * getBusinessCategory({ payload, }, { call, put, }) {
      const result = yield call(getBusinessCategory, payload.id);
      const { data, success, } = result;
      if (success && data) {
        yield put({
          type: '_updateState',
          payload: {
            businessCategorys: data,
          },
        });
      }
      return result;
    },
    * getTopicsByPage({ payload, }, { call, put, select, }) {
      const result = yield call(getTopicsByPage, payload);
      const homepage = yield select(state => state.homepage);
      const { pageNum, pageSize, } = homepage.topicPageInfo;
      const { success, data, } = result || {};
      const { rows, records, } = data || {};

      if (success) {
        yield put({
          type: '_updateState',
          payload: {
            topicList: rows,
            topicPageInfo: {
              pageNum: payload.pageNo || pageNum,
              pageSize: payload.pageSize || pageSize,
              totalRows: records,
            },
          },
        });
      }
      return result;
    },
    * getHotPosts(_, { call, put, select, }) {
      const result = yield call(getHotPosts);
      const { success, data, } = result || {};
      if (success) {
        yield put({
          type: '_updateState',
          payload: {
            hotPostsDetail: data,
          },
        });
      }
      return result;
    },
    * getContacts(_, { call, put, }) {
      const result = yield call(getContacts);
      const { success, data, } = result;
      if (success) {
        yield put({
          type: '_updateState',
          payload: {
            contacts: data,
          },
        });
      }
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
