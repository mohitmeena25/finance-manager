import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import { axiosConfig } from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { AppContext } from "../context/AppContext";
import { LoaderCircle } from "lucide-react";
import { validateEmail } from "../util/validation";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {setUser}=useContext(AppContext)

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateEmail(email)) {
      setError("Please enter valid email address");
      setIsLoading(false);
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password");
      setIsLoading(false);
      return;
    }
    setError("");

    try{
      const response= await axiosConfig.post(API_ENDPOINTS.LOGIN, {
        email, password
      })

      const {token, user}=response.data
      if(token){
        localStorage.setItem("token",token)
        setUser(user)
        navigate("/dashboard")
      }

    }catch(error){
      if(error.response  && error.response.data.message){
        setError(error.response.data.message)
      }else{
      console.error("Something went wrong ",error);
      }
      
    }finally{
      setIsLoading(false)
    }

  };

  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
      {/* Background image with blur */}
      <img
        src={assets().login_bg}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover filter blur-sm"
      />
      <div className="relative z-10 w-full max-w-lg px-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
          <h3 className="text-2xl font-semibold text-block text-center mb-2">
            Welcome Back
          </h3>
          <p className="text-sm text-slate-700 text-center mb-8">
            Please enter your details to login
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              placeholder="name@example.com"
              type="text"
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="**********"
              type="password"
            />
            {error && (
              <p className="text-red-800 text-center text-sm bg-red-50 p-2 rounded w-full">
                {error}
              </p>
            )}
            <button disabled={isLoading}
              type="submit"
              className={`cursor-pointer w-full focus:outline-none text-white bg-purple-800 hover:bg-purple-900 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 flex items-center justify-center gap-2 ${isLoading ? 'opacity-60 cursor-not-allowed' : '' }`}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin w-5 h-5"/>
                  Logging In...
                </>
              ) : ("LOGIN") }
            </button>

            <p className="text-sm text-slate-800 text-center mt-6">
              Don't have an account?
              <Link
                to="/signup"
                className="font-medium text-primary underline hover:text-primary-dark transition-colors"
              >
                {" "}
                Signup
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
