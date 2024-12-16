import { API_ROUTES } from "../utils/ApiRoutes";
import axios from "axios";

export async function postMultipleAccountInvestment(accountAddresses) {
  try {
    const URL = API_ROUTES.ALL_MULTIPLE_ACCOUNT_INVESTMENT_ROUTES;
    console.log("url::", URL);
    const response = await axios.post(URL, {accountAddresses});
    return response?.data;

  } catch (error) {
    console.log(error, "error are here");
    return error;
  }
}


export async function getOneAccountInvestment(id) {
  try {
    const URL = `${API_ROUTES.ONE_ACCOUNT_INVESTMENT_ROUTES}/${id}`;
    console.log("url::", URL);
    const response = await axios.get(URL);
    return response?.data;
  } catch (error) {
    console.log("error are here::", error);
    return error;
  }
}

export async function postMultipleAccountInvestmentHistory(accountAddresses) {
  try {
    const URL = API_ROUTES.MULTIPLE_ACCOUNT_INVESTMENT_HISTORY_ROUTES
    console.log("url::", URL);
    const response = await axios.post(URL, {accountAddresses});
    return response?.data;

  } catch (error) {
    console.log(error, "error are here");
    return error;
  }
}

export async function getAccountInvestmentHistory(id){
  try{
    const URL = `${API_ROUTES.ACCOUNT_INVESTMENT_HISTORY_ROUTES}/${id}`;
    console.log("url::", URL);
    const response = await axios.get(URL);
    return response?.data;

  } catch(error) {
    console.log("error are here::",error);
    return error;
  }
}