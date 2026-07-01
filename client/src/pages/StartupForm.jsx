/**
 * pages/StartupForm.jsx
 * Form page for submitting a new startup idea.
 * Supports dynamic key feature addition/removal.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Zap, ArrowLeft, Lightbulb } from 'lucide-react';
import { useStartup } from '../hooks/useStartup';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card, { CardHeader, CardTitle, CardBody } from '../components/common/Card';
import { ROUTES } from '../utils/constants';

const StartupForm = () => {
  const navigate = useNavigate();
  const { createStartup, isLoading, error } = useStartup();

  const [formData, setFormData] = useState({
    title: '',
    problemStatement: '',
    targetUsers: '',
    industry: '',
    keyFeatures: [''],
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (validationErrors[id]) {
      setValidationErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  // ─── Key Features ─────────────────────────────────────────────────────────
  const handleFeatureChange = (index, value) => {
    const updated = [...formData.keyFeatures];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, keyFeatures: updated }));
  };

  const addFeature = () => {
    if (formData.keyFeatures.length < 10) {
      setFormData((prev) => ({ ...prev, keyFeatures: [...prev.keyFeatures, ''] }));
    }
  };

  const removeFeature = (index) => {
    if (formData.keyFeatures.length > 1) {
      const updated = formData.keyFeatures.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, keyFeatures: updated }));
    }
  };

  // ─── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Startup title is required.';
    if (formData.problemStatement.trim().length < 20)
      errors.problemStatement = 'Problem statement must be at least 20 characters.';
    if (formData.targetUsers.trim().length < 10)
      errors.targetUsers = 'Target users must be at least 10 characters.';

    const filledFeatures = formData.keyFeatures.filter((f) => f.trim().length > 0);
    if (filledFeatures.length < 1)
      errors.keyFeatures = 'At least one non-empty key feature is required.';

    return errors;
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const payload = {
      ...formData,
      keyFeatures: formData.keyFeatures.filter((f) => f.trim().length > 0),
    };

    try {
      const startup = await createStartup(payload);
      // Redirect directly to validation page after submission
      navigate(ROUTES.VALIDATION.replace(':startupId', startup._id));
    } catch {
      // Error is captured in the hook
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-4 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-display font-bold text-white">Submit Startup Idea</h1>
        <p className="text-slate-400 mt-1">
          Describe your idea and our AI will analyze it for market viability, competitor landscape, and MVP readiness.
        </p>
      </div>

      {(error) && (
        <div className="p-4 rounded-xl bg-danger-500/10 border border-danger-500/25 text-danger-400 text-sm animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary-400" />
              Startup Overview
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-5">
            <Input
              label="Startup Name / Title"
              id="title"
              type="text"
              placeholder="e.g. TaskFlow AI — Automated Project Management"
              required
              value={formData.title}
              onChange={handleChange}
              error={validationErrors.title}
              disabled={isLoading}
            />

            <div className="flex flex-col">
              <label htmlFor="problemStatement" className="form-label">
                Problem Statement <span className="text-danger-400 ml-1">*</span>
              </label>
              <textarea
                id="problemStatement"
                rows={5}
                placeholder="Describe the core problem your startup solves. Be specific and detailed..."
                value={formData.problemStatement}
                onChange={handleChange}
                disabled={isLoading}
                className={`form-input resize-none ${
                  validationErrors.problemStatement
                    ? 'border-danger-500/50 focus:ring-danger-500/50'
                    : ''
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {validationErrors.problemStatement ? (
                  <p className="text-xs text-danger-400 animate-fade-in">
                    {validationErrors.problemStatement}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">Minimum 20 characters. More detail = better analysis.</p>
                )}
                <span className={`text-xs ${formData.problemStatement.length < 20 ? 'text-slate-600' : 'text-accent-400'}`}>
                  {formData.problemStatement.length} chars
                </span>
              </div>
            </div>

            <Input
              label="Target Users / Customers"
              id="targetUsers"
              type="text"
              placeholder="e.g. Small business owners managing teams of 5–50 people"
              required
              value={formData.targetUsers}
              onChange={handleChange}
              error={validationErrors.targetUsers}
              disabled={isLoading}
            />

            <Input
              label="Industry / Vertical (optional)"
              id="industry"
              type="text"
              placeholder="e.g. SaaS, HealthTech, EdTech, FinTech..."
              value={formData.industry}
              onChange={handleChange}
              disabled={isLoading}
            />
          </CardBody>
        </Card>

        {/* Key Features */}
        <Card padding="lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent-400" />
                Key Features
              </CardTitle>
              <span className="text-xs text-slate-500">{formData.keyFeatures.length}/10</span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              List the core features of your MVP. Specific features score better.
            </p>
          </CardHeader>

          <CardBody className="space-y-3">
            {validationErrors.keyFeatures && (
              <p className="text-xs text-danger-400 animate-fade-in">{validationErrors.keyFeatures}</p>
            )}

            {formData.keyFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600 w-5 text-center">{index + 1}</span>
                <input
                  type="text"
                  placeholder={`Feature ${index + 1} — e.g. AI-powered task prioritization`}
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  disabled={isLoading}
                  className="form-input flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  disabled={formData.keyFeatures.length <= 1 || isLoading}
                  className="p-2 rounded-lg text-slate-500 hover:text-danger-400 hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Remove feature"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {formData.keyFeatures.length < 10 && (
              <button
                type="button"
                onClick={addFeature}
                disabled={isLoading}
                className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-all mt-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add Feature
              </button>
            )}
          </CardBody>
        </Card>

        {/* Submit */}
        <div className="flex gap-4 pb-8">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(ROUTES.DASHBOARD)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            className="flex-1"
          >
            <Zap className="w-4 h-4" />
            Submit & Validate with AI
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StartupForm;
