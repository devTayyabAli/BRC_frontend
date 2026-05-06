// ** Toolkit imports
import { configureStore } from "@reduxjs/toolkit";

// ** Reducers
import signupReducer from "./apps/auth/signupSlice";
import loginReducer, { loadUserFromLocalStorage } from "./apps/auth/loginSlice";
import forgetPasswordReducer from "./apps/auth/forgetPasswordSlice";
import getVerificationCode2FAReducer from "./apps/auth/getVerificationCodeSlice";
import compareVerificationCode2FAReducer from "./apps/auth/compareVerificationCodeSlice";
import getCurrentUserReducer from "./apps/auth/currentUserSlice";
import getAccountDeactivatedReducer from "./apps/auth/accountDeactivateSlice";
import teamReducer from "./apps/team/teamSlice";
import bonusReducer from "./apps/bonus/bonusSlice";
import defaultAuthConfig from "src/configs/auth";
import stakeReducer from "./apps/stake/stakeSlice";
import fundsTransferReducer from "./apps/transaction/transactionSlice";
import kycReducer from './apps/kyc/getKYCInfoSlice'
import getAccountVerifyEmailOTPReducer from "./apps/auth/getAccountVerifyEmailOTPSlice";
import verifyAccountEmailOTPReducer from "./apps/auth/verifyAccountEmailOTPSlice";
import levelBonusReducer from "./apps/levelBonus/levelBonusSlice";
import supportReducer from "./apps/support/supportTicketsSlice";


import withdrawalReducer from "./apps/withdrawal/withdrawalSlice"
import completeWithdrawReducer from "./apps/withdrawal/completeWithdrawalSlice"
import completeTransactionEventsReducer from "./apps/transaction/completeTransactionEvents"
// Load user data from localStorage during store initialization
const preloadedState = {
  login: {
    user: loadUserFromLocalStorage(),
  },
};


export const store = configureStore({
  reducer: {
    signup: signupReducer,
    login: loginReducer,
    forgetPassword: forgetPasswordReducer,
    stake: stakeReducer,
    fundsTransfer: fundsTransferReducer,
    kyc: kycReducer,
    getVerificationCode2FA: getVerificationCode2FAReducer,
    compareVerificationCode2FA: compareVerificationCode2FAReducer,
    getCurrentUser: getCurrentUserReducer,
    getAccountDeactivated: getAccountDeactivatedReducer,
    getAccountVerifyEmailOTP: getAccountVerifyEmailOTPReducer,
    verifyAccountEmailOTP: verifyAccountEmailOTPReducer,
    levelBonus: levelBonusReducer,
    team: teamReducer,
    bonus: bonusReducer,
    withdrawal:withdrawalReducer,
    completeWithdrawal:completeWithdrawReducer,
    completeTransactionEvents:completeTransactionEventsReducer,
    support:supportReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  preloadedState,
});

// Subscribe to store changes and update localStorage on user login
store.subscribe(() => {
  const { user } = store.getState().login;
  if (user) {
    const { storageUserDataKeyName } = defaultAuthConfig;
    if (typeof window !== "undefined") {
      localStorage.setItem(storageUserDataKeyName, JSON.stringify(user));
    }
  }
});
