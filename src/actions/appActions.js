import axios from "axios";

import { APP_LOADED, APP_TOGGLE_THEME, APP_INITIALIZE, APP_OFFLINE } from "../actions/types";
import { tokensLoadAsync, marketsLoadAsync, tickersLoadAsync } from ".";
import { getNetworkNameFromId } from "../helpers";
import config from "../config";
import { setSingleton } from "../singletons";
import ActionCable from "actioncable";

export const toggleTheme = () => {
  return async (dispatch, getState) => {
    const { app } = getState();
    const currentTheme = app.theme;
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    localStorage.theme = nextTheme;
    dispatch({
      type: APP_TOGGLE_THEME,
      payload: { theme: nextTheme }
    });
  };
};

export const loadTheme = () => {
  return async dispatch => {
    if (localStorage.theme) {
      dispatch({
        type: APP_TOGGLE_THEME,
        payload: { theme: localStorage.theme }
      });
    }
  };
};

export const initializeAppAsync = () => {
  return async dispatch => {
    initializeAppSingletons();
    try {
      const contract = await axios.get(
        `${config.API_HTTP_ROOT}/return_contract_address`
      );
      const fees = await axios.get(`${config.API_HTTP_ROOT}/fees`);
      await dispatch(tokensLoadAsync());
      await dispatch(marketsLoadAsync());
      await dispatch(tickersLoadAsync());
      dispatch({
        type: APP_INITIALIZE,
        payload: {
          contractAddress: contract.data.address,
          networkId: contract.data.network_id,
          networkName: getNetworkNameFromId(contract.data.network_id),
          makerFee: fees.data.maker_fee,
          makerMinimum: fees.data.maker_minimum,
          takerFee: fees.data.taker_fee,
          takerMinimum: fees.data.taker_minimum
        }
      });
      return true
    } catch {
      dispatch({ type: APP_OFFLINE })
      return false
    }
  };
};

const initializeAppSingletons = () => {
  const cable = ActionCable.createConsumer(config.API_WS_ROOT);
  setSingleton("cable", cable);
};

export const appLoaded = () => {
  return dispatch => {
    dispatch({
      type: APP_LOADED
    });
  };
}
