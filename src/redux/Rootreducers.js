import { combineReducers } from 'redux';
import CustomizerReducer from './reducers/CustomizerReducer';

const RootReducers = combineReducers({
  CustomizerReducer,
});

export default RootReducers;
