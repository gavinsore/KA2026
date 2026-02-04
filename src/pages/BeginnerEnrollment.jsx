import { useState } from 'react';
import emailjs from '@emailjs/browser';

// ============================================================
// EMAILJS CONFIGURATION
// To enable email notifications:
// 1. Create a free account at https://www.emailjs.com/
// 2. Create an email service (e.g., Gmail, Outlook)
// 3. Create an email template with these variables:
//    - {{from_name}} - Applicant's full name
//    - {{from_email}} - Applicant's email
//    - {{phone}} - Phone number
//    - {{age_group}} - Age group
//    - {{experience}} - Experience level
//    - {{preferred_sessions}} - Preferred session times
//    - {{health_conditions}} - Health conditions
//    - {{how_heard}} - How they heard about you
//    - {{message}} - Additional message
// 4. Replace these placeholder values with your actual IDs:
// ============================================================
const EMAILJS_SERVICE_ID = 'service_wf6l7qj';  // e.g., 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_nrv81qb'; // e.g., 'template_xyz789'
const EMAILJS_PUBLIC_KEY = '6TUz3DlyaDbDJIe5E';   // e.g., 'abcd1234efgh5678'

const BeginnerEnrollment = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        ageGroup: '',
        experience: '',
        preferredSessions: [],
        howHeard: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                preferredSessions: checked
                    ? [...prev.preferredSessions, value]
                    : prev.preferredSessions.filter(s => s !== value)
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Clear error when field is modified
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.ageGroup) newErrors.ageGroup = 'Please select an age group';
        if (!formData.experience) newErrors.experience = 'Please select your experience level';
        if (formData.preferredSessions.length === 0) {
            newErrors.preferredSessions = 'Please select at least one preferred session';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            setSubmitError('');

            // Prepare email template parameters
            const templateParams = {
                from_name: `${formData.firstName} ${formData.lastName}`,
                from_email: formData.email,
                phone: formData.phone,
                age_group: formData.ageGroup,
                experience: formData.experience,
                preferred_sessions: formData.preferredSessions.join(', '),
                how_heard: formData.howHeard || 'Not specified',
                message: formData.message || 'No additional message'
            };

            try {
                // Send email via EmailJS
                await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    templateParams,
                    EMAILJS_PUBLIC_KEY
                );
                setSubmitted(true);
            } catch (error) {
                console.error('Email send failed:', error);
                // If EmailJS is not configured, still show success (for development)
                if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
                    console.log('EmailJS not configured. Form data:', templateParams);
                    setSubmitted(true);
                } else {
                    setSubmitError('Failed to send enrollment. Please try again or contact us directly.');
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
            <div className="min-h-screen py-12 md:py-20 flex items-center justify-center">
                <div className="max-w-md mx-auto px-4 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-forest-600 to-forest-700 flex items-center justify-center animate-float">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-forest-900 mb-4">Thank You!</h1>
                    <p className="text-charcoal-600 mb-8">
                        Your enrollment request has been received. We'll be in touch within 48 hours
                        to confirm your place on our next beginners course.
                    </p>
                    <a href="/" className="btn-primary">
                        Return Home
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 md:py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-forest-900 mb-4">
                        Beginners <span className="gradient-text">Enrollment</span>
                    </h1>
                    <p className="text-charcoal-600 text-lg max-w-2xl mx-auto">
                        Register your interest in our beginners course. No experience necessary -
                        all equipment is provided.
                    </p>
                </div>

                {/* Course Info */}
                <div className="glass-card p-6 md:p-8 mb-10 border-gold-500/30">
                    <h2 className="text-xl font-semibold text-forest-900 mb-4 flex items-center gap-3">
                        <svg className="w-6 h-6 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        About Our Beginners Course
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-forest-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-charcoal-600">6-week structured course</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-forest-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-charcoal-600">All equipment provided</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-forest-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-charcoal-600">Qualified instructors</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-forest-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-charcoal-600">Small group sizes (max 8)</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-forest-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-charcoal-600">Ages 10+ welcome</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-forest-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-charcoal-600">Course fee: £60 (includes temporary membership)</span>
                        </div>
                    </div>
                </div>

                {/* Enrollment Form */}
                <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8">
                    <h2 className="text-xl font-semibold text-forest-900 mb-6">Enrollment Form</h2>

                    {/* Personal Details */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-charcoal-600 mb-2">
                                First Name *
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                                placeholder="Enter your first name"
                            />
                            {errors.firstName && (
                                <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal-600 mb-2">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                                placeholder="Enter your last name"
                            />
                            {errors.lastName && (
                                <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-charcoal-600 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                                placeholder="your.email@example.com"
                            />
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal-600 mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                                placeholder="07xxx xxxxxx"
                            />
                            {errors.phone && (
                                <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-charcoal-600 mb-2">
                                Age Group *
                            </label>
                            <select
                                name="ageGroup"
                                value={formData.ageGroup}
                                onChange={handleChange}
                                className={`input-field ${errors.ageGroup ? 'border-red-500' : ''}`}
                            >
                                <option value="">Select age group</option>
                                <option value="10-15">10-15 years</option>
                                <option value="16-17">16-17 years</option>
                                <option value="18-30">18-30 years</option>
                                <option value="31-50">31-50 years</option>
                                <option value="51-65">51-65 years</option>
                                <option value="65+">65+ years</option>
                            </select>
                            {errors.ageGroup && (
                                <p className="text-red-400 text-sm mt-1">{errors.ageGroup}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal-600 mb-2">
                                Previous Experience *
                            </label>
                            <select
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                className={`input-field ${errors.experience ? 'border-red-500' : ''}`}
                            >
                                <option value="">Select experience level</option>
                                <option value="none">Complete beginner</option>
                                <option value="tried">Tried archery once or twice</option>
                                <option value="some">Some experience (e.g. holidays, school)</option>
                                <option value="lapsed">Lapsed archer wanting to return</option>
                            </select>
                            {errors.experience && (
                                <p className="text-red-400 text-sm mt-1">{errors.experience}</p>
                            )}
                        </div>
                    </div>

                    {/* Preferred Sessions */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-charcoal-600 mb-3">
                            Preferred Session Times * (select all that apply)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['Friday Evening', 'Saturday Morning', 'Saturday Afternoon'].map((session) => (
                                <label
                                    key={session}
                                    className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${formData.preferredSessions.includes(session)
                                        ? 'bg-forest-600/30 border border-forest-500'
                                        : 'bg-white/50 border border-charcoal-200 hover:border-charcoal-600'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        name="preferredSessions"
                                        value={session}
                                        checked={formData.preferredSessions.includes(session)}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${formData.preferredSessions.includes(session)
                                        ? 'bg-forest-600 border-forest-600'
                                        : 'border-charcoal-500'
                                        }`}>
                                        {formData.preferredSessions.includes(session) && (
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-sm text-charcoal-700">{session}</span>
                                </label>
                            ))}
                        </div>
                        {errors.preferredSessions && (
                            <p className="text-red-400 text-sm mt-2">{errors.preferredSessions}</p>
                        )}
                    </div>

                    {/* How Heard */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-charcoal-600 mb-2">
                            How did you hear about us?
                        </label>
                        <select
                            name="howHeard"
                            value={formData.howHeard}
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value="">Select an option</option>
                            <option value="search">Internet search</option>
                            <option value="social">Social media</option>
                            <option value="friend">Friend or family</option>
                            <option value="event">Local event</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Additional Message */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-charcoal-600 mb-2">
                            Additional Message (optional)
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={3}
                            className="input-field resize-none"
                            placeholder="Any questions or additional information..."
                        />
                    </div>

                    {/* Submit Button */}
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
                                Sending...
                            </>
                        ) : (
                            'Submit Enrollment'
                        )}
                    </button>

                    <p className="text-charcoal-500 text-sm text-center mt-4">
                        By submitting this form, you agree to be contacted regarding the beginners course.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default BeginnerEnrollment;
