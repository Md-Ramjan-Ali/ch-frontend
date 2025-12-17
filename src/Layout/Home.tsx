/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  useGetActivePlansQuery, 
  useCreateCheckoutSessionMutation, 
  useGetMySubscriptionQuery 
} from '@/redux/features/subscriptions/subscriptionsApi';
import { useGetMeQuery } from '@/redux/features/auth/authApi';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const EliteItalianMastery: React.FC = () => {
  const navigate = useNavigate();
  const { data: userData } = useGetMeQuery({});
  const { data: subscriptionData } = useGetMySubscriptionQuery();
  const { data: plansResponse, isLoading: plansLoading } = useGetActivePlansQuery();
  const [createCheckoutSession, { isLoading: checkoutLoading }] = useCreateCheckoutSessionMutation();

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isTrialUsed, setIsTrialUsed] = useState(false);

  // Get active premium plans (excluding free plan)
  const premiumPlans = plansResponse?.data?.filter(plan => 
    plan.isActive && plan.price > 0
  ) || [];

  // Check if user has used trial
  useEffect(() => {
    if (subscriptionData?.data) {
      setIsTrialUsed(subscriptionData.data.hasUsedTrial || false);
    }
  }, [subscriptionData]);

  // Auto-select first plan
  useEffect(() => {
    if (premiumPlans.length > 0 && !selectedPlan) {
      setSelectedPlan(premiumPlans[0].alias);
    }
  }, [premiumPlans]);

  const handleCheckout = async () => {
    if (!userData?.data) {
      toast.error('Please log in to subscribe');
      navigate('/login');
      return;
    }

    if (!selectedPlan) {
      toast.error('Please select a plan');
      return;
    }

    try {
      const result = await createCheckoutSession({
        planAlias: selectedPlan,
      }).unwrap();

      if (result.data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = result?.data?.checkoutUrl;
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create checkout session');
    }
  };

  const handleTrialStart = async () => {
    if (!userData?.data) {
      toast.error('Please log in to start trial');
      navigate('/login');
      return;
    }

    if (isTrialUsed) {
      toast.error('You have already used your free trial');
      return;
    }

    try {
      // Assuming there's a trial plan or endpoint
      const result = await createCheckoutSession({
        planAlias: 'TRIAL', // This would need to be configured in your backend
      }).unwrap();

      if (result?.data?.checkoutUrl) {
        window.location.href = result?.data?.checkoutUrl;
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to start trial');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: any = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

  if (plansLoading) {
    return (
      <div className="bg-black text-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading exclusive plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-gray-100 overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center justify-center overflow-hidden py-20 px-4 ">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black pb-40 via-gray-900 to-gray-800">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
          >
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
            <motion.div 
              animate={{ 
                x: [0, 100, 0],
                y: [0, 50, 0]
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-400/30 rounded-full blur-3xl"
            />
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </motion.div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center px-4 max-w-6xl mx-auto w-full"
        >
          <motion.div variants={itemVariants}>
            <div className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-6 py-2 md:px-8 md:py-3 rounded-full text-sm font-bold tracking-wider uppercase mb-8 md:mb-10 shadow-lg shadow-yellow-600/30">
              Exclusive Access
            </div>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 md:mb-8 tracking-tight"
          >
            Elite Italian Mastery
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 text-gray-300 font-light leading-relaxed max-w-4xl mx-auto"
          >
            The world's most sophisticated AI language system. Crafted for discerning professionals who demand excellence.
          </motion.p>
          
          {/* Current Subscription Status */}
          {subscriptionData?.data && subscriptionData?.data?.status !== 'none' && (
            <motion.div variants={itemVariants} className="mb-8">
              <div className="bg-gradient-to-r from-green-600/20 to-green-400/10 border-2 border-green-600 rounded-2xl p-4 md:p-6 max-w-2xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-left">
                    <h3 className="text-lg md:text-xl font-semibold text-green-400 mb-1">
                      Current Plan: <span className="font-bold">{subscriptionData.data.plan}</span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        subscriptionData.data.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {subscriptionData?.data?.status?.toUpperCase()}
                      </span>
                      {subscriptionData?.data?.currentPeriodEnd && (
                        <span className="text-sm text-gray-300">
                          Renews: {new Date(subscriptionData?.data?.currentPeriodEnd).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  {subscriptionData?.data?.status === 'active' && (
                    <button
                      onClick={() => navigate('/dashboard/subscription')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-sm md:text-base transition-colors whitespace-nowrap"
                    >
                      Manage Subscription
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Trial Offer */}
          {!subscriptionData?.data?.isPro && !isTrialUsed && (
            <motion.div 
              variants={itemVariants}
              className="mb-8"
            >
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/10 border-2 border-purple-500 rounded-2xl p-6 max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold text-purple-400 mb-3">✨ 7-Day Free Trial</h3>
                <p className="text-gray-300 mb-4">
                  Experience premium features for 7 days. No credit card required for trial.
                </p>
                <button
                  onClick={handleTrialStart}
                  disabled={checkoutLoading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Start Free Trial
                </button>
              </div>
            </motion.div>
          )}

          {/* Plan Selection */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light mb-6 md:mb-8">Choose Your Elite Plan</h2>
            <div className="flex flex-col lg:flex-row gap-6 justify-center items-stretch max-w-5xl mx-auto">
              {premiumPlans.map((plan) => (
                <motion.div
                
                  key={plan.alias}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-white/5 backdrop-blur-lg border-2 rounded-2xl p-6 md:p-8 flex-1 min-w-[280px] max-w-md transition-all duration-300 cursor-pointer ${
                    selectedPlan === plan.alias
                      ? 'border-yellow-600 shadow-2xl shadow-yellow-600/20'
                      : 'border-white/10 hover:border-yellow-600/50'
                  } ${plan.isPopular ? 'ring-2 ring-yellow-500 ring-opacity-50' : ''}`}
                  onClick={() => setSelectedPlan(plan.alias)}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-4 py-1 rounded-full text-xs font-bold uppercase">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-xl md:text-2xl font-normal text-yellow-500 mb-3">{plan?.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{plan?.description}</p>
                  
                  <div className="mb-6">
                    <div className="text-4xl md:text-5xl font-bold mb-1">€{plan?.price?.toFixed(2)}</div>
                    <div className="text-gray-400">per {plan?.interval}</div>
                    {plan.interval === 'year' && (
                      <div className="text-green-400 text-sm mt-1">
                        Save €{(plan?.price * 12 - plan?.price).toFixed(2)} annually
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-300 mb-3">Premium Features:</h4>
                    <ul className="space-y-2">
                      {plan?.features?.slice(0, 4)?.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-yellow-600 text-lg mt-0.5">✓</span>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                      {plan?.features?.length > 4 && (
                        <li className="text-gray-400 text-sm">
                          + {plan?.features?.length - 4} more features
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan.alias);
                      handleCheckout();
                    }}
                    disabled={checkoutLoading}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      selectedPlan === plan.alias
                        ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-black shadow-lg shadow-yellow-600/30'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {checkoutLoading && selectedPlan === plan.alias 
                      ? 'Processing...' 
                      : subscriptionData?.data?.status === 'active'
                        ? 'Upgrade Now'
                        : 'Get Started'
                    }
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="space-y-4 md:space-y-0 md:space-x-4">
            {!userData?.data ? (
              <>
                <Link 
                  to='/login' 
                  className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-8 py-4 md:px-12 md:py-5 rounded-full text-base md:text-lg font-bold tracking-wide uppercase shadow-xl shadow-yellow-600/30 hover:shadow-yellow-600/40 hover:scale-105 transition-all duration-300"
                >
                  Login to Subscribe
                </Link>
                <Link 
                  to='/register' 
                  className="inline-block ml-0 md:ml-4 px-8 py-4 md:px-12 md:py-5 border-2 border-yellow-600 text-yellow-400 rounded-full text-base md:text-lg font-bold tracking-wide uppercase hover:bg-yellow-600/10 transition-all duration-300"
                >
                  Create Account
                </Link>
              </>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={!selectedPlan || checkoutLoading}
                className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-8 py-4 md:px-12 md:py-5 rounded-full text-base md:text-lg font-bold tracking-wide uppercase shadow-xl shadow-yellow-600/30 hover:shadow-yellow-600/40 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? 'Processing...' : 'Start Your Journey'}
              </button>
            )}
          </motion.div>

          {/* Security & Trust Badges */}
          <motion.div variants={itemVariants} className="mt-8 md:mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">30-Day Money Back</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Instant Access</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-32 px-4 bg-gradient-to-b from-black to-gray-900">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-center mb-8 md:mb-12 tracking-tight">
            Uncompromising Excellence
          </h2>
          <p className="text-lg md:text-xl text-center mb-12 md:mb-24 text-gray-400 font-light max-w-3xl mx-auto">
            Every element designed for the professional who accepts nothing less than perfection in their Italian mastery journey.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16">
            {[
              {
                icon: '🎯',
                title: 'Multi-Model AI Consensus',
                description: 'Five advanced AI models analyze every response, ensuring 94% accuracy through sophisticated consensus algorithms. No compromises on precision.'
              },
              {
                icon: '🔢',
                title: 'Unlimited Scenarios',
                description: '414 million mathematically unique practice scenarios. Never repeat content, always fresh challenges calibrated to your advancing expertise.'
              },
              {
                icon: '⚡',
                title: 'Instant Personalization',
                description: 'Real-time adaptation to your learning patterns, professional context, and communication style. The system evolves with your sophistication.'
              },
              {
                icon: '📊',
                title: 'Advanced Analytics',
                description: 'Detailed progress tracking with insights into your strengths, weaknesses, and learning patterns. Data-driven improvement recommendations.'
              },
              {
                icon: '🎙️',
                title: 'Voice Recognition',
                description: 'State-of-the-art speech recognition with accent analysis. Perfect your pronunciation with real-time feedback and correction.'
              },
              {
                icon: '👨‍💼',
                title: 'Professional Context',
                description: 'Customized scenarios for business, medical, legal, and academic contexts. Speak Italian like a native professional.'
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 bg-gradient-to-br from-white/5 to-white/0 rounded-3xl border border-white/10 hover:border-yellow-600 hover:-translate-y-2 transition-all duration-500 backdrop-blur-sm"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl md:text-4xl shadow-lg shadow-yellow-600/20">
                  {feature.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-normal text-yellow-500 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-32 px-4 bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-center mb-8 md:mb-12 tracking-tight">
            Trusted by Leaders
          </h2>
          <p className="text-lg md:text-xl text-center mb-12 md:mb-24 text-gray-400 font-light">
            Professionals who demand the finest choose Elite Italian Mastery
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {[
              {
                initials: 'MR',
                name: 'Marco Rodriguez',
                title: 'Investment Director, Deutsche Bank',
                text: 'As a senior executive relocating to Milan, I needed something beyond basic language courses. This system understood my professional context and delivered sophisticated business Italian that impressed my colleagues from day one.',
                rating: 5
              },
              {
                initials: 'AS',
                name: 'Dr. Anna Schmidt',
                title: 'Cardiologist, Private Practice',
                text: 'The AI\'s ability to adapt to my medical terminology needs was exceptional. It created scenarios specific to my cardiology practice, something no generic program could match. Worth every euro.',
                rating: 5
              },
              {
                initials: 'GP',
                name: 'Giovanni Petrelli',
                title: 'Fashion Executive, Gucci',
                text: 'The precision in teaching fashion industry terminology and etiquette was remarkable. I went from basic Italian to conducting full meetings in 3 months.',
                rating: 5
              },
              {
                initials: 'ES',
                name: 'Emma Sullivan',
                title: 'Diplomat, EU Commission',
                text: 'For diplomatic communications, nuance is everything. This system taught me the subtle cultural references and formal language structures that made all the difference.',
                rating: 5
              }
            ].map((testimonial, idx) => (
              <motion.div 
                key={idx}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/3 border border-yellow-600/30 rounded-3xl p-6 md:p-8 lg:p-12 relative backdrop-blur-md"
              >
                <div className="absolute top-0 left-6 md:left-8 text-6xl md:text-8xl text-yellow-600/50 font-serif -mt-2 md:-mt-4">
                  "
                </div>
                <div className="mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-500 text-lg">★</span>
                  ))}
                </div>
                <p className="text-base md:text-lg italic text-gray-300 font-light leading-relaxed mb-8 relative">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-lg md:text-xl">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-yellow-500 mb-1 text-base md:text-lg">
                      {testimonial.name}
                    </div>
                    <div className="text-sm md:text-base text-gray-400 font-light">
                      {testimonial.title}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Guarantee Section */}
      <section className="py-16 md:py-32 px-4 bg-gradient-to-b from-black to-gray-900">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-gradient-to-br from-white/5 to-white/0 border-2 border-yellow-600 rounded-3xl p-8 md:p-16 relative backdrop-blur-xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
              Our Promise
            </div>
            
            <h3 className="text-2xl md:text-4xl font-light text-yellow-500 mb-6">
              Excellence Guarantee
            </h3>
            <p className="text-xl md:text-2xl text-gray-300 font-light mb-8 md:mb-12 leading-relaxed">
              Achieve B1 Italian certification within 90 days or receive a full refund. We stand behind our premium promise.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
              <div className="p-6 bg-white/5 rounded-2xl">
                <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2">94%</div>
                <div className="text-gray-400">Success Rate</div>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl">
                <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2">90</div>
                <div className="text-gray-400">Day Guarantee</div>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl">
                <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2">24/7</div>
                <div className="text-gray-400">Premium Support</div>
              </div>
            </div>
            
            <button
              onClick={() => {
                if (!userData?.data) {
                  navigate('/login');
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-8 py-4 md:px-12 md:py-5 rounded-full text-lg font-bold tracking-wide uppercase shadow-xl shadow-yellow-600/30 hover:shadow-yellow-600/40 hover:scale-105 transition-all duration-300"
            >
              Join Elite Today
            </button>
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-12 text-yellow-500">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {[
              {
                question: 'How is Elite Italian Mastery different from other language apps?',
                answer: 'We combine five AI models for unprecedented accuracy, offer unlimited unique scenarios, and provide professional context customization. This isn\'t just language learning - it\'s professional mastery.'
              },
              {
                question: 'Can I cancel my subscription?',
                answer: 'Yes, you can cancel anytime. Your subscription will remain active until the end of your billing period, and you\'ll retain access until then.'
              },
              {
                question: 'Is there a free trial?',
                answer: 'Yes! New users can try our premium features free for 7 days. No credit card is required to start the trial.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, PayPal, and Apple Pay through our secure Stripe payment gateway.'
              },
              {
                question: 'Can I change my plan later?',
                answer: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.'
              }
            ].map((faq, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-yellow-600/50 transition-colors"
              >
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="text-lg font-medium text-gray-200 group-open:text-yellow-400">
                      {faq.question}
                    </h3>
                    <span className="transition group-open:rotate-180">
                      <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-12 px-4 bg-gradient-to-b from-black to-gray-900 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-light text-yellow-500 mb-6">
            Ready to Master Italian Like a Professional?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have transformed their Italian skills with our elite AI-powered system.
          </p>
          <div className="space-x-4">
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-8 py-4 rounded-full text-lg font-bold tracking-wide uppercase hover:shadow-2xl hover:shadow-yellow-600/30 transition-all duration-300 disabled:opacity-50"
            >
              Start Now
            </button>
            <Link 
              to="/contact"
              className="inline-block px-8 py-4 border-2 border-yellow-600 text-yellow-400 rounded-full text-lg font-bold tracking-wide uppercase hover:bg-yellow-600/10 transition-all duration-300"
            >
              Schedule Demo
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-8">
            © {new Date().getFullYear()} Elite Italian Mastery. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default EliteItalianMastery;












// // import { useGetMeQuery } from '@/redux/features/auth/authApi';
// import React from 'react';
// import { Link } from 'react-router-dom';

// const EliteItalianMastery: React.FC = () => {

//     // const {data}=useGetMeQuery({})
//     //(data)
//     // const user= userData.email

//   return (
//     <div className="bg-black text-gray-100">
//       {/* Hero Section */}
//       <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
//         {/* Animated Background Gradients */}
//         <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800">
//           <div className="absolute inset-0 opacity-30 animate-pulse">
//             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
//             <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-400/30 rounded-full blur-3xl" />
//             <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
//           </div>
//         </div>

//         <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
//           <div className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-8 py-3 rounded-full text-sm font-bold tracking-wider uppercase mb-10 shadow-lg shadow-yellow-600/30">
//             Exclusive
//           </div>
          
//           <h1 className="text-6xl md:text-7xl font-light mb-8 tracking-tight">
//             Elite Italian Mastery
//           </h1>
          
//           <p className="text-xl md:text-2xl mb-12 text-gray-300 font-light leading-relaxed">
//             The world's most sophisticated AI language system. Crafted for discerning professionals who demand excellence.
//           </p>
          
//           <div className="bg-white/5 border-2 border-yellow-600 rounded-2xl p-10 mb-12 backdrop-blur-xl max-w-2xl mx-auto">
//             <h3 className="text-2xl font-normal text-yellow-500 mb-5">
//               Limited Access Program
//             </h3>
//             <p className="text-lg text-gray-300 font-light leading-relaxed">
//               Only 500 professionals per quarter gain access to our premium AI tutoring system. Experience personalized excellence that adapts to your sophisticated learning requirements.
//             </p>
//           </div>
          
 

//           <Link to='/login' className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-12 py-5 rounded-full text-lg font-bold tracking-wide uppercase shadow-xl shadow-yellow-600/30 hover:shadow-yellow-600/40 hover:scale-105 transition-all duration-300">
//             Apply for Access
//           </Link>
          
//           <p className="mt-6 text-sm text-gray-400">
//             Investment: €297/month | Limited Availability
//           </p>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-32 px-6 bg-gradient-to-b from-black to-gray-900">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-5xl md:text-6xl font-light text-center mb-8 tracking-tight">
//             Uncompromising Excellence
//           </h2>
//           <p className="text-xl text-center mb-24 text-gray-400 font-light max-w-3xl mx-auto">
//             Every element designed for the professional who accepts nothing less than perfection in their Italian mastery journey.
//           </p>
          
//           <div className="grid md:grid-cols-3 gap-16">
//             {[
//               {
//                 icon: '🎯',
//                 title: 'Multi-Model AI Consensus',
//                 description: 'Five advanced AI models analyze every response, ensuring 94% accuracy through sophisticated consensus algorithms. No compromises on precision.'
//               },
//               {
//                 icon: '♦',
//                 title: 'Unlimited Scenarios',
//                 description: '414 million mathematically unique practice scenarios. Never repeat content, always fresh challenges calibrated to your advancing expertise.'
//               },
//               {
//                 icon: '⚡',
//                 title: 'Instant Personalization',
//                 description: 'Real-time adaptation to your learning patterns, professional context, and communication style. The system evolves with your sophistication.'
//               }
//             ].map((feature, idx) => (
//               <div 
//                 key={idx}
//                 className="text-center p-12 bg-gradient-to-br from-white/5 to-white/0 rounded-3xl border border-white/10 hover:border-yellow-600 hover:-translate-y-4 transition-all duration-500 backdrop-blur-sm"
//               >
//                 <div className="w-20 h-20 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-lg shadow-yellow-600/20">
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-2xl font-normal text-yellow-500 mb-6">
//                   {feature.title}
//                 </h3>
//                 <p className="text-gray-400 font-light leading-relaxed">
//                   {feature.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="py-32 px-6 bg-gradient-to-br from-gray-900 to-gray-800">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-5xl md:text-6xl font-light text-center mb-8 tracking-tight">
//             Trusted by Leaders
//           </h2>
//           <p className="text-xl text-center mb-24 text-gray-400 font-light">
//             Professionals who demand the finest choose Elite Italian Mastery
//           </p>
          
//           <div className="grid md:grid-cols-2 gap-12">
//             {[
//               {
//                 initials: 'MR',
//                 name: 'Marco Rodriguez',
//                 title: 'Investment Director, Deutsche Bank',
//                 text: 'As a senior executive relocating to Milan, I needed something beyond basic language courses. This system understood my professional context and delivered sophisticated business Italian that impressed my colleagues from day one.'
//               },
//               {
//                 initials: 'AS',
//                 name: 'Dr. Anna Schmidt',
//                 title: 'Cardiologist, Private Practice',
//                 text: 'The AI\'s ability to adapt to my medical terminology needs was exceptional. It created scenarios specific to my cardiology practice, something no generic program could match. Worth every euro.'
//               }
//             ].map((testimonial, idx) => (
//               <div 
//                 key={idx}
//                 className="bg-white/3 border border-yellow-600/30 rounded-3xl p-12 relative backdrop-blur-md"
//               >
//                 <div className="absolute top-0 left-8 text-8xl text-yellow-600/50 font-serif -mt-4">
//                   "
//                 </div>
//                 <p className="text-lg italic text-gray-300 font-light leading-relaxed mb-8 relative">
//                   {testimonial.text}
//                 </p>
//                 <div className="flex items-center gap-5">
//                   <div className="w-14 h-14 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center text-black font-bold">
//                     {testimonial.initials}
//                   </div>
//                   <div>
//                     <div className="font-semibold text-yellow-500 mb-1">
//                       {testimonial.name}
//                     </div>
//                     <div className="text-sm text-gray-400 font-light">
//                       {testimonial.title}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Pricing Section */}
//       <section className="py-32 px-6 bg-gradient-to-br from-black to-gray-900 text-center">
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-gradient-to-br from-white/5 to-white/0 border-2 border-yellow-600 rounded-3xl p-16 relative backdrop-blur-xl">
//             <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-8 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
//               Premium Access
//             </div>
            
//             <h3 className="text-4xl font-light text-yellow-500 mb-5">
//               Elite Membership
//             </h3>
//             <p className="text-xl text-gray-400 font-light mb-10">
//               Complete access to the world's most advanced Italian learning system
//             </p>
            
//             <div className="text-6xl font-bold mb-2">€297</div>
//             <div className="text-xl text-gray-500 mb-10">per month</div>
            
//             <ul className="space-y-4 mb-12 text-left max-w-md mx-auto">
//               {[
//                 'Unlimited AI assessment sessions',
//                 'Five-model consensus accuracy',
//                 '414M+ unique practice scenarios',
//                 'Real-time personalization engine',
//                 'Priority support & consultation',
//                 'Professional context customization',
//                 'Advanced progress analytics',
//                 'Mobile & desktop access'
//               ].map((feature, idx) => (
//                 <li key={idx} className="flex items-start gap-3 text-lg border-b border-white/10 pb-4">
//                   <span className="text-yellow-600 font-bold text-xl">✓</span>
//                   <span>{feature}</span>
//                 </li>
//               ))}
//             </ul>
            
//             <button className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-12 py-5 rounded-full text-lg font-bold tracking-wide uppercase shadow-xl shadow-yellow-600/30 hover:shadow-yellow-600/40 hover:scale-105 transition-all duration-300 mb-10">
//               Begin Your Journey
//             </button>
            
//             <div className="bg-yellow-600/10 border border-yellow-600 rounded-2xl p-8">
//               <h4 className="text-xl font-semibold text-yellow-500 mb-4">
//                 Excellence Guarantee
//               </h4>
//               <p className="text-gray-300 font-light">
//                 Pass your B1 Italian certification within 90 days or receive a full refund. We stand behind our premium promise.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default EliteItalianMastery;