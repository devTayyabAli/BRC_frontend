import { useState, useEffect } from "react";
import { useContractRead } from "wagmi";
import { ethers } from "ethers";
import { CONTRACT_INFO } from "src/contract";

const useGetUSDCTokens = (kgc) => {
  const [tokenBlnc, setTokenBlnc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [iserror, setIsError] = useState(false);


  const { data, isFetched,isError,refetch,error  } = useContractRead({
    address: CONTRACT_INFO.main.address,
    abi: CONTRACT_INFO.main.abi,
    functionName: "getBRCPrice",
    args: [ethers.utils.parseEther(`${Number(Number(kgc).toFixed(10)) || 0}`)],
    enabled: !!kgc,
  });

  useEffect(() => {
    if (data || isFetched) {
      setTokenBlnc(ethers?.utils?.formatUnits(data || 0, "ether"));
      setIsLoading(false); // Set loading to false after data is fetched
    } else if (isError) { // If there's an error, or if input kgc is invalid
      setIsError(true); // Reset on error or if not enabled
      setIsLoading(false);
    }else {
      setIsLoading(false); // Set loading to false if no data or error
    }
  }, [data, isFetched]);

  return { tokenBlnc: Number(tokenBlnc), isSuccess: isFetched, refetch, isLoading,iserror };
};

export default useGetUSDCTokens;
