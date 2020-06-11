import {
  getPostDetail,
  createComment,
  updateComment,
  deleteComment,
  goodComment,
  likeComment,
  dislikeComment,
  deleteTopic,
  topTopic,
  goodTopic,
  saveCollect,
  delCollect,
} from "./service";

const funMap = {
  'create': createComment,
  'update': updateComment,
  'like': likeComment,
  'dislike': dislikeComment,
}

export default {
  namespace: "postDetail",
  state: {
    detail: null,
    currComment: null,
    comments: [],
  },
  effects: {
    * getPostDetail({ payload, }, { call, put, }) {
      const result = yield call(getPostDetail, payload);

      const { success, data,  } = result || {};
      if (success) {
        yield put({
          type: '_updateState',
          payload: {
            detail: data,
            comments: data.comments,
          },
        });
      }

      return result;
    },
    * saveComment({ payload, optType, }, { call, put, }) {
      const result = yield call(funMap[optType], payload);

      const { success, data,  } = result || {};
      if (success) {
        yield put({
          type: '_updateState',
          payload: {
            currComment: data,
          },
        });
      }

      return result;
    },
    * deleteComment({ payload, }, { call, }) {
      const result = yield call(deleteComment, payload);

      return result;
    },
    * goodComment({ payload, }, { call, }) {
      const result = yield call(goodComment, payload);

      return result;
    },
    * toggleLikeComment({ payload, optType, }, { call, }) {
      const result = yield call(funMap[optType], payload);

      return result;
    },
    * deleteTopic({ payload, }, { call, }) {
      const result = yield call(deleteTopic, payload);

      return result;
    },
    * topTopic({ payload, }, { call, }) {
      const result = yield call(topTopic, payload);

      return result;
    },
    * goodTopic({ payload, optType, }, { call, }) {
      const result = yield call(goodTopic, payload);

      return result;
    },
    * collectTopic({ payload, optType, }, { call, }) {
      let tempOpt = saveCollect;
      if (optType === 'del') {
        tempOpt = delCollect;
      }
      const result = yield call(tempOpt, payload);

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
