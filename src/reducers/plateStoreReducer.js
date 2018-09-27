import actionTypes from '../actions/actionTypes';

const initialState = {
  plateStore: [],
};

const plateStoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PLATESTORE_GETALL: {
      const { d, r } = action.payload;
      if (r) {
        return {
          ...state,
          plateStore: d,
        };
      }

      return state;
    }

    case actionTypes.PLATESTORE_SAVE: {
      const { d, r } = action.payload;
      if (r) {
        return {
          ...state,
          plateStore: state.plateStore.map((record) => ({
            ...record,
            ...(d.plate === record.plate ? d : {}),
          })),
        };
      }

      return state;
    }

    case actionTypes.PLATESTORE_ADD: {
      const { d, r } = action.payload;
      if (r) {
        return {
          ...state,
          plateStore: [...state.plateStore, d],
        };
      }

      return state;
    }

    case actionTypes.PLATESTORE_REMOVE: {
      const { d, r } = action.payload;
      if (r) {
        return {
          ...state,
          plateStore: state.plateStore.filter(({ plate }) => plate !== d),
        };
      }

      return state;
    }

    default:
      return state;
  }
};

export default plateStoreReducer;
