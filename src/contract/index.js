import { ENV } from "src/configs/env";
import tokenAbi from "./token/abi.json";
import mainAbi from "./main/abi.json";
import kgcAbi from "./kgc/abi.json"
import tokenTestNetAbi from "./token-testNet/abi.json";
import mainTestNetAbi from "./main-testNet/abi.json";
import kgcTestNetAbi from "./kgc-testNet/abi.json"

const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production';

const CONTRACT_INFO = {
  token: {
    address: ENV.tokenAddress,
    abi: isProduction ? tokenAbi : tokenTestNetAbi,
  },
  main: {
    address: ENV.mainAddress,
    abi: isProduction ? mainAbi : mainTestNetAbi,
  },
  kgc: {
    address:ENV.kgcAddress,
    abi: isProduction ? kgcAbi : kgcTestNetAbi,
  }
};

export { CONTRACT_INFO };
