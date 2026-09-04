import FormField from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { useLogin } from '@/hooks/useLogin';
import { ChevronLeft } from 'lucide-react';
import logo from '../assets/FrancoPerfumeLogo.png';

const LoginPage = () => {
  const {
    //error,
    isLoading,
    displayName, 
    handleLogin, 
    handleModuleSelect,
    view, 
    setView, 
    password, 
    setPassword,
    email, 
    setEmail, 
  } = useLogin();
  
  if (view === 'module') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-custom-white font-montserrat p-4 relative">
        <div 
          onClick={() => { setView('login') }}
          className="absolute top-8 left-8 flex items-center gap-1 cursor-pointer text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Go Back</span>
        </div>

        <h2 className="text-2xl font-bold text-custom-black mb-1 tracking-tight">Select A Module</h2>
        <p className="text-foreground mb-10 text-sm">Welcome back {displayName}.</p>
        
        <div className="w-full max-w-sm flex flex-col gap-4">
            <Button 
                onClick={() => handleModuleSelect('CASHIER')}
                >
                    Access POS
            </Button>
          
            <Button
                onClick={() => handleModuleSelect('MANAGER')}
                >
                    Access Dashboard
            </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-custom-white font-montserrat p-4">
      <div className="w-full max-w-sm flex flex-col items-center">
        <img src={logo} alt="Franco Perfume" className="h-24 w-auto object-contain mb-4"/>
        <h1 className="text-3xl font-bold text-custom-black mb-1 tracking-tight">OneFrancoScentHub</h1>
        <p className="text-foreground mb-8 text-sm">Welcome back!</p>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
            <FormField
                label="Email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <FormField
                label="Password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <Button type="submit" disabled={isLoading} className="mt-2">
                {isLoading ? "Logging in..." : "Login"}
            </Button>
        </form>
    
        <p>Forgot password? <a href="/forgot-password" className="text-custom-red">Reset it here</a>.</p>
      </div>
    </div>
  )
};

export default LoginPage;