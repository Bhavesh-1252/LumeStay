
import { useNavigate } from "react-router";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth()

  useEffect(() => {
    if(user) navigate("/");
  })

  return <LoginForm />;
};

export default Login;
