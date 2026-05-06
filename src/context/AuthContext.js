import { createContext, useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { resetUser } from "src/store/apps/auth/loginSlice";
import { useDispatch } from "react-redux";
import { resetCurrentUser } from "src/store/apps/auth/currentUserSlice";
import axios from "axios";
import authConfig from "src/configs/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(defaultProvider.user);
  const [loading, setLoading] = useState(defaultProvider.loading);
  const storedToken =
    typeof window !== "undefined"
      ? window.localStorage.getItem(authConfig.storageTokenKeyName)
      : false;
  const router = useRouter();
  useEffect(() => {
    const initAuth = async () => {
      const userData = JSON.parse(localStorage.getItem(authConfig.storageUserDataKeyName));
      if (storedToken) {
        setUser(userData);
      } else {
        localStorage.removeItem(authConfig.storageUserDataKeyName);
        setUser(null);
      }
      setLoading(false);
      if (
        authConfig.onTokenExpiration === "logout" &&
        !router.pathname.includes("login")
      ) {
        router.replace("/login");
      }
    };
    initAuth();
  }, [storedToken, router]);

  const handleLogin = (params, errorCallback) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async (response) => {
        params.rememberMe
          ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
          : null;
        const returnUrl = router.query.returnUrl;

        setUser({ ...response.data.userData });
        params.rememberMe
          ? window.localStorage.setItem("userData", JSON.stringify(response.data.userData))
          : null;
        const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : "/";
        router.replace(redirectURL);
      })
      .catch((err) => {
        if (errorCallback) errorCallback(err);
      });
  };

  const handleLogout = () => {
    dispatch(resetUser());
    dispatch(resetCurrentUser());
    window.localStorage.removeItem(authConfig.storageUserDataKeyName);
    window.localStorage.removeItem(authConfig.storageTokenKeyName);
    router.push("/login");
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
