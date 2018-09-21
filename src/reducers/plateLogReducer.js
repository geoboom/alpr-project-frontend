import fileDownload from 'js-file-download';
import moment from 'moment';

import actionTypes from '../actions/actionTypes';

const initialState = {
  plateLog: [],
};

const plateLogReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PLATELOG_DOWNLOAD: {
      const { d, r } = action.payload;
      if (r) {
        fileDownload(d, `insead_alpr_report-${moment().format('DD-MM-YYYY-HHmm')}.csv`);

        return state;
      }

      return state;
    }

    case actionTypes.PLATELOG_GETALL: {
      const { d, r } = action.payload;
      if (r) {
        return {
          ...state,
          plateLog: d,
        };
      }

      return state;
    }

    case actionTypes.PLATELOG_APPEND: {
      const { d, r } = action.payload;
      if (r) {
        return {
          ...state,
          plateLog: [...state.plateLog, d],
        };
      }

      return state;
    }

    default:
      return state;
  }
};

export default plateLogReducer;
