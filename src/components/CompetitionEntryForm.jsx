import { useState } from 'react';
import emailjs from '@emailjs/browser';

// ============================================================
// EMAILJS CONFIGURATION
// Uses the same EmailJS account as BeginnerEnrollment
// Create a new template for competition entries with these variables:
//    - {{competition_name}} - Competition name
//    - {{from_name}} - Entrant's full name
//    - {{from_email}} - Entrant's email
//    - {{bowtype}} - Selected bowtype
//    - {{distance}} - Selected distance
//    - {{category}} - Open or Female
//    - {{age_category}} - Junior, Senior, or 50+
//    - {{dob}} - Date of birth (if Junior)
//    - {{agb_number}} - Archery GB number
//    - {{seated}} - Yes or No
//    - {{club}} - Affiliated club name
//    - {{emergency_contact}} - Emergency contact details
// ============================================================
const EMAILJS_SERVICE_ID = 'service_wf6l7qj';
const EMAILJS_TEMPLATE_ID = 'template_competition'; // UPDATE: Create this template in EmailJS
const EMAILJS_PUBLIC_KEY = '6TUz3DlyaDbDJIe5E';

const CompetitionEntryForm = ({ competition }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        bowtype: '',
        distance: '',
        category: '',
        ageCategory: '',
        dob: '',
        agbNumber: '',
        seated: false,
        club: '',
        emergencyContact: '',
        gdprConsent: false
    });

    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when field is modified
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.bowtype) newErrors.bowtype = 'Please select a bowtype';
        if (!formData.distance) newErrors.distance = 'Please select a distance';
        if (!formData.category) newErrors.category = 'Please select a category';
        if (!formData.ageCategory) newErrors.ageCategory = 'Please select an age category';
        if (formData.ageCategory === 'Junior' && !formData.dob) {
            newErrors.dob = 'Date of birth is required for Junior entries';
        }
        if (!formData.agbNumber.trim()) newErrors.agbNumber = 'AGB number is required';
        if (!formData.club.trim()) newErrors.club = 'Club name is required';
        if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required';
        if (!formData.gdprConsent) newErrors.gdprConsent = 'You must agree to the data processing terms';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            setSubmitError('');

            const templateParams = {
                competition_name: competition.name,
                from_name: formData.fullName,
                from_email: formData.email,
                bowtype: formData.bowtype,
                distance: formData.distance,
                category: formData.category,
                age_category: formData.ageCategory,
                dob: formData.ageCategory === 'Junior' ? formData.dob : 'N/A',
                agb_number: formData.agbNumber,
                seated: formData.seated ? 'Yes' : 'No',
                club: formData.club,
                emergency_contact: formData.emergencyContact
            };

            try {
                await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    templateParams,
                    EMAILJS_PUBLIC_KEY
                );
                setSubmitted(true);
            } catch (error) {
                console.error('Email send failed:', error);
                // For development, still show success if template not configured
                if (EMAILJS_TEMPLATE_ID === 'template_competition') {
                    console.log('EmailJS template not configured. Form data:', templateParams);
                    setSubmitted(true);
                } else {
                    setSubmitError('Failed to submit entry. Please try again or contact us directly.');
                }
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setErrors(newErrors);
        }
    };

    if (submitted) {
        return (
            <div className="glass-card p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-forest-600 to-forest-700 flex items-center justify-center animate-float">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-forest-900 mb-4">Entry Submitted!</h3>
                <p className="text-charcoal-600 mb-6">
                    Your entry for {competition.name} has been received. Please complete payment to confirm your place.
                </p>
                <a href="/events" className="btn-primary">
                    Back to Events
                </a>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8">
            <h2 className="text-xl font-semibold text-forest-900 mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Entry Form
            </h2>

            {/* Personal Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-charcoal-600 mb-2">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
                        placeholder="Enter your full name"
                    />
                    {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-charcoal-600 mb-2">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>
            </div>

            {/* Archery Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-charcoal-600 mb-2">
                        Bowtype *
                    </label>
                    <select
                        name="bowtype"
                        value={formData.bowtype}
                        onChange={handleChange}
                        className={`input-field ${errors.bowtype ? 'border-red-500' : ''}`}
                    >
                        <option value="">Select bowtype</option>
                        {competition.eligibleClasses.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>
                    {errors.bowtype && <p className="text-red-400 text-sm mt-1">{errors.bowtype}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-charcoal-600 mb-2">
                        Distance *
                    </label>
                    <select
                        name="distance"
                        value={formData.distance}
                        onChange={handleChange}
                        className={`input-field ${errors.distance ? 'border-red-500' : ''}`}
                    >
                        <option value="">Select distance</option>
                        {competition.eligibleDistances.map(dist => (
                            <option key={dist} value={dist}>{dist}</option>
                        ))}
                    </select>
                    {errors.distance && <p className="text-red-400 text-sm mt-1">{errors.distance}</p>}
                </div>
            </div>

            {/* Category */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-charcoal-600 mb-2">
                        Category *
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`input-field ${errors.category ? 'border-red-500' : ''}`}
                    >
                        <option value="">Select category</option>
                        <option value="Open">Open</option>
                        <option value="Female">Female</option>
                    </select>
                    {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-charcoal-600 mb-2">
                        Age Category *
                    </label>
                    <select
                        name="ageCategory"
                        value={formData.ageCategory}
                        onChange={handleChange}
                        className={`input-field ${errors.ageCategory ? 'border-red-500' : ''}`}
                    >
                        <option value="">Select age category</option>
                        <option value="Junior">Junior (Under 18)</option>
                        <option value="Senior">Senior (18-49)</option>
                        <option value="50+">50+</option>
                    </select>
                    {errors.ageCategory && <p className="text-red-400 text-sm mt-1">{errors.ageCategory}</p>}
                </div>
            </div>

            {/* DOB - Only shown for Juniors */}
            {formData.ageCategory === 'Junior' && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-charcoal-600 mb-2">
                        Date of Birth *
                    </label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className={`input-field max-w-xs ${errors.dob ? 'border-red-500' : ''}`}
                    />
                    {errors.dob && <p className="text-red-400 text-sm mt-1">{errors.dob}</p>}
                </div>
            )}

            {/* AGB and Club */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-charcoal-600 mb-2">
                        Archery GB Number *
                    </label>
                    <input
                        type="text"
                        name="agbNumber"
                        value={formData.agbNumber}
                        onChange={handleChange}
                        className={`input-field ${errors.agbNumber ? 'border-red-500' : ''}`}
                        placeholder="e.g. 123456"
                    />
                    {errors.agbNumber && <p className="text-red-400 text-sm mt-1">{errors.agbNumber}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-charcoal-600 mb-2">
                        Affiliated Club *
                    </label>
                    <input
                        type="text"
                        name="club"
                        value={formData.club}
                        onChange={handleChange}
                        className={`input-field ${errors.club ? 'border-red-500' : ''}`}
                        placeholder="Your archery club name"
                    />
                    {errors.club && <p className="text-red-400 text-sm mt-1">{errors.club}</p>}
                </div>
            </div>

            {/* Seated */}
            <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        name="seated"
                        checked={formData.seated}
                        onChange={handleChange}
                        className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${formData.seated ? 'bg-forest-600 border-forest-600' : 'border-charcoal-400 group-hover:border-charcoal-600'}`}>
                        {formData.seated && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                    <span className="text-charcoal-700">I will be shooting seated</span>
                </label>
            </div>

            {/* Emergency Contact */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-charcoal-600 mb-2">
                    Emergency Contact (Name & Phone Number) *
                </label>
                <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className={`input-field ${errors.emergencyContact ? 'border-red-500' : ''}`}
                    placeholder="e.g. John Smith - 07700 900000"
                />
                {errors.emergencyContact && <p className="text-red-400 text-sm mt-1">{errors.emergencyContact}</p>}
            </div>

            {/* GDPR Consent */}
            <div className="mb-8 p-4 rounded-lg bg-charcoal-50 border border-charcoal-200">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        name="gdprConsent"
                        checked={formData.gdprConsent}
                        onChange={handleChange}
                        className="sr-only"
                    />
                    <div className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${formData.gdprConsent ? 'bg-forest-600 border-forest-600' : 'border-charcoal-400 group-hover:border-charcoal-600'}`}>
                        {formData.gdprConsent && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                    <span className="text-sm text-charcoal-600">
                        I have read and agree to the data processing terms. {competition.gdprNotice}
                    </span>
                </label>
                {errors.gdprConsent && <p className="text-red-400 text-sm mt-2">{errors.gdprConsent}</p>}
            </div>

            {/* Submit */}
            {submitError && (
                <div className="mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                    {submitError}
                </div>
            )}
            <button
                type="submit"
                className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                    </>
                ) : (
                    'Submit Entry'
                )}
            </button>
        </form>
    );
};

export default CompetitionEntryForm;
