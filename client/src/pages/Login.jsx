import { useState } from "react";
import { Shield, Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginModule() {
  const navigate = useNavigate("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    try {
      axios
        .post(
          "http://localhost:8080/user/login",
          { email, password },
          { withCredentials: true }
        )
        .then((response) => {
          if (response.status === 201) {
            console.log("Login Successfull");
            navigate("/");
          } else {
            console.log("Login Failed");
          }
        });
    } catch (err) {
      console.log("Error In Login", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
      
      {/* Left Section - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1548092372-0d1bd40894a3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGN5YmVyc2VjdXJpdHl8ZW58MHx8MHx8fDA%3D"
          alt="Cybersecurity"
          className="w-full h-full object-cover filter brightness-75 contrast-105"
        />
        
        {/* Floating Elements */}
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

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
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
            <p className="text-slate-400">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleOnSubmit} className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-2xl">
              {/* Email Field */}
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

              {/* Password Field */}
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
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right mb-6">
                <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot your password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-slate-400">
                  Don't have an account?{" "}
                  <a href="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                    Sign Up
                  </a>
                </p>
              </div>
            </div>
          </form>

          {/* Additional Features */}
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
          0%, 100% {
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