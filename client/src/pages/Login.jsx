/**
 * pages/Login.jsx
 * User login page.
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card, { CardBody, CardHeader, CardTitle } from '../components/common/Card';
import { ROUTES } from '../utils/constants';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(formData);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-hero-gradient">
      <Card className="w-full max-w-md animate-slide-up" padding="lg">
        <CardHeader className="text-center">
          <div className="inline-flex w-12 h-12 rounded-xl bg-primary-600 items-center justify-center shadow-glow-sm mb-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold font-display">Welcome Back</CardTitle>
          <p className="text-slate-400 text-sm mt-1">Sign in to validate your startup ideas</p>
        </CardHeader>

        <CardBody>
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-danger-500/10 border border-danger-500/25 text-danger-400 text-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="name@company.com"
              icon={Mail}
              required
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />

            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              required
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} className="text-primary-400 hover:text-primary-300 font-medium transition-all">
              Create one
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
