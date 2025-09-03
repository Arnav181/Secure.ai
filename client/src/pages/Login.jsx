import { useState, useEffect, useContext } from "react";
import { Shield, Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Import the AuthContext

export default function LoginModule() {
  const { login } = useAuth(); // Get the login function from context
  const navigate = useNavigate("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Check for successful Google login
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    console.log("LoginModule: Checking for Google login token:", token);
    if (token) {
      // Call the login function from AuthContext with the token
      login(token);
      // Redirect to home page after successful Google login
      navigate("/");
    }
  }, [navigate, login]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("LoginModule: Attempting login with email:", email);
    
    try {
      const response = await axios.post(
        "http://localhost:8080/user/login",
        { email, password },
        { withCredentials: true }
      );
      console.log("LoginModule: Login response received:", response);
      
      if (response.status === 201 && response.data.token) {
        console.log("Login Successful");
        console.log("LoginModule: Token received:", response.data.token);
        login(response.data.token); // Call the login function from AuthContext
        navigate("/");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      console.log("Error In Login", err);
      if (err.response?.data?.msg) {
        setError(err.response.data.msg);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = "http://localhost:8080/auth/google";
  };

  return (
    <div className="min-h-screen bg-slate-900 flex overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>

      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1548092372-0d1bd40894a3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGN5YmVyc2VjdXJpdHl8ZW58MHx8MHx8fDA%3D"
          alt="Cybersecurity"
          className="w-full h-full object-cover filter brightness-75 contrast-105"
        />

        <div className="absolute top-20 left-10 z-20 animate-float">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 shadow-xl">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300">Secure Login</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-20 right-10 z-20 animate-float-delayed">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 shadow-xl">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">Protected Access</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Secure.ai
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleOnSubmit} className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-2xl">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="text-right mb-6">
                <a
                  href="#"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot your password?
                </a>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              {/* Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full mt-4 py-3 bg-white text-gray-700 font-semibold rounded-lg transition-all transform hover:scale-105 shadow-xl flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>
              
              <div className="text-center mt-6">
                <p className="text-slate-400">
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  >
                    Sign Up
                  </a>
                </p>
              </div>
            </div>
          </form>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-4 text-sm text-slate-400">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Secure Login</span>
              </div>
              <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
              <div className="flex items-center space-x-1">
                <Lock className="w-4 h-4" />
                <span>Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
