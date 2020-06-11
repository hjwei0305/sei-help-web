import { getPosts, getCollects, getComments, } from "../service";
const methodMap = {
  'posts': getPosts,
  'comments': getComments,
  'collects': getCollects,
};

export default {
  namespace: "myPost",
  state: {
    collects: {
      pageSize: 10,
      detail: null,
    },
    comments: {
      pageSize: 10,
      detail: null,
    },
    posts: {
      pageSize: 10,
      detail: null,
    },
  },
  effects: {
    * getPostInfo({ payload, optType }, { call, put, }) {
      const result = yield call(methodMap[optType], payload);

      const { success, data,  } = result || {};
      // const { page, records, total, rows,  } = detail || {};
      if (success) {
        yield put({
          type: '_updateState',
          payload: {
            [optType]: { pageSize: payload.pageSize, detail: data },
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
