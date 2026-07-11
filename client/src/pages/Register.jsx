/**
 * pages/Register.jsx
 * User signup page.
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card, { CardBody, CardHeader, CardTitle } from '../components/common/Card';
import { ROUTES } from '../utils/constants';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Simple validation checks before submitting
    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!/\d/.test(formData.password)) {
      setError('Password must contain at least one number.');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <CardTitle className="text-2xl font-bold font-display">Create Account</CardTitle>
          <p className="text-slate-400 text-sm mt-1">Get started with validation analysis</p>
        </CardHeader>

        <CardBody>
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-danger-500/10 border border-danger-500/25 text-danger-400 text-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              id="name"
              type="text"
              placeholder="Alex Johnson"
              icon={User}
              required
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
            />

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
              helpText="Must be at least 6 characters and contain a number."
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Sign Up
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-primary-400 hover:text-primary-300 font-medium transition-all">
              Sign in
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default Register;
