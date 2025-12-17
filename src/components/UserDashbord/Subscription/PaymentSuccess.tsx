/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useGetMySubscriptionQuery } from '@/redux/features/subscriptions/subscriptionsApi';
import { useGetMeQuery } from '@/redux/features/auth/authApi';
import { useVerifyCheckoutSessionMutation } from '@/redux/features/subscriptions/subscriptionsApi'; // You'll need to create this
import { 
  CheckCircleIcon, 
  ArrowRightIcon, 
  SparklesIcon, 
  GiftIcon, 
  ClockIcon, 
  UserGroupIcon,
  ShieldCheckIcon,
  CurrencyEuroIcon,
  CalendarDaysIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface SessionVerification {
  status: string;
  customerEmail: string;
  amountTotal: number;
  currency: string;
  planName: string;
  interval: string;
}

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [countdown, setCountdown] = useState(10);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sessionVerified, setSessionVerified] = useState<SessionVerification | null>(null);
  
  const { data: userData } = useGetMeQuery({});
  const { data: subscriptionData, refetch: refetchSubscription } = useGetMySubscriptionQuery();
  // Create this mutation in your subscriptionsApi
  // const [verifyCheckoutSession] = useVerifyCheckoutSessionMutation();

  useEffect(() => {
    // If session_id exists, verify it
    if (sessionId) {
      verifySession(sessionId);
    } else {
      // If no session_id, just refetch subscription data
      refetchSubscription();
    }

    // Countdown redirect to dashboard
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionId, navigate]);

  // Mock verify session function - you'll need to implement this API endpoint
  const verifySession = async (sessionId: string) => {
    setIsVerifying(true);
    try {
      // This should be an API call to your backend to verify the Stripe session
      // Example: const result = await verifyCheckoutSession(sessionId).unwrap();
      
      // Mock response for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const mockSessionData: SessionVerification = {
        status: 'complete',
        customerEmail: userData?.data?.email || 'customer@example.com',
        amountTotal: 2997, // €29.97 in cents
        currency: 'eur',
        planName: 'Pro Monthly',
        interval: 'month'
      };
      
      setSessionVerified(mockSessionData);
      toast.success('Payment verified successfully!');
      
      // Refetch subscription data after verification
      refetchSubscription();
    } catch (error) {
      toast.error('Failed to verify payment session');
      console.error('Session verification error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualRedirect = () => {
    navigate('/dashboard');
  };

//   const handleExploreFeatures = () => {
//     navigate('/dashboard/learning');
//   };

  const handleDownloadReceipt = () => {
    // This would trigger receipt generation/download
    toast.success('Receipt will be emailed to you');
    // Implement actual receipt download logic
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  const Confetti = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            y: -100,
            x: Math.random() * 100,
            rotate: 0,
            scale: 0 
          }}
          animate={{ 
            y: window.innerHeight + 100,
            x: Math.random() * 100,
            rotate: 360,
            scale: 1 
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            delay: Math.random() * 0.5,
            ease: "linear"
          }}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            backgroundColor: ['#FBBF24', '#60A5FA', '#34D399', '#F472B6', '#A78BFA'][Math.floor(Math.random() * 5)],
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-purple-500/10" />
      <Confetti />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Session Verification Status */}
          {sessionId && (
            <motion.div variants={itemVariants} className="mb-8">
              <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-full ${
                sessionVerified 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : isVerifying 
                    ? 'bg-blue-500/20 border border-blue-500/30'
                    : 'bg-yellow-500/20 border border-yellow-500/30'
              }`}>
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-blue-300">Verifying payment session...</span>
                  </>
                ) : sessionVerified ? (
                  <>
                    <ShieldCheckIcon className="w-5 h-5 text-green-400" />
                    <span className="text-green-300">Payment verified ✓</span>
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-yellow-300">Processing payment...</span>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Success Icon */}
          <motion.div
            variants={itemVariants}
            className="relative inline-block mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 blur-3xl opacity-50 rounded-full"
              />
              <div className="relative w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-yellow-500/30">
                <CheckCircleIcon className="w-16 h-16 md:w-20 md:h-20 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Main Success Message */}
          <motion.h1 
            variants={itemVariants}
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent"
          >
            Payment Successful!
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-6 max-w-2xl mx-auto"
          >
            Welcome to Elite Italian Mastery. Your premium access is now active.
          </motion.p>

          {/* Payment Details */}
          {sessionVerified && (
            <motion.div 
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 max-w-md mx-auto mb-8"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Plan:</span>
                  <span className="text-yellow-300 font-semibold">{sessionVerified.planName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white font-bold">
                    €{(sessionVerified.amountTotal / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Billing Cycle:</span>
                  <span className="text-gray-300 capitalize">{sessionVerified.interval}ly</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400 font-semibold flex items-center gap-1">
                    <CheckBadgeIcon className="w-4 h-4" />
                    Completed
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* User Info Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto mb-10"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold">
                      {userData?.data?.firstName?.charAt(0) || userData?.data?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {userData?.data?.firstName || 'Elite Member'}
                    </h3>
                    <p className="text-gray-400 text-sm">{userData?.data?.email}</p>
                  </div>
                </div>
                
                {subscriptionData?.data && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-400 font-semibold text-sm">
                        Active: {subscriptionData.data.plan}
                      </span>
                    </div>
                    {subscriptionData.data.currentPeriodEnd && (
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <CalendarDaysIcon className="w-3 h-3" />
                        <span>
                          Next billing: {new Date(subscriptionData.data.currentPeriodEnd).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="bg-gradient-to-r from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <SparklesIcon className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-bold text-sm">PRO MEMBER</span>
                </div>
                <p className="text-xs text-gray-300">Full Access Granted</p>
              </div>
            </div>
          </motion.div>

          {/* Action Cards */}
          <motion.div 
            variants={itemVariants}
            className="mb-10"
          >
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
              What's Next?
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div 
                className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-5 text-left group cursor-pointer hover:border-blue-500/40 transition-all"
                onClick={() => navigate('/dashboard/learning')}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Start Learning</h3>
                <p className="text-gray-400 text-sm mb-3">Access all premium courses and AI tutor</p>
                <div className="flex items-center text-blue-400 text-sm">
                  <span>Begin Now</span>
                  <ArrowRightIcon className="w-3 h-3 ml-2" />
                </div>
              </div>

              <div 
                className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-5 text-left group cursor-pointer hover:border-purple-500/40 transition-all"
                onClick={() => navigate('/dashboard/coaching')}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UserGroupIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Book Coaching</h3>
                <p className="text-gray-400 text-sm mb-3">Schedule your 3 free coaching sessions</p>
                <div className="flex items-center text-purple-400 text-sm">
                  <span>Book Now</span>
                  <ArrowRightIcon className="w-3 h-3 ml-2" />
                </div>
              </div>

              <div 
                className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-5 text-left group cursor-pointer hover:border-yellow-500/40 transition-all"
                onClick={handleDownloadReceipt}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CurrencyEuroIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Get Receipt</h3>
                <p className="text-gray-400 text-sm mb-3">Download your payment confirmation</p>
                <div className="flex items-center text-yellow-400 text-sm">
                  <span>Download</span>
                  <ArrowRightIcon className="w-3 h-3 ml-2" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Primary CTA */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold rounded-full hover:shadow-2xl hover:shadow-yellow-600/30 transition-all hover:scale-105"
            >
              Go to Dashboard
            </button>
            
            <button
              onClick={() => navigate('/dashboard/learning')}
              className="px-8 py-3 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all"
            >
              Start First Lesson
            </button>
          </motion.div>

          {/* Countdown */}
          <motion.div 
            variants={itemVariants}
            className="text-center text-gray-400 mb-10"
          >
            <p className="mb-2">
              Redirecting to dashboard in{' '}
              <span className="text-yellow-400 font-bold">{countdown}</span> seconds
            </p>
            <button
              onClick={handleManualRedirect}
              className="text-blue-400 hover:text-blue-300 text-sm underline transition-colors"
            >
              Go now
            </button>
          </motion.div>

          {/* Session ID Info */}
          {sessionId && (
            <motion.div 
              variants={itemVariants}
              className="mt-8 p-4 bg-black/50 rounded-lg border border-white/10 max-w-md mx-auto"
            >
              <div className="text-left">
                <p className="text-sm text-gray-400 mb-2">Transaction Reference:</p>
                <div className="bg-gray-900 px-3 py-2 rounded text-xs font-mono text-gray-300 break-all">
                  {sessionId}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Save this ID for support inquiries
                </p>
              </div>
            </motion.div>
          )}

          {/* Support Section */}
          <motion.div 
            variants={itemVariants}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <p className="text-gray-500 mb-4">
              Need assistance? We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@eliteitalian.com"
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                Email Support
              </a>
              <span className="hidden sm:block text-gray-600">•</span>
              <Link
                to="/help"
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                Help Center
              </Link>
              <span className="hidden sm:block text-gray-600">•</span>
              <a
                href="tel:+1234567890"
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                Call Support
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-500 rounded-full opacity-50"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3
        }}
        className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-purple-500 rounded-full opacity-30"
      />
    </div>
  );
};

export default PaymentSuccess;








// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { useGetMySubscriptionQuery } from '@/redux/features/subscriptions/subscriptionsApi';
// import { useGetMeQuery } from '@/redux/features/auth/authApi';
// import { CheckCircleIcon, ArrowRightIcon, SparklesIcon, GiftIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
// import { motion } from 'framer-motion';

// const PaymentSuccess: React.FC = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const sessionId = searchParams.get('session_id');
//   const [countdown, setCountdown] = useState(10);
  
//   const { data: userData } = useGetMeQuery({});
//   const { data: subscriptionData, refetch: refetchSubscription } = useGetMySubscriptionQuery();

//   useEffect(() => {
//     // Refetch subscription data to get updated status
//     refetchSubscription();

//     // Countdown redirect to dashboard
//     const timer = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           navigate('/dashboard');
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [navigate, refetchSubscription]);

//   const handleManualRedirect = () => {
//     navigate('/dashboard');
//   };

//   const handleExploreFeatures = () => {
//     navigate('/dashboard/learning');
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100
//       }
//     }
//   };

//   const confettiVariants = {
//     hidden: { scale: 0, rotate: 0 },
//     visible: (i: number) => ({
//       scale: 1,
//       rotate: 360,
//       transition: {
//         delay: i * 0.1,
//         type: "spring",
//         stiffness: 200
//       }
//     })
//   };

//   const Confetti = () => (
//     <div className="absolute inset-0 overflow-hidden pointer-events-none">
//       {Array.from({ length: 50 }).map((_, i) => (
//         <motion.div
//           key={i}
//           custom={i}
//           initial="hidden"
//           animate="visible"
//           variants={confettiVariants}
//           className="absolute"
//           style={{
//             left: `${Math.random() * 100}%`,
//             top: `${Math.random() * 100}%`,
//             width: `${Math.random() * 10 + 5}px`,
//             height: `${Math.random() * 10 + 5}px`,
//             backgroundColor: ['#FBBF24', '#60A5FA', '#34D399', '#F472B6', '#A78BFA'][Math.floor(Math.random() * 5)],
//             borderRadius: Math.random() > 0.5 ? '50%' : '0%',
//           }}
//         />
//       ))}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100 overflow-hidden">
//       {/* Background Effects */}
//       <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-purple-500/10" />
//       <Confetti />
      
//       <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-24">
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="text-center"
//         >
//           {/* Success Icon */}
//           <motion.div
//             variants={itemVariants}
//             className="relative inline-block mb-8"
//           >
//             <div className="relative">
//               <motion.div
//                 animate={{
//                   scale: [1, 1.2, 1],
//                   rotate: [0, 360],
//                 }}
//                 transition={{
//                   duration: 2,
//                   repeat: Infinity,
//                   repeatType: "reverse"
//                 }}
//                 className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 blur-3xl opacity-50 rounded-full"
//               />
//               <div className="relative w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-yellow-500/30">
//                 <CheckCircleIcon className="w-20 h-20 md:w-24 md:h-24 text-white" />
//               </div>
//             </div>
//             <motion.div
//               animate={{
//                 rotate: 360,
//               }}
//               transition={{
//                 duration: 20,
//                 repeat: Infinity,
//                 ease: "linear"
//               }}
//               className="absolute -top-4 -right-4 w-16 h-16 md:w-20 md:h-20 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full"
//             />
//             <motion.div
//               animate={{
//                 rotate: -360,
//               }}
//               transition={{
//                 duration: 15,
//                 repeat: Infinity,
//                 ease: "linear"
//               }}
//               className="absolute -bottom-4 -left-4 w-12 h-12 md:w-16 md:h-16 border-4 border-purple-400/30 border-t-purple-400 rounded-full"
//             />
//           </motion.div>

//           {/* Main Success Message */}
//           <motion.h1 
//             variants={itemVariants}
//             className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent"
//           >
//             Welcome to Elite!
//           </motion.h1>

//           <motion.p 
//             variants={itemVariants}
//             className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
//           >
//             Your payment was successful and you now have full access to Elite Italian Mastery.
//           </motion.p>

//           {/* User Info Card */}
//           <motion.div 
//             variants={itemVariants}
//             className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto mb-12"
//           >
//             <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//               <div className="text-left">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center">
//                     <span className="text-black font-bold text-lg">
//                       {userData?.data?.firstName?.charAt(0) || userData?.data?.email?.charAt(0).toUpperCase() || 'U'}
//                     </span>
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-semibold text-white">
//                       {userData?.data?.firstName || 'Elite Member'}
//                     </h3>
//                     <p className="text-gray-400">{userData?.data?.email}</p>
//                   </div>
//                 </div>
                
//                 {subscriptionData?.data && (
//                   <div className="space-y-3">
//                     <div className="flex items-center gap-2">
//                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//                       <span className="text-green-400 font-semibold">
//                         Active: {subscriptionData.data.plan}
//                       </span>
//                     </div>
//                     {subscriptionData.data.currentPeriodEnd && (
//                       <div className="flex items-center gap-2 text-gray-300">
//                         <ClockIcon className="w-4 h-4" />
//                         <span>
//                           Renews: {new Date(subscriptionData.data.currentPeriodEnd).toLocaleDateString()}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
              
//               <div className="bg-gradient-to-r from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-4">
//                 <div className="flex items-center gap-2 mb-2">
//                   <SparklesIcon className="w-5 h-5 text-green-400" />
//                   <span className="text-green-400 font-bold">PRO MEMBER</span>
//                 </div>
//                 <p className="text-sm text-gray-300">Full Access Granted</p>
//               </div>
//             </div>
//           </motion.div>

//           {/* Next Steps */}
//           <motion.div 
//             variants={itemVariants}
//             className="mb-12"
//           >
//             <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
//               Start Your Journey
//             </h2>
            
//             <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-6 text-center group cursor-pointer"
//                 onClick={() => navigate('/dashboard/learning')}
//               >
//                 <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
//                   <SparklesIcon className="w-8 h-8 text-white" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-white mb-2">Explore Features</h3>
//                 <p className="text-gray-400 mb-4">Discover all premium tools and features</p>
//                 <div className="flex items-center justify-center text-blue-400">
//                   <span>Get Started</span>
//                   <ArrowRightIcon className="w-4 h-4 ml-2" />
//                 </div>
//               </motion.div>

//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-2xl p-6 text-center group cursor-pointer"
//                 onClick={() => navigate('/dashboard/profile')}
//               >
//                 <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
//                   <UserGroupIcon className="w-8 h-8 text-white" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-white mb-2">Complete Profile</h3>
//                 <p className="text-gray-400 mb-4">Personalize your learning experience</p>
//                 <div className="flex items-center justify-center text-purple-400">
//                   <span>Setup Profile</span>
//                   <ArrowRightIcon className="w-4 h-4 ml-2" />
//                 </div>
//               </motion.div>

//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-2xl p-6 text-center group cursor-pointer"
//                 onClick={() => navigate('/dashboard/settings')}
//               >
//                 <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
//                   <GiftIcon className="w-8 h-8 text-white" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-white mb-2">Bonus Content</h3>
//                 <p className="text-gray-400 mb-4">Access exclusive member resources</p>
//                 <div className="flex items-center justify-center text-yellow-400">
//                   <span>View Bonuses</span>
//                   <ArrowRightIcon className="w-4 h-4 ml-2" />
//                 </div>
//               </motion.div>
//             </div>
//           </motion.div>

//           {/* Welcome Gift */}
//           <motion.div 
//             variants={itemVariants}
//             className="bg-gradient-to-r from-yellow-600/20 to-yellow-400/10 border-2 border-yellow-600/50 rounded-3xl p-8 max-w-3xl mx-auto mb-12"
//           >
//             <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//               <div className="text-left">
//                 <h3 className="text-2xl font-bold text-yellow-400 mb-2">🎁 Welcome Gift!</h3>
//                 <p className="text-gray-300 mb-4">
//                   As a new Elite member, you get <span className="font-bold text-yellow-300">3 FREE private coaching sessions</span> to accelerate your progress.
//                 </p>
//                 <ul className="space-y-2 text-gray-400">
//                   <li className="flex items-center gap-2">
//                     <div className="w-2 h-2 bg-yellow-500 rounded-full" />
//                     One-on-one sessions with native Italian coaches
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <div className="w-2 h-2 bg-yellow-500 rounded-full" />
//                     Personalized feedback and guidance
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <div className="w-2 h-2 bg-yellow-500 rounded-full" />
//                     Schedule at your convenience
//                   </li>
//                 </ul>
//               </div>
//               <button
//                 onClick={() => navigate('/dashboard/coaching')}
//                 className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold rounded-full hover:shadow-2xl hover:shadow-yellow-600/30 transition-all"
//               >
//                 Claim Gift
//               </button>
//             </div>
//           </motion.div>

//           {/* Action Buttons */}
//           <motion.div 
//             variants={itemVariants}
//             className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
//           >
//             <button
//               onClick={handleExploreFeatures}
//               className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-full hover:shadow-2xl hover:shadow-blue-600/30 transition-all"
//             >
//               Start Learning Now
//             </button>
            
//             <button
//               onClick={() => navigate('/dashboard')}
//               className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all"
//             >
//               Go to Dashboard
//             </button>
//           </motion.div>

//           {/* Countdown & Redirect */}
//           <motion.div 
//             variants={itemVariants}
//             className="text-center text-gray-400"
//           >
//             <p className="mb-2">
//               Redirecting to dashboard in{' '}
//               <span className="text-yellow-400 font-bold text-xl">{countdown}</span> seconds
//             </p>
//             <button
//               onClick={handleManualRedirect}
//               className="text-blue-400 hover:text-blue-300 underline transition-colors"
//             >
//               Click here to go now
//             </button>
//           </motion.div>

//           {/* Support Info */}
//           <motion.div 
//             variants={itemVariants}
//             className="mt-12 pt-8 border-t border-white/10"
//           >
//             <p className="text-gray-500 mb-4">
//               Need help? Contact our support team:
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <a
//                 href="mailto:support@eliteitalian.com"
//                 className="text-blue-400 hover:text-blue-300 transition-colors"
//               >
//                 support@eliteitalian.com
//               </a>
//               <span className="hidden sm:block text-gray-600">•</span>
//               <a
//                 href="/help"
//                 className="text-blue-400 hover:text-blue-300 transition-colors"
//               >
//                 Help Center
//               </a>
//               <span className="hidden sm:block text-gray-600">•</span>
//               <a
//                 href="/faq"
//                 className="text-blue-400 hover:text-blue-300 transition-colors"
//               >
//                 FAQ
//               </a>
//             </div>
//           </motion.div>

//           {/* Session Info (Dev/Test) */}
//           {sessionId && process.env.NODE_ENV === 'development' && (
//             <motion.div 
//               variants={itemVariants}
//               className="mt-8 p-4 bg-black/50 rounded-lg border border-white/10"
//             >
//               <p className="text-sm text-gray-400">
//                 Session ID: <code className="bg-gray-900 px-2 py-1 rounded">{sessionId}</code>
//               </p>
//             </motion.div>
//           )}
//         </motion.div>
//       </div>

//       {/* Floating Celebration Elements */}
//       <motion.div
//         animate={{
//           y: [0, -20, 0],
//         }}
//         transition={{
//           duration: 3,
//           repeat: Infinity,
//           ease: "easeInOut"
//         }}
//         className="absolute top-1/4 left-10 w-4 h-4 bg-yellow-500 rounded-full opacity-50"
//       />
//       <motion.div
//         animate={{
//           y: [0, 20, 0],
//         }}
//         transition={{
//           duration: 4,
//           repeat: Infinity,
//           ease: "easeInOut",
//           delay: 0.5
//         }}
//         className="absolute top-1/3 right-20 w-6 h-6 bg-purple-500 rounded-full opacity-30"
//       />
//       <motion.div
//         animate={{
//           y: [0, -30, 0],
//         }}
//         transition={{
//           duration: 5,
//           repeat: Infinity,
//           ease: "easeInOut",
//           delay: 1
//         }}
//         className="absolute bottom-1/4 left-1/4 w-8 h-8 bg-blue-500 rounded-full opacity-20"
//       />
//     </div>
//   );
// };

// export default PaymentSuccess;