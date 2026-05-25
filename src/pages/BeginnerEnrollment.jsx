import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';

// ============================================================
// EMAILJS CONFIGURATION
// Template variables now include:
//   - {{from_name}}, {{from_email}}, {{phone}}
//   - {{address}}, {{postcode}}
//   - {{gender}}, {{handedness}}
//   - {{height_feet}}, {{height_inches}}
//   - {{age_group}}, {{age}} (if under 18)
//   - {{guardian_name}}, {{guardian_permission}} (if under 18)
//   - {{experience}}, {{how_heard}}
//   - {{special_requirements}}, {{message}}
// ============================================================
const EMAILJS_SERVICE_ID = 'service_wf6l7qj';
const EMAILJS_TEMPLATE_ID = 'template_nrv81qb';
const EMAILJS_PUBLIC_KEY = '6TUz3DlyaDbDJIe5E';

const isUnder18 = (ageGroup) => ['8-12', '13-17'].includes(ageGroup);

const BeginnerEnrollment = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        postcode: '',
        gender: '',
        handedness: '',
        heightFeet: '',
        heightInches: '',
        ageGroup: '',
        age: '',
        guardianName: '',
        guardianPermission: false,
        experience: '',
        howHeard: '',
        specialRequirements: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [prices, setPrices] = useState({ adult: null, junior: null });

    useEffect(() => {
        const fetchPrices = async () => {
            const { data } = await supabase
                .from('site_settings')
                .select('key, value')
                .in('key', ['beginners_price_adult', 'beginners_price_junior']);
            if (data) {
                const adult = data.find(r => r.key === 'beginners_price_adult');
                const junior = data.find(r => r.key === 'beginners_price_junior');
                setPrices({
                    adult: adult ? Number(adult.value) : 40,
                    junior: junior ? Number(junior.value) : 30,
                });
            }
        };
        fetchPrices();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const under18 = isUnder18(formData.ageGroup);

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
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.postcode.trim()) newErrors.postcode = 'Postcode is required';
        if (!formData.gender) newErrors.gender = 'Please select your gender';
        if (!formData.handedness) newErrors.handedness = 'Please select left or right handed';
        if (!formData.heightFeet) newErrors.heightFeet = 'Please enter your height (feet)';
        if (!formData.ageGroup) newErrors.ageGroup = 'Please select an age group';
        if (!formData.experience) newErrors.experience = 'Please select your experience level';

        if (under18) {
            if (!formData.age.trim()) newErrors.age = 'Age is required for under 18s';
            if (!formData.guardianName.trim()) newErrors.guardianName = "Guardian's name is required for under 18s";
            if (!formData.guardianPermission) newErrors.guardianPermission = 'Guardian permission is required for under 18s';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            setSubmitError('');

            const templateParams = {
                from_name: `${formData.firstName} ${formData.lastName}`,
                from_email: formData.email,
                phone: formData.phone,
                address: formData.address,
                postcode: formData.postcode,
                gender: formData.gender,
                handedness: formData.handedness,
                height: `${formData.heightFeet}ft ${formData.heightInches || '0'}in`,
                age_group: formData.ageGroup,
                age: under18 ? formData.age : 'N/A',
                guardian_name: under18 ? formData.guardianName : 'N/A',
                guardian_permission: under18 ? (formData.guardianPermission ? 'Yes' : 'No') : 'N/A',
                experience: formData.experience,
                how_heard: formData.howHeard || 'Not specified',
                special_requirements: formData.specialRequirements || 'None',
                message: formData.message || 'No additional message'
            };

            try {
                await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
                setSubmitted(true);
            } catch (error) {
                console.error('Email send failed:', error);
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
                        Your enrollment request has been received. Confirmation and joining details for your place on the next available course will be sent by email.
                    </p>
                    <a href="/" className="btn-primary">Return Home</a>
                </div>
            </div>
        );
    }

    const checkIcon = (
        <svg className="w-5 h-5 text-forest-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );

    return (
        <div className="min-h-screen py-12 md:py-20">
            <SEO
                title="Beginners Course Enrollment | Kettering Archers"
                description="Sign up for archery beginners courses at Kettering Archers. 6-hour structured sessions with qualified instructors. All equipment provided. Ages 8+ welcome."
            />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-forest-900 mb-4">
                        Beginners <span className="gradient-text">Enrollment</span>
                    </h1>
                    <p className="text-charcoal-600 text-lg max-w-2xl mx-auto">
                        Register your interest in our beginners course. No experience necessary —
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
                    <ul className="space-y-3 text-sm text-charcoal-600">
                        <li className="flex items-start gap-3">{checkIcon}<span>Courses are held on <strong>Saturday mornings by invitation</strong> at our training venue in Kettering.</span></li>
                        <li className="flex items-start gap-3">{checkIcon}<span>The course runs over <strong>2 sessions of 3 hours</strong>, led by Kettering Archers' qualified coaching team — all Archery GB qualified coaches.</span></li>
                        <li className="flex items-start gap-3">{checkIcon}<span>Course fee: <strong>£{prices.adult ?? 40} for adults</strong>, <strong>£{prices.junior ?? 30} for under 18s</strong> — payable at the beginning of the course.</span></li>
                        <li className="flex items-start gap-3">{checkIcon}
                            <span>If possible, please pay by <strong>bank transfer</strong>:<br />
                                Sort code: <strong>20-45-77</strong> &nbsp;|&nbsp; Account no: <strong>70787248</strong> &nbsp;|&nbsp; Account name: <strong>Kettering Archers</strong><br />
                                Reference: <strong>"Beginners Course"</strong>
                            </span>
                        </li>
                        <li className="flex items-start gap-3">{checkIcon}<span>All necessary equipment will be provided.</span></li>
                        <li className="flex items-start gap-3">{checkIcon}<span>During the course you will learn <strong>safety rules</strong>, how to <strong>assemble a bow</strong>, basic <strong>shooting techniques</strong> and <strong>archery etiquette</strong>.</span></li>
                        <li className="flex items-start gap-3">{checkIcon}<span>Juniors <strong>under the age of 15</strong> must be accompanied at all times by a parent, guardian or family friend.</span></li>
                        <li className="flex items-start gap-3">{checkIcon}<span>Long hair needs to be <strong>tied back</strong>.</span></li>
                        <li className="flex items-start gap-3">{checkIcon}<span>Confirmation and joining details of your place on the next available course will be <strong>sent by email</strong>.</span></li>
                    </ul>
                </div>

                {/* Enrollment Form */}
                <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8">
                    <h2 className="text-xl font-semibold text-forest-900 mb-6">Enrollment Form</h2>

                    {/* Name */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-charcoal-600 mb-2">First Name *</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                                className={`input-field ${errors.firstName ? 'border-red-500' : ''}`} placeholder="Enter your first name" />
                            {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal-600 mb-2">Last Name *</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                                className={`input-field ${errors.lastName ? 'border-red-500' : ''}`} placeholder="Enter your last name" />
                            {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                        </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-charcoal-600 mb-2">Email *</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange}
                                className={`input-field ${errors.email ? 'border-red-500' : ''}`} placeholder="your.email@example.com" />
                            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal-600 mb-2">Phone Number *</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                className={`input-field ${errors.phone ? 'border-red-500' : ''}`} placeholder="07xxx xxxxxx" />
                            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                        </div>
                    </div>

                    {/* Address */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-charcoal-600 mb-2">Address *</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange}
                            className={`input-field ${errors.address ? 'border-red-500' : ''}`} placeholder="Street address" />
                        {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                    </div>

                    {/* Postcode */}
                    <div className="mb-6 md:w-1/3">
                        <label className="block text-sm font-medium text-charcoal-600 mb-2">Postcode *</label>
                        <input type="text" name="postcode" value={formData.postcode} onChange={handleChange}
                            className={`input-field ${errors.postcode ? 'border-red-500' : ''}`} placeholder="NN15 XXX" />
                        {errors.postcode && <p className="text-red-400 text-sm mt-1">{errors.postcode}</p>}
                    </div>

                    {/* Gender & Handedness */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-charcoal-600 mb-2">Gender *</label>
                            <select name="gender" value={formData.gender} onChange={handleChange}
                                className={`input-field ${errors.gender ? 'border-red-500' : ''}`}>
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="non-binary">Non-binary</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                            {errors.gender && <p className="text-red-400 text-sm mt-1">{errors.gender}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal-600 mb-2">Handedness *</label>
                            <select name="handedness" value={formData.handedness} onChange={handleChange}
                                className={`input-field ${errors.handedness ? 'border-red-500' : ''}`}>
                                <option value="">Select handedness</option>
                                <option value="right">Right handed</option>
                                <option value="left">Left handed</option>
                            </select>
                            {errors.handedness && <p className="text-red-400 text-sm mt-1">{errors.handedness}</p>}
                        </div>
                    </div>

                    {/* Height */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-charcoal-600 mb-2">Height *</label>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <div className="relative">
                                    <input type="number" name="heightFeet" value={formData.heightFeet} onChange={handleChange} min="3" max="8"
                                        className={`input-field pr-10 ${errors.heightFeet ? 'border-red-500' : ''}`} placeholder="5" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 text-sm">ft</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="relative">
                                    <input type="number" name="heightInches" value={formData.heightInches} onChange={handleChange} min="0" max="11"
                                        className="input-field pr-10" placeholder="9" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 text-sm">in</span>
                                </div>
                            </div>
                        </div>
                        {errors.heightFeet && <p className="text-red-400 text-sm mt-1">{errors.heightFeet}</p>}
                    </div>

                    {/* Age Group */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-charcoal-600 mb-2">Age Group *</label>
                            <select name="ageGroup" value={formData.ageGroup} onChange={handleChange}
                                className={`input-field ${errors.ageGroup ? 'border-red-500' : ''}`}>
                                <option value="">Select age group</option>
                                <option value="8-12">8–12 years</option>
                                <option value="13-17">13–17 years</option>
                                <option value="18-50">18–50 years</option>
                                <option value="51-65">51–65 years</option>
                                <option value="65+">65+ years</option>
                            </select>
                            {errors.ageGroup && <p className="text-red-400 text-sm mt-1">{errors.ageGroup}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal-600 mb-2">Previous Experience *</label>
                            <select name="experience" value={formData.experience} onChange={handleChange}
                                className={`input-field ${errors.experience ? 'border-red-500' : ''}`}>
                                <option value="">Select experience level</option>
                                <option value="none">Complete beginner</option>
                                <option value="tried">Tried archery once or twice</option>
                                <option value="some">Some experience (e.g. holidays, school)</option>
                                <option value="lapsed">Lapsed archer wanting to return</option>
                            </select>
                            {errors.experience && <p className="text-red-400 text-sm mt-1">{errors.experience}</p>}
                        </div>
                    </div>

                    {/* Under 18 section */}
                    {under18 && (
                        <div className="mb-6 p-5 rounded-xl border border-gold-500/40 bg-gold-500/5">
                            <h3 className="text-base font-semibold text-forest-800 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
                                </svg>
                                Under 18 Details Required
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-charcoal-600 mb-2">Age *</label>
                                    <input type="number" name="age" value={formData.age} onChange={handleChange} min="8" max="17"
                                        className={`input-field ${errors.age ? 'border-red-500' : ''}`} placeholder="e.g. 14" />
                                    {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-charcoal-600 mb-2">Parent / Guardian Name *</label>
                                    <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange}
                                        className={`input-field ${errors.guardianName ? 'border-red-500' : ''}`} placeholder="Full name of parent or guardian" />
                                    {errors.guardianName && <p className="text-red-400 text-sm mt-1">{errors.guardianName}</p>}
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <input type="checkbox" name="guardianPermission" id="guardianPermission" checked={formData.guardianPermission} onChange={handleChange}
                                    className={`mt-1 w-4 h-4 accent-forest-600 cursor-pointer ${errors.guardianPermission ? 'outline outline-red-500' : ''}`} />
                                <label htmlFor="guardianPermission" className="text-sm text-charcoal-600 cursor-pointer">
                                    I confirm that I, as parent/guardian, give permission for the above named junior to participate in the Kettering Archers Beginners Course. *
                                </label>
                            </div>
                            {errors.guardianPermission && <p className="text-red-400 text-sm mt-1 ml-7">{errors.guardianPermission}</p>}
                        </div>
                    )}

                    {/* How Heard */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-charcoal-600 mb-2">How did you hear about us?</label>
                        <select name="howHeard" value={formData.howHeard} onChange={handleChange} className="input-field">
                            <option value="">Select an option</option>
                            <option value="search">Internet search</option>
                            <option value="social">Social media</option>
                            <option value="friend">Friend or family</option>
                            <option value="event">Local event</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Special Requirements */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-charcoal-600 mb-2">Special Requirements (optional)</label>
                        <textarea name="specialRequirements" value={formData.specialRequirements} onChange={handleChange}
                            rows={3} className="input-field resize-none"
                            placeholder="e.g. wheelchair access, hearing loop, any other accessibility needs..." />
                    </div>

                    {/* Additional Message */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-charcoal-600 mb-2">Additional Message (optional)</label>
                        <textarea name="message" value={formData.message} onChange={handleChange}
                            rows={3} className="input-field resize-none"
                            placeholder="Any questions or additional information..." />
                    </div>

                    {/* Submit */}
                    {submitError && (
                        <div className="mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                            {submitError}
                        </div>
                    )}
                    <button type="submit" id="submit-enrollment"
                        className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                            </>
                        ) : 'Submit Enrollment'}
                    </button>

                    <p className="text-charcoal-500 text-sm text-center mt-4">
                        By submitting this form, you agree to be contacted regarding the beginners course.
                        Information provided may be shared with Kettering Archers coaches.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default BeginnerEnrollment;
