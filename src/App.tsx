/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { 
  Cpu, 
  Send, 
  Image as ImageIcon, 
  Terminal, 
  Zap, 
  Settings, 
  History, 
  Bot, 
  User, 
  Loader2, 
  Trash2,
  Maximize2,
  Minimize2,
  Code2,
  Play,
  Search,
  BookOpen,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Filter,
  Trophy,
  CheckCircle2,
  XCircle,
  Award,
  BarChart3,
  Sun,
  Moon,
  Menu,
  X,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Headphones,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Translations ---
const TRANSLATIONS = {
  en: {
    welcome: "Welcome to your **GME.ABDO Robotics Assistant**! 🤖\n\nI'm here to help you master robotics, from **ROS2 middleware** to **PID control loops**. \n\nHow can I assist your engineering journey today? 🚀",
    chat: "Chat",
    videos: "Academy",
    quiz: "Quizzes",
    personality: "Bot Personality",
    technical: "Technical",
    friendly: "Friendly",
    funny: "Funny",
    searchPlaceholder: "Search tutorials, tags, or hardware...",
    trending: "Trending",
    all: "All",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    watchTutorial: "Watch Tutorial",
    fetchingContent: "Fetching dynamic content...",
    noTutorials: "No tutorials found matching your search.",
    proficiencyCenter: "Proficiency Center",
    selectModule: "Select a module to test your robotics expertise.",
    startAssessment: "Start Assessment",
    mastered: "Mastered",
    questions: "Questions",
    accuracy: "Accuracy",
    retakeQuiz: "Retake Quiz",
    quizComplete: "Quiz Complete!",
    nextQuestion: "Next Question",
    finishQuiz: "Finish Quiz",
    correct: "Correct!",
    incorrect: "Incorrect",
    pressEnter: "Press Enter to submit",
    typeAnswer: "Type your answer...",
    overview: "Overview",
    tutorialDescription: "Tutorial Description",
    keyLearning: "Key Learning Outcomes",
    readyTest: "Ready for the test?",
    instantFeedback: "Instant Feedback",
    claimAchievement: "Claim Achievement",
    certificateTitle: "Certificate of Achievement",
    certifiesThat: "This certifies that",
    futureEngineer: "Future Robotics Engineer",
    masteredConcepts: "Has successfully mastered the core concepts of",
    perfectScore: "with a perfect score in the GME.ABDO Academy Proficiency Test.",
    dateIssued: "Date Issued",
    authorizedBy: "Authorized By",
    verificationId: "Verification ID",
    nextMilestone: "Next Milestone",
    goToModule: "Go to Module",
    leaderboard: "Global Leaderboard",
    recentCerts: "Recent Certifications",
    rank: "Rank",
    novice: "Novice",
    apprentice: "Apprentice",
    expert: "Expert",
    academyProgress: "Academy Progress",
    quizzesMastered: "Quizzes Mastered",
    audioOnly: "Audio Only Mode",
    videoPlayer: "Technical Video Player",
    topicVisuals: "Topic Visuals",
    systemInstruction: "You are GME.ABDO, a highly advanced Robotics AI Assistant. You specialize in ROS2, PID control, SLAM, Computer Vision, and Embedded Systems (Arduino/ESP32). You are helpful, technical, and precise. Respond in the language requested by the user.",
    navigation: "Navigation",
    appearance: "Appearance",
    day: "DAY",
    night: "NIGHT",
    systemTools: "System Tools",
    ros2Console: "ROS2 Console",
    powerAnalysis: "Power Analysis",
    systemConfig: "System Config",
    roboticsEngineer: "Robotics Engineer",
    coreStatusOnline: "Core Status: Online",
    academyLibraryLoaded: "Academy: Library Loaded",
    masterRoboticsText: "Master robotics with our curated technical library.",
    recommendedTutorials: "Recommended Tutorials",
    returnToChat: "Return to Core Chat",
    question: "Question",
    of: "of",
    complete: "Complete",
    insight: "GME.ABDO Insight",
    score: "Score",
    proficiency: "Proficiency",
    testComplete: "Test Complete!",
    demonstratedKnowledge: "You've demonstrated your knowledge in",
    whatIsRos2: "What is ROS2?",
    tellMeAboutRos2: "Tell me about ROS2 Humble",
    pidControl: "PID Control",
    howPidWorks: "How does PID control work?",
    projectIdeas: "Project Ideas",
    giveMeProjectIdea: "Give me a robotics project idea",
    voiceInput: "Voice Input",
    voiceOutput: "Voice Output",
    listening: "Listening...",
    stopListening: "Stop Listening",
    speak: "Speak",
    mute: "Mute",
    unmute: "Unmute",
  },
  ar: {
    welcome: "مرحباً بك في **مساعد GME.ABDO للروبوتات**! 🤖\n\nأنا هنا لمساعدتك في إتقان الروبوتات، من **برمجيات ROS2** إلى **حلقات تحكم PID**. \n\nكيف يمكنني مساعدتك في رحلتك الهندسية اليوم؟ 🚀",
    chat: "المحادثة",
    videos: "الأكاديمية",
    quiz: "الاختبارات",
    personality: "شخصية البوت",
    technical: "تقني",
    friendly: "ودود",
    funny: "مرح",
    searchPlaceholder: "ابحث عن الدروس، الوسوم، أو الأجهزة...",
    trending: "شائع",
    all: "الكل",
    beginner: "مبتدئ",
    intermediate: "متوسط",
    advanced: "متقدم",
    watchTutorial: "مشاهدة الدرس",
    fetchingContent: "جاري جلب المحتوى الديناميكي...",
    noTutorials: "لم يتم العثور على دروس تطابق بحثك.",
    proficiencyCenter: "مركز الكفاءة",
    selectModule: "اختر وحدة لاختبار خبرتك في الروبوتات.",
    startAssessment: "بدء التقييم",
    mastered: "متقن",
    questions: "أسئلة",
    accuracy: "الدقة",
    retakeQuiz: "إعادة الاختبار",
    quizComplete: "اكتمل الاختبار!",
    nextQuestion: "السؤال التالي",
    finishQuiz: "إنهاء الاختبار",
    correct: "صحيح!",
    incorrect: "غير صحيح",
    pressEnter: "اضغط Enter للإرسال",
    typeAnswer: "اكتب إجابتك...",
    overview: "نظرة عامة",
    tutorialDescription: "وصف الدرس",
    keyLearning: "نتائج التعلم الرئيسية",
    readyTest: "جاهز للاختبار؟",
    instantFeedback: "تعليقات فورية",
    claimAchievement: "الحصول على الإنجاز",
    certificateTitle: "شهادة إنجاز",
    certifiesThat: "تشهد هذه الوثيقة بأن",
    futureEngineer: "مهندس روبوتات المستقبل",
    masteredConcepts: "قد أتقن بنجاح المفاهيم الأساسية لـ",
    perfectScore: "بدرجة كاملة في اختبار كفاءة أكاديمية GME.ABDO.",
    dateIssued: "تاريخ الإصدار",
    authorizedBy: "معتمد من قبل",
    verificationId: "رقم التحقق",
    nextMilestone: "المرحلة القادمة",
    goToModule: "اذهب إلى الوحدة",
    leaderboard: "لوحة المتصدرين العالمية",
    recentCerts: "الشهادات الأخيرة",
    rank: "الرتبة",
    novice: "مبتدئ",
    apprentice: "متدرب",
    expert: "خبير",
    academyProgress: "تقدم الأكاديمية",
    quizzesMastered: "اختبارات متقنة",
    audioOnly: "وضع الصوت فقط",
    videoPlayer: "مشغل الفيديو التقني",
    topicVisuals: "مرئيات الموضوع",
    systemInstruction: "أنت GME.ABDO، مساعد ذكاء اصطناعي متقدم للروبوتات. أنت متخصص في ROS2، وتحكم PID، وSLAM، والرؤية الحاسوبية، والأنظمة المدمجة (Arduino/ESP32). أنت متعاون، تقني، ودقيق. أجب باللغة التي يطلبها المستخدم.",
    navigation: "التنقل",
    appearance: "المظهر",
    day: "نهاري",
    night: "ليلي",
    systemTools: "أدوات النظام",
    ros2Console: "وحدة تحكم ROS2",
    powerAnalysis: "تحليل الطاقة",
    systemConfig: "إعدادات النظام",
    roboticsEngineer: "مهندس روبوتات",
    coreStatusOnline: "حالة النظام: متصل",
    academyLibraryLoaded: "الأكاديمية: المكتبة محملة",
    masterRoboticsText: "أتقن الروبوتات من خلال مكتبتنا التقنية المنسقة.",
    recommendedTutorials: "الدروس الموصى بها",
    returnToChat: "العودة للمحادثة",
    question: "سؤال",
    of: "من",
    complete: "مكتمل",
    insight: "رؤية GME.ABDO",
    score: "النتيجة",
    proficiency: "الكفاءة",
    testComplete: "اكتمل الاختبار!",
    demonstratedKnowledge: "لقد أظهرت معرفتك في",
    whatIsRos2: "ما هو ROS2؟",
    tellMeAboutRos2: "أخبرني عن ROS2 Humble",
    pidControl: "تحكم PID",
    howPidWorks: "كيف يعمل تحكم PID؟",
    projectIdeas: "أفكار مشاريع",
    giveMeProjectIdea: "أعطني فكرة مشروع روبوتات",
    voiceInput: "إدخال صوتي",
    voiceOutput: "إخراج صوتي",
    listening: "جاري الاستماع...",
    stopListening: "إيقاف الاستماع",
    speak: "تحدث",
    mute: "كتم الصوت",
    unmute: "تشغيل الصوت",
  }
};

// --- Types ---
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  image?: string;
  suggestedVideos?: string[]; // IDs of suggested videos
  suggestedTopic?: string; // Topic for dynamic search
  quizId?: string; // ID of suggested quiz
}

interface Video {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  url: string;
  category: 'Beginner' | 'Intermediate' | 'Advanced';
  topic?: 'Robotics' | 'AI' | 'Sensors' | 'Programming';
  tags: string[];
  description: string;
  relatedImages?: string[];
  quizId?: string;
}

interface Question {
  id: string;
  type: 'mcq' | 'tf' | 'short';
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  topic: string;
  questions: Question[];
}

// --- Curated Video Library ---
const VIDEO_LIBRARY: Video[] = [
  {
    id: 'v1',
    videoId: 'Gg25GfA456o',
    title: 'Introduction to ROS2 Humble',
    thumbnail: 'https://img.youtube.com/vi/Gg25GfA456o/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=Gg25GfA456o',
    category: 'Beginner',
    topic: 'Robotics',
    tags: ['ROS2', 'Linux', 'Middleware'],
    description: 'Learn the basics of Robot Operating System 2 and how to set up your first workspace.',
    quizId: 'ros2',
    relatedImages: [
      'https://picsum.photos/seed/ros-arch/800/600',
      'https://picsum.photos/seed/ros-nodes/800/600',
      'https://picsum.photos/seed/ros-humble/800/600'
    ]
  },
  {
    id: 'v2',
    videoId: 'wkfEZms0ooI',
    title: 'PID Control Explained',
    thumbnail: 'https://img.youtube.com/vi/wkfEZms0ooI/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=wkfEZms0ooI',
    category: 'Intermediate',
    topic: 'Programming',
    tags: ['Control Theory', 'Math', 'Arduino'],
    description: 'A deep dive into Proportional-Integral-Derivative controllers for motor stability.',
    quizId: 'pid',
    relatedImages: [
      'https://picsum.photos/seed/pid-graph/800/600',
      'https://picsum.photos/seed/control-loop/800/600'
    ]
  },
  {
    id: 'v3',
    videoId: 'VjsuBT4qnrE',
    title: 'Inverse Kinematics for Robot Arms',
    thumbnail: 'https://img.youtube.com/vi/VjsuBT4qnrE/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=VjsuBT4qnrE',
    category: 'Advanced',
    topic: 'Robotics',
    tags: ['Kinematics', 'Geometry', 'Robot Arms'],
    description: 'Master the mathematics behind moving a robotic gripper to a specific 3D coordinate.',
    quizId: 'kinematics',
    relatedImages: [
      'https://picsum.photos/seed/robot-arm/800/600',
      'https://picsum.photos/seed/ik-math/800/600',
      'https://picsum.photos/seed/arm-joints/800/600'
    ]
  },
  {
    id: 'v4',
    videoId: 'E_N_8v9XF8M',
    title: 'Lidar SLAM Navigation',
    thumbnail: 'https://img.youtube.com/vi/E_N_8v9XF8M/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=E_N_8v9XF8M',
    category: 'Advanced',
    topic: 'Sensors',
    tags: ['SLAM', 'Lidar', 'Navigation'],
    description: 'How robots build maps and navigate autonomously using Laser Scanning.',
    quizId: 'sensors',
    relatedImages: [
      'https://picsum.photos/seed/lidar-scan/800/600',
      'https://picsum.photos/seed/slam-map/800/600'
    ]
  },
  {
    id: 'v5',
    videoId: 'N8v_mX2X_oM',
    title: 'Computer Vision with OpenCV',
    thumbnail: 'https://img.youtube.com/vi/N8v_mX2X_oM/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=N8v_mX2X_oM',
    category: 'Intermediate',
    topic: 'AI',
    tags: ['OpenCV', 'Python', 'AI'],
    description: 'Implementing object detection and tracking for autonomous mobile robots.',
    quizId: 'vision',
    relatedImages: [
      'https://picsum.photos/seed/cv-detect/800/600',
      'https://picsum.photos/seed/robot-vision/800/600',
      'https://picsum.photos/seed/opencv-logo/800/600'
    ]
  },
  {
    id: 'v6',
    videoId: 'd8_xXNcGYgo',
    title: 'Arduino for Beginners',
    thumbnail: 'https://img.youtube.com/vi/d8_xXNcGYgo/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=d8_xXNcGYgo',
    category: 'Beginner',
    topic: 'Programming',
    tags: ['Arduino', 'Electronics', 'C++'],
    description: 'The ultimate guide to starting with Arduino microcontrollers and basic electronics.',
    quizId: 'arduino',
    relatedImages: [
      'https://picsum.photos/seed/arduino-board/800/600',
      'https://picsum.photos/seed/circuit-breadboard/800/600'
    ]
  },
  {
    id: 'v7',
    videoId: 'S_m_8v9XF8M',
    title: 'ESP32-CAM AI Projects',
    thumbnail: 'https://img.youtube.com/vi/S_m_8v9XF8M/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=S_m_8v9XF8M',
    category: 'Intermediate',
    topic: 'AI',
    tags: ['ESP32', 'IoT', 'Camera'],
    description: 'Building a smart doorbell and face recognition system with the ESP32-CAM module.',
    quizId: 'esp32',
    relatedImages: [
      'https://picsum.photos/seed/esp32-cam/800/600',
      'https://picsum.photos/seed/iot-home/800/600'
    ]
  },
  {
    id: 'v8',
    videoId: 'vX_mX2X_oM',
    title: 'Robotic Sensors Deep Dive',
    thumbnail: 'https://img.youtube.com/vi/vX_mX2X_oM/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=vX_mX2X_oM',
    category: 'Intermediate',
    topic: 'Sensors',
    tags: ['Sensors', 'IMU', 'Ultrasonic'],
    description: 'Understanding how different sensors work together to give robots situational awareness.',
    quizId: 'sensors',
    relatedImages: [
      'https://picsum.photos/seed/sensors-array/800/600',
      'https://picsum.photos/seed/imu-sensor/800/600'
    ]
  },
  {
    id: 'v9',
    videoId: 'mX2X_oM_vX',
    title: 'Reinforcement Learning in Robotics',
    thumbnail: 'https://img.youtube.com/vi/mX2X_oM_vX/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=mX2X_oM_vX',
    category: 'Advanced',
    topic: 'AI',
    tags: ['Reinforcement Learning', 'AI', 'Training'],
    description: 'How robots learn complex tasks through trial and error using RL algorithms.',
    quizId: 'vision',
    relatedImages: [
      'https://picsum.photos/seed/rl-training/800/600',
      'https://picsum.photos/seed/ai-brain/800/600'
    ]
  },
  {
    id: 'v10',
    videoId: 'oM_vX_mX2X',
    title: 'Advanced ROS2 Navigation',
    thumbnail: 'https://img.youtube.com/vi/oM_vX_mX2X/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=oM_vX_mX2X',
    category: 'Advanced',
    topic: 'Robotics',
    tags: ['ROS2', 'Navigation2', 'Path Planning'],
    description: 'Implementing the Nav2 stack for complex autonomous navigation in ROS2.',
    quizId: 'ros2',
    relatedImages: [
      'https://picsum.photos/seed/ros-nav/800/600',
      'https://picsum.photos/seed/path-planning/800/600'
    ]
  }
];

// --- Quiz Data ---
const QUIZ_DATA: Record<string, Quiz> = {
  'ros2': {
    id: 'q1',
    title: 'ROS2 Fundamentals',
    topic: 'ROS2',
    questions: [
      {
        id: 'q1_1',
        type: 'mcq',
        question: 'What does ROS stand for?',
        options: ['Robot Operating System', 'Robotic Open Source', 'Remote Operation Suite', 'Real-time Operating System'],
        answer: 'Robot Operating System',
        explanation: 'ROS stands for Robot Operating System, though it is technically middleware, not an OS.'
      },
      {
        id: 'q1_2',
        type: 'tf',
        question: 'ROS2 Humble is a Long Term Support (LTS) release.',
        answer: 'True',
        explanation: 'ROS2 Humble Hawksbill is an LTS release, supported until May 2027.'
      },
      {
        id: 'q1_3',
        type: 'short',
        question: 'What is the default middleware protocol used by ROS2?',
        answer: 'DDS',
        explanation: 'ROS2 uses Data Distribution Service (DDS) as its default communication middleware.'
      },
      {
        id: 'q1_4',
        type: 'mcq',
        question: 'Which command is used to list all active nodes?',
        options: ['ros2 node list', 'ros2 topic list', 'ros2 run list', 'ros2 pkg list'],
        answer: 'ros2 node list',
        explanation: '"ros2 node list" shows all nodes currently running in the ROS graph.'
      },
      {
        id: 'q1_5',
        type: 'tf',
        question: 'A ROS2 workspace must be sourced in every new terminal.',
        answer: 'True',
        explanation: 'You must source the setup.bash file to make the workspace packages available to the system.'
      },
      {
        id: 'q1_6',
        type: 'mcq',
        question: 'Which build tool is standard for ROS2?',
        options: ['catkin', 'cmake', 'colcon', 'make'],
        answer: 'colcon',
        explanation: 'colcon is the collective construction tool used to build ROS2 workspaces.'
      },
      {
        id: 'q1_7',
        type: 'short',
        question: 'What is the name of the 3D visualization tool in ROS2?',
        answer: 'RViz2',
        explanation: 'RViz2 is the primary tool for visualizing sensor data and robot state.'
      },
      {
        id: 'q1_8',
        type: 'mcq',
        question: 'What is a "Topic" in ROS2?',
        options: ['A debugging tool', 'A communication channel for data streams', 'A hardware driver', 'A build configuration'],
        answer: 'A communication channel for data streams',
        explanation: 'Topics allow nodes to exchange data using a publish-subscribe model.'
      },
      {
        id: 'q1_9',
        type: 'tf',
        question: 'ROS2 supports both C++ and Python.',
        answer: 'True',
        explanation: 'ROS2 has client libraries for both C++ (rclcpp) and Python (rclpy).'
      },
      {
        id: 'q1_10',
        type: 'short',
        question: 'What is the default RMW implementation for ROS2 Humble?',
        answer: 'Fast DDS',
        explanation: 'eProsima Fast DDS is the default middleware implementation for Humble.'
      }
    ]
  },
  'pid': {
    id: 'q2',
    title: 'PID Control Mastery',
    topic: 'Control Theory',
    questions: [
      {
        id: 'q2_1',
        type: 'mcq',
        question: 'Which term in PID reduces steady-state error to zero?',
        options: ['Proportional', 'Integral', 'Derivative', 'Bias'],
        answer: 'Integral',
        explanation: 'The Integral term sums the error over time, eventually eliminating steady-state error.'
      },
      {
        id: 'q2_2',
        type: 'tf',
        question: 'Increasing the Derivative gain (Kd) always makes the system more stable.',
        answer: 'False',
        explanation: 'While Kd can reduce overshoot, excessive Kd can amplify noise and cause instability.'
      },
      {
        id: 'q2_3',
        type: 'mcq',
        question: 'What does the "P" in PID stand for?',
        options: ['Power', 'Proportional', 'Parallel', 'Position'],
        answer: 'Proportional',
        explanation: 'The Proportional term provides an output proportional to the current error.'
      },
      {
        id: 'q2_4',
        type: 'short',
        question: 'What is the target value in a control loop called?',
        answer: 'Setpoint',
        explanation: 'The setpoint is the desired value the controller is trying to reach.'
      },
      {
        id: 'q2_5',
        type: 'mcq',
        question: 'What is "Overshoot"?',
        options: ['When the system is too slow', 'When the system exceeds the setpoint', 'When the system stops early', 'When the sensor fails'],
        answer: 'When the system exceeds the setpoint',
        explanation: 'Overshoot occurs when the system goes past the target value before settling.'
      },
      {
        id: 'q2_6',
        type: 'tf',
        question: 'A high Proportional gain (Kp) can cause oscillations.',
        answer: 'True',
        explanation: 'High Kp makes the system more aggressive, which can lead to instability and oscillation.'
      },
      {
        id: 'q2_7',
        type: 'short',
        question: 'What is the difference between Setpoint and Process Variable?',
        answer: 'Error',
        explanation: 'The error is the difference between where you want to be and where you are.'
      },
      {
        id: 'q2_8',
        type: 'mcq',
        question: 'Which term acts as a "brake" on the system?',
        options: ['Proportional', 'Integral', 'Derivative', 'Feed-forward'],
        answer: 'Derivative',
        explanation: 'The Derivative term responds to the rate of change, effectively damping the system.'
      },
      {
        id: 'q2_9',
        type: 'tf',
        question: 'Integral windup is a common problem in PID controllers.',
        answer: 'True',
        explanation: 'Windup occurs when the integral term continues to grow while the actuator is saturated.'
      },
      {
        id: 'q2_10',
        type: 'short',
        question: 'What is the most common tuning method for PID?',
        answer: 'Ziegler-Nichols',
        explanation: 'The Ziegler-Nichols method is a classic heuristic tuning method for PID loops.'
      }
    ]
  },
  'kinematics': {
    id: 'q3',
    title: 'Robot Kinematics',
    topic: 'Kinematics',
    questions: [
      {
        id: 'q3_1',
        type: 'mcq',
        question: 'What is "Forward Kinematics"?',
        options: ['Finding joint angles from position', 'Finding end-effector position from joint angles', 'Calculating motor torque', 'Designing the robot frame'],
        answer: 'Finding end-effector position from joint angles',
        explanation: 'Forward Kinematics calculates the position of the end-effector given the joint parameters.'
      },
      {
        id: 'q3_2',
        type: 'tf',
        question: 'Inverse Kinematics often has multiple valid solutions for a single position.',
        answer: 'True',
        explanation: 'A robot arm can often reach the same point in space using different configurations (e.g., elbow up vs. elbow down).'
      },
      {
        id: 'q3_3',
        type: 'mcq',
        question: 'What does "DOF" stand for in robotics?',
        options: ['Direction of Force', 'Degrees of Freedom', 'Data of Flight', 'Digital Output Frequency'],
        answer: 'Degrees of Freedom',
        explanation: 'DOF refers to the number of independent parameters that define the robot\'s configuration.'
      },
      {
        id: 'q3_4',
        type: 'short',
        question: 'What matrix is commonly used to represent rotation and translation together?',
        answer: 'Homogeneous Transformation Matrix',
        explanation: 'A 4x4 Homogeneous Transformation Matrix combines rotation and translation in 3D space.'
      },
      {
        id: 'q3_5',
        type: 'mcq',
        question: 'Which joint type allows for linear motion?',
        options: ['Revolute', 'Prismatic', 'Spherical', 'Universal'],
        answer: 'Prismatic',
        explanation: 'Prismatic joints provide linear (sliding) motion between two links.'
      },
      {
        id: 'q3_6',
        type: 'tf',
        question: 'The Jacobian matrix relates joint velocities to end-effector velocities.',
        answer: 'True',
        explanation: 'The Jacobian is fundamental for velocity control and singularity analysis.'
      },
      {
        id: 'q3_7',
        type: 'short',
        question: 'What is a point where a robot loses one or more degrees of freedom called?',
        answer: 'Singularity',
        explanation: 'A singularity is a configuration where the robot arm cannot move in certain directions.'
      },
      {
        id: 'q3_8',
        type: 'mcq',
        question: 'What is the "Workspace" of a robot?',
        options: ['The table it sits on', 'The set of all points the end-effector can reach', 'The control software', 'The power supply range'],
        answer: 'The set of all points the end-effector can reach',
        explanation: 'The workspace defines the physical volume reachable by the robot.'
      },
      {
        id: 'q3_9',
        type: 'tf',
        question: 'A 6-DOF robot arm can reach any position and orientation in 3D space (within its range).',
        answer: 'True',
        explanation: '6 degrees of freedom are required to fully define position (x, y, z) and orientation (roll, pitch, yaw).'
      },
      {
        id: 'q3_10',
        type: 'short',
        question: 'What standard convention uses four parameters to describe link relationships?',
        answer: 'Denavit-Hartenberg',
        explanation: 'The Denavit-Hartenberg (DH) convention is the standard for modeling robot kinematics.'
      }
    ]
  },
  'sensors': {
    id: 'q4',
    title: 'Robotic Sensors & SLAM',
    topic: 'Sensors',
    questions: [
      {
        id: 'q4_1',
        type: 'mcq',
        question: 'What does SLAM stand for?',
        options: ['Simultaneous Localization and Mapping', 'Sensor Logic and Management', 'System Level Autonomous Motion', 'Signal Level Analysis Module'],
        answer: 'Simultaneous Localization and Mapping',
        explanation: 'SLAM is the process of building a map while simultaneously keeping track of the robot\'s location.'
      },
      {
        id: 'q4_2',
        type: 'tf',
        question: 'Lidar uses sound waves to measure distance.',
        answer: 'False',
        explanation: 'Lidar uses light (laser pulses), while Ultrasonic sensors use sound waves.'
      },
      {
        id: 'q4_3',
        type: 'mcq',
        question: 'Which sensor is best for measuring rotation rate?',
        options: ['Accelerometer', 'Gyroscope', 'Magnetometer', 'Barometer'],
        answer: 'Gyroscope',
        explanation: 'A gyroscope measures angular velocity (rotation rate).'
      },
      {
        id: 'q4_4',
        type: 'short',
        question: 'What does IMU stand for?',
        answer: 'Inertial Measurement Unit',
        explanation: 'An IMU typically combines accelerometers and gyroscopes to track motion.'
      },
      {
        id: 'q4_5',
        type: 'mcq',
        question: 'What is "Odometry"?',
        options: ['Measuring distance traveled using wheel encoders', 'Detecting obstacles with infrared', 'Calculating battery life', 'Streaming video data'],
        answer: 'Measuring distance traveled using wheel encoders',
        explanation: 'Odometry uses data from motion sensors to estimate change in position over time.'
      },
      {
        id: 'q4_6',
        type: 'tf',
        question: 'Wheel slip causes errors in odometry.',
        answer: 'True',
        explanation: 'If wheels slip, the encoders report motion that didn\'t actually happen, leading to drift.'
      },
      {
        id: 'q4_7',
        type: 'short',
        question: 'What filter is commonly used to fuse IMU and Odometry data?',
        answer: 'Kalman Filter',
        explanation: 'The Kalman Filter (and its variants like EKF) is standard for sensor fusion in robotics.'
      },
      {
        id: 'q4_8',
        type: 'mcq',
        question: 'What is a "Point Cloud"?',
        options: ['A weather phenomenon', 'A set of data points in 3D space from a Lidar', 'A type of neural network', 'A cloud-based storage system'],
        answer: 'A set of data points in 3D space from a Lidar',
        explanation: 'Lidar sensors produce point clouds representing the surfaces of the environment.'
      },
      {
        id: 'q4_9',
        type: 'tf',
        question: 'GPS is highly accurate for indoor robot navigation.',
        answer: 'False',
        explanation: 'GPS signals are weak or unavailable indoors; robots usually rely on Lidar or Vision for indoor SLAM.'
      },
      {
        id: 'q4_10',
        type: 'short',
        question: 'What is the process of combining data from multiple sensors called?',
        answer: 'Sensor Fusion',
        explanation: 'Sensor fusion combines data from different sources to reduce uncertainty and improve accuracy.'
      }
    ]
  },
  'vision': {
    id: 'q5',
    title: 'Computer Vision for Robotics',
    topic: 'Computer Vision',
    questions: [
      {
        id: 'q5_1',
        type: 'mcq',
        question: 'What is the primary library used for Computer Vision in Python?',
        options: ['TensorFlow', 'OpenCV', 'PyTorch', 'Matplotlib'],
        answer: 'OpenCV',
        explanation: 'OpenCV (Open Source Computer Vision Library) is the industry standard for real-time computer vision.'
      },
      {
        id: 'q5_2',
        type: 'tf',
        question: 'A digital image is represented as a matrix of pixels.',
        answer: 'True',
        explanation: 'Images are stored as 2D (grayscale) or 3D (color) arrays of intensity values.'
      },
      {
        id: 'q5_3',
        type: 'mcq',
        question: 'What does RGB stand for?',
        options: ['Red Green Blue', 'Real Gray Black', 'Radial Gradient Beam', 'Robot Ground Base'],
        answer: 'Red Green Blue',
        explanation: 'RGB is the additive color model used for digital displays.'
      },
      {
        id: 'q5_4',
        type: 'short',
        question: 'What is the process of finding edges in an image called?',
        answer: 'Edge Detection',
        explanation: 'Edge detection (like the Canny algorithm) identifies points where image brightness changes sharply.'
      },
      {
        id: 'q5_5',
        type: 'mcq',
        question: 'What is "Thresholding"?',
        options: ['Increasing image resolution', 'Converting a grayscale image to binary', 'Rotating the image', 'Compressing the file size'],
        answer: 'Converting a grayscale image to binary',
        explanation: 'Thresholding separates pixels into two groups based on their intensity relative to a threshold value.'
      },
      {
        id: 'q5_6',
        type: 'tf',
        question: 'Object detection only identifies where an object is, not what it is.',
        answer: 'False',
        explanation: 'Object detection both locates (bounding box) and classifies (label) objects in an image.'
      },
      {
        id: 'q5_7',
        type: 'short',
        question: 'What is the name of a popular real-time object detection algorithm?',
        answer: 'YOLO',
        explanation: 'YOLO (You Only Look Once) is a state-of-the-art, real-time object detection system.'
      },
      {
        id: 'q5_8',
        type: 'mcq',
        question: 'What is "Optical Flow"?',
        options: ['The speed of light in a lens', 'The pattern of apparent motion of objects in a scene', 'A type of fiber optic cable', 'The brightness of a pixel'],
        answer: 'The pattern of apparent motion of objects in a scene',
        explanation: 'Optical flow is used to track motion between consecutive video frames.'
      },
      {
        id: 'q5_9',
        type: 'tf',
        question: 'HSV color space is often better than RGB for color-based object tracking.',
        answer: 'True',
        explanation: 'HSV (Hue, Saturation, Value) separates color information from brightness, making it more robust to lighting changes.'
      },
      {
        id: 'q5_10',
        type: 'short',
        question: 'What is the process of removing noise from an image called?',
        answer: 'Filtering',
        explanation: 'Image filtering (like Gaussian blur) is used to smooth images and reduce noise.'
      }
    ]
  },
  'arduino': {
    id: 'q6',
    title: 'Arduino Basics',
    topic: 'Electronics',
    questions: [
      {
        id: 'q6_1',
        type: 'mcq',
        question: 'What is the default programming language for Arduino?',
        options: ['Python', 'C++', 'Java', 'Assembly'],
        answer: 'C++',
        explanation: 'Arduino uses a simplified version of C++.'
      },
      {
        id: 'q6_2',
        type: 'tf',
        question: 'The setup() function runs only once when the Arduino starts.',
        answer: 'True',
        explanation: 'setup() is used for initialization and runs once; loop() runs repeatedly.'
      },
      {
        id: 'q6_3',
        type: 'short',
        question: 'What is the name of the software used to write and upload code to Arduino?',
        answer: 'Arduino IDE',
        explanation: 'The Arduino Integrated Development Environment (IDE) is the standard software.'
      }
    ]
  },
  'esp32': {
    id: 'q7',
    title: 'ESP32 & IoT',
    topic: 'IoT',
    questions: [
      {
        id: 'q7_1',
        type: 'mcq',
        question: 'What is the main advantage of the ESP32 over the Arduino Uno?',
        options: ['Built-in Wi-Fi and Bluetooth', 'More analog pins', 'Lower price', 'Larger physical size'],
        answer: 'Built-in Wi-Fi and Bluetooth',
        explanation: 'The ESP32 is famous for its integrated wireless connectivity.'
      },
      {
        id: 'q7_2',
        type: 'tf',
        question: 'The ESP32 has a dual-core processor.',
        answer: 'True',
        explanation: 'Most ESP32 models feature a dual-core Xtensa microprocessor.'
      }
    ]
  }
};

const SYSTEM_INSTRUCTION = `You are GME.ABDO's Robotics AI, a professional and engaging assistant for Robotics Engineering.
Your expertise includes ROS2, Embedded Systems, Circuit Design, Computer Vision, and Control Theory.

PERSONALITY:
- Be helpful, technical, and encouraging.
- Use emojis to make the conversation feel alive (🤖, ⚙️, 🚀, 💡).
- Provide "Pro Tips" when explaining complex concepts.
- Highlight key terms in **bold**.

VIDEO RECOMMENDATION PROTOCOL:
If a user asks about a topic, suggest relevant videos. 
1. If it's in the curated library, use [VIDEO_ID: v1].
2. If it's a general topic, suggest a search using [TOPIC_SUGGESTION: topic name].

QUIZ TRIGGER PROTOCOL:
After explaining a complex topic or if the user asks to be tested, suggest a quiz.
Append the Quiz ID in the format [QUIZ_TRIGGER: ros2], [QUIZ_TRIGGER: pid], [QUIZ_TRIGGER: kinematics], [QUIZ_TRIGGER: sensors], [QUIZ_TRIGGER: vision], [QUIZ_TRIGGER: arduino], or [QUIZ_TRIGGER: esp32].

Library IDs:
- v1: ROS2 Humble Intro
- v2: PID Control
- v3: Inverse Kinematics
- v4: Lidar SLAM Navigation
- v5: Computer Vision with OpenCV
- v6: Arduino for Beginners
- v7: ESP32-CAM AI Projects
- v8: Robotic Sensors Deep Dive
- v9: Reinforcement Learning in Robotics
- v10: Advanced ROS2 Navigation

Quiz IDs:
- ros2: ROS2 Fundamentals
- pid: PID Control Mastery
- kinematics: Robot Kinematics
- sensors: Robotic Sensors & SLAM
- vision: Computer Vision for Robotics
- arduino: Arduino Basics
- esp32: ESP32 & IoT

HARDWARE ANALYSIS:
If the user uploads an image, analyze the electronic components or mechanical parts. Identify microcontrollers (ESP32, Arduino), sensors (Lidar, IMU), or actuators.

Always use code blocks for snippets. Be technical and precise.`;

export default function App() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const t = TRANSLATIONS[language];

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const [view, setView] = useState<'chat' | 'videos' | 'quiz'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: t.welcome,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gme-theme');
      if (saved !== null) return saved === 'dark';
      
      // Auto-switch based on time (7 PM to 7 AM)
      const hour = new Date().getHours();
      return hour >= 19 || hour < 7;
    }
    return true;
  });

  const [botPersonality, setBotPersonality] = useState<'Technical' | 'Friendly' | 'Funny'>('Friendly');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sendSound = useRef<HTMLAudioElement | null>(null);
  const receiveSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'ar' ? 'ar-SA' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [language]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current?.start();
    }
  };

  const speakText = async (text: string) => {
    if (!voiceEnabled) return;
    setIsSpeaking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: language === 'ar' ? 'Kore' : 'Zephyr' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioSrc = `data:audio/mp3;base64,${base64Audio}`;
        if (audioRef.current) {
          audioRef.current.src = audioSrc;
          audioRef.current.play();
        }
      }
    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    sendSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
    receiveSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
    audioRef.current = new Audio();
    audioRef.current.onended = () => setIsSpeaking(false);
  }, []);

  useEffect(() => {
    if (view === 'chat') setHasNewMessage(false);
  }, [view]);

  useEffect(() => {
    localStorage.setItem('gme-theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  const [videoSearch, setVideoSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [dynamicVideos, setDynamicVideos] = useState<Video[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showVideoQuiz, setShowVideoQuiz] = useState(false);
  const [videoQuizStep, setVideoQuizStep] = useState(0);
  const [videoQuizAnswers, setVideoQuizAnswers] = useState<Record<string, string>>({});
  const [videoQuizScore, setVideoQuizScore] = useState(0);
  const [videoQuizFinished, setVideoQuizFinished] = useState(false);
  const [videoQuizFeedback, setVideoQuizFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string>('All');
  
  const fetchYouTubeVideos = async (query: string, topic?: string) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const searchQuery = topic && topic !== 'All' ? `${topic} ${query}` : query;
    
    if (!apiKey) {
      // Fallback to library if no API key
      return VIDEO_LIBRARY.filter(v => 
        (v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        v.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) &&
        (topic === 'All' || !topic || v.topic === topic)
      );
    }

    try {
      setIsLoadingVideos(true);
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=9&q=${encodeURIComponent(searchQuery + ' robotics tutorial')}&type=video&key=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('API Key invalid or quota exceeded');
      }

      const data = await response.json();
      
      if (data.items) {
        return data.items.map((item: any) => ({
          id: item.id.videoId,
          videoId: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          category: 'Intermediate', // Default for dynamic
          topic: topic !== 'All' ? topic : 'Robotics',
          tags: ['YouTube', 'Tutorial'],
          description: item.snippet.description
        }));
      }
      return [];
    } catch (error) {
      console.error("YouTube API Error:", error);
      return [];
    } finally {
      setIsLoadingVideos(false);
    }
  };

  useEffect(() => {
    const loadVideos = async () => {
      if (view === 'videos') {
        const results = await fetchYouTubeVideos(videoSearch || 'robotics', activeTopic);
        setDynamicVideos(results);
      }
    };
    loadVideos();
  }, [view, videoSearch, activeTopic]);
  
  // Quiz State
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [proficiency, setProficiency] = useState(45);
  
  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setView('quiz');
  };

  const handleQuizAnswer = (answer: string) => {
    if (selectedAnswer || !activeQuiz) return;
    
    setSelectedAnswer(answer);
    const currentQuestion = activeQuiz.questions[currentQuestionIndex];
    
    if (answer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
      setQuizScore(prev => prev + 1);
    }
    
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (!activeQuiz) return;
    
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
      setProficiency(prev => Math.min(100, prev + 5));
    }
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, view]);

  const filteredVideos = useMemo(() => {
    return VIDEO_LIBRARY.filter(v => {
      const matchesSearch = v.title.toLowerCase().includes(videoSearch.toLowerCase()) || 
                           v.tags.some(t => t.toLowerCase().includes(videoSearch.toLowerCase()));
      const matchesCategory = activeCategory === 'All' || v.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [videoSearch, activeCategory]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoQuizAnswer = (answer: string) => {
    if (!selectedVideo || !selectedVideo.quizId) return;
    const quiz = QUIZ_DATA[selectedVideo.quizId];
    if (!quiz) return;

    const currentQuestion = quiz.questions[videoQuizStep];
    const isCorrect = answer.toLowerCase() === currentQuestion.answer.toLowerCase();

    setVideoQuizFeedback({
      isCorrect,
      explanation: currentQuestion.explanation
    });

    if (isCorrect) {
      setVideoQuizScore(prev => prev + 1);
    }

    setVideoQuizAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const nextVideoQuizStep = () => {
    if (!selectedVideo || !selectedVideo.quizId) return;
    const quiz = QUIZ_DATA[selectedVideo.quizId];
    
    setVideoQuizFeedback(null);
    if (videoQuizStep < quiz.questions.length - 1) {
      setVideoQuizStep(prev => prev + 1);
    } else {
      setVideoQuizFinished(true);
      const scorePercentage = (videoQuizScore / quiz.questions.length) * 100;
      if (scorePercentage >= 80 && !completedQuizzes.includes(selectedVideo.quizId)) {
        setCompletedQuizzes(prev => [...prev, selectedVideo.quizId!]);
        setShowCertificate(true);
      }
    }
  };

  const resetVideoQuiz = () => {
    setVideoQuizStep(0);
    setVideoQuizAnswers({});
    setVideoQuizScore(0);
    setVideoQuizFinished(false);
    setVideoQuizFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      image: selectedImage || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setIsTyping(true);
    sendSound.current?.play().catch(() => {});

    try {
      const model = "gemini-3-flash-preview";
      let parts: any[] = [{ text: input || "Analyze this robotics hardware." }];
      if (userMessage.image) {
        parts.push({ inlineData: { mimeType: "image/png", data: userMessage.image.split(',')[1] } });
      }

      const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: [{ parts }],
        config: { 
          systemInstruction: `${t.systemInstruction}\n\nCURRENT PERSONALITY: ${botPersonality}. Adjust your tone accordingly.` 
        },
      });

      const text = response.text || "";
      
      // Extract Video Suggestions
      const videoMatch = text.match(/\[VIDEO_ID:\s*([^\]]+)\]/);
      const suggestedIds = videoMatch ? videoMatch[1].split(',').map(s => s.trim()) : [];
      
      // Extract Topic Suggestions
      const topicMatch = text.match(/\[TOPIC_SUGGESTION:\s*([^\]]+)\]/);
      const suggestedTopic = topicMatch ? topicMatch[1].trim() : null;
      
      // Extract Quiz Triggers
      const quizMatch = text.match(/\[QUIZ_TRIGGER:\s*([^\]]+)\]/);
      const quizId = quizMatch ? quizMatch[1].trim() : null;

      let cleanText = text.replace(/\[VIDEO_ID:[^\]]+\]/, '');
      cleanText = cleanText.replace(/\[TOPIC_SUGGESTION:[^\]]+\]/, '');
      cleanText = cleanText.replace(/\[QUIZ_TRIGGER:[^\]]+\]/, '').trim();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: cleanText,
        timestamp: new Date(),
        suggestedVideos: suggestedIds,
        quizId: quizId || undefined,
      };

      if (suggestedTopic) {
        (assistantMessage as any).suggestedTopic = suggestedTopic;
      }

      if (quizId && QUIZ_DATA[quizId]) {
        assistantMessage.content += `\n\n**Ready to test your knowledge?** I've prepared a quiz on ${QUIZ_DATA[quizId].topic}.`;
      }

      setMessages(prev => [...prev, assistantMessage]);
      receiveSound.current?.play().catch(() => {});
      if (view !== 'chat') setHasNewMessage(true);
      
      // Voice Output
      if (voiceEnabled) {
        speakText(cleanText);
      }
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "System Error: Connection to AI core lost.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={cn(
      "flex h-screen bg-background text-foreground font-sans overflow-hidden relative",
      darkMode ? "dark" : ""
    )}>
      {/* Robotics Themed Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1920" 
          alt="Robotics Background"
          className="w-full h-full object-cover opacity-[0.07] dark:opacity-[0.03] scale-105 transition-opacity duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/80 to-transparent backdrop-blur-[1px]" />
        
        {/* Subtle Circuit Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: windowWidth < 1024 ? (isMobileMenuOpen ? '100%' : '0%') : (isSidebarOpen ? 260 : 0),
          opacity: windowWidth < 1024 ? (isMobileMenuOpen ? 1 : 0) : (isSidebarOpen ? 1 : 0),
          x: isMobileMenuOpen ? 0 : (windowWidth < 1024 ? -260 : 0)
        }}
        className={cn(
          "bg-card/80 backdrop-blur-md border-r border-border flex flex-col overflow-hidden z-40 transition-all duration-300",
          "fixed inset-y-0 left-0 lg:relative lg:translate-x-0 w-[260px]",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-border">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <Cpu className="text-primary w-5 h-5" />
              </div>
              <span className="font-mono font-black text-xl tracking-tighter text-primary">GME.ABDO</span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">{t.roboticsEngineer}</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4 px-2">{t.navigation}</div>
          <button 
            onClick={() => { setView('chat'); setIsMobileMenuOpen(false); }}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-md transition-all text-sm",
              view === 'chat' ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-muted"
            )}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4" />
              <span>{t.chat}</span>
            </div>
            {hasNewMessage && (
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            )}
          </button>
          <button 
            onClick={() => { setView('videos'); setIsMobileMenuOpen(false); }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm",
              view === 'videos' ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-muted"
            )}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.videos}</span>
          </button>
          <button 
            onClick={() => {
              setActiveQuiz(null);
              setView('quiz');
              setIsMobileMenuOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm",
              view === 'quiz' ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Trophy className="w-4 h-4" />
            <span>{t.quiz}</span>
          </button>
          
          <div className="pt-6">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4 px-2">{t.appearance}</div>
            <div className="flex items-center gap-1 p-1 bg-muted rounded-xl border border-border">
              <button 
                onClick={() => setDarkMode(false)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold transition-all",
                  !darkMode ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>{t.day}</span>
              </button>
              <button 
                onClick={() => setDarkMode(true)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold transition-all",
                  darkMode ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>{t.night}</span>
              </button>
            </div>
          </div>
          
          <div className="pt-6">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4 px-2">{t.personality}</div>
            <div className="flex items-center gap-1 p-1 bg-muted rounded-xl border border-border">
              {(['Technical', 'Friendly', 'Funny'] as const).map(p => (
                <button 
                  key={p}
                  onClick={() => setBotPersonality(p)}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg text-[9px] font-bold transition-all",
                    botPersonality === p ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {p === 'Technical' ? t.technical : p === 'Friendly' ? t.friendly : t.funny}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4 px-2">{t.systemTools}</div>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm text-muted-foreground">
              <Terminal className="w-4 h-4" />
              <span>{t.ros2Console}</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm text-muted-foreground">
              <Zap className="w-4 h-4" />
              <span>{t.powerAnalysis}</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted transition-colors text-sm">
            <Settings className="w-4 h-4" />
            <span>{t.systemConfig}</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/60 backdrop-blur-xl z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:block p-2 hover:bg-muted rounded-md transition-colors">
              {isSidebarOpen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                {view === 'chat' ? t.coreStatusOnline : t.academyLibraryLoaded}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted rounded-lg transition-all text-xs font-bold border border-border"
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-primary"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {view === 'chat' ? (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8">
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3 md:gap-4 max-w-5xl mx-auto w-full", 
                      msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 border",
                      msg.role === 'user' ? "bg-secondary border-border" : "bg-primary/10 border-primary/20"
                    )}>
                      {msg.role === 'user' ? <User className="w-4 h-4 md:w-5 md:h-5" /> : <Bot className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                    </div>

                    <div className={cn("flex flex-col space-y-2 md:space-y-3 flex-1", msg.role === 'user' ? "items-end" : "items-start")}>
                      <div className={cn(
                        "px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[85%] lg:max-w-[70%] transition-all hover:shadow-md",
                        msg.role === 'user' ? "bg-primary text-primary-foreground rounded-tr-none shadow-md" : "bg-card border border-border text-foreground rounded-tl-none shadow-sm"
                      )}>
                        {msg.image && (
                          <div className="mb-3 rounded-lg overflow-hidden border border-border">
                            <img src={msg.image} alt="Hardware" className="max-w-xs h-auto" />
                          </div>
                        )}
                        <div className={cn(
                          "prose prose-sm max-w-none",
                          msg.role === 'user' ? "prose-invert" : "dark:prose-invert"
                        )}>
                          <Markdown>{msg.content}</Markdown>
                        </div>
                      </div>

                      {/* Suggested Videos in Chat */}
                      {msg.suggestedVideos && msg.suggestedVideos.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-2">
                          {msg.suggestedVideos.map(vidId => {
                            const video = VIDEO_LIBRARY.find(v => v.id === vidId);
                            if (!video) return null;
                            return (
                              <button 
                                key={vidId}
                                onClick={() => setView('videos')}
                                className="flex items-center gap-2 bg-card border border-border p-2 rounded-lg hover:border-primary/50 transition-all group"
                              >
                                <div className="w-12 h-8 rounded bg-muted overflow-hidden relative">
                                  <img src={video.thumbnail} className="w-full h-full object-cover opacity-50" />
                                  <Play className="w-3 h-3 absolute inset-0 m-auto text-primary" />
                                </div>
                                <div className="text-left">
                                  <div className="text-[10px] font-bold text-primary uppercase tracking-tighter">Recommended</div>
                                  <div className="text-[11px] text-foreground font-medium truncate max-w-[120px]">{video.title}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Topic Suggestion in Chat */}
                      {(msg as any).suggestedTopic && (
                        <div className="mt-2">
                          <button 
                            onClick={() => {
                              setVideoSearch((msg as any).suggestedTopic);
                              setView('videos');
                            }}
                            className="flex items-center gap-2 bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-lg text-primary text-[11px] font-bold hover:bg-primary/10 transition-all"
                          >
                            <Search className="w-3.5 h-3.5" />
                            Explore videos about {(msg as any).suggestedTopic}
                          </button>
                        </div>
                      )}

                      {/* Quiz Trigger in Chat */}
                      {msg.role === 'assistant' && msg.quizId && (
                        <div className="mt-4">
                          <button 
                            onClick={() => {
                              if (msg.quizId && QUIZ_DATA[msg.quizId]) {
                                startQuiz(QUIZ_DATA[msg.quizId]);
                              }
                            }}
                            className="flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-xl text-primary text-xs font-bold hover:bg-primary/20 transition-all"
                          >
                            <Trophy className="w-4 h-4" />
                            Start Knowledge Check
                          </button>
                        </div>
                      )}
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex gap-4 max-w-4xl mx-auto">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Bot className="w-5 h-5 text-primary animate-pulse" />
                    </div>
                    <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Replies */}
                {messages.length === 1 && (
                  <div className="max-w-4xl mx-auto flex flex-wrap gap-2 pt-4">
                    <button 
                      onClick={() => setInput(t.tellMeAboutRos2)}
                      className="px-4 py-2 rounded-full bg-muted border border-border text-xs font-medium hover:border-primary/50 hover:text-primary transition-all"
                    >
                      🤖 {t.whatIsRos2}
                    </button>
                    <button 
                      onClick={() => setView('videos')}
                      className="px-4 py-2 rounded-full bg-muted border border-border text-xs font-medium hover:border-primary/50 hover:text-primary transition-all"
                    >
                      📺 {t.videos}
                    </button>
                    <button 
                      onClick={() => setInput(t.howPidWorks)}
                      className="px-4 py-2 rounded-full bg-muted border border-border text-xs font-medium hover:border-primary/50 hover:text-primary transition-all"
                    >
                      ⚙️ {t.pidControl}
                    </button>
                    <button 
                      onClick={() => setInput(t.giveMeProjectIdea)}
                      className="px-4 py-2 rounded-full bg-muted border border-border text-xs font-medium hover:border-primary/50 hover:text-primary transition-all"
                    >
                      💡 {t.projectIdeas}
                    </button>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 md:p-6 bg-background border-t border-border">
                <div className="max-w-4xl mx-auto">
                  <form onSubmit={handleSubmit} className="relative">
                    <div className="flex items-center gap-1 md:gap-2 bg-card border border-border rounded-2xl p-1.5 md:p-2 focus-within:border-primary/50 transition-all shadow-lg">
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 md:p-3 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-primary">
                        <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                      
                      <button 
                        type="button" 
                        onClick={toggleRecording} 
                        className={cn(
                          "p-2 md:p-3 rounded-xl transition-all",
                          isRecording ? "bg-red-500 text-white animate-pulse" : "hover:bg-muted text-muted-foreground hover:text-primary"
                        )}
                        title={isRecording ? t.stopListening : t.speak}
                      >
                        {isRecording ? <MicOff className="w-4 h-4 md:w-5 md:h-5" /> : <Mic className="w-4 h-4 md:w-5 md:h-5" />}
                      </button>

                      <input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t.searchPlaceholder}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-xs md:text-sm py-2 md:py-3 px-1 md:px-2 text-foreground placeholder:text-muted-foreground"
                      />

                      <button 
                        type="button" 
                        onClick={() => setVoiceEnabled(!voiceEnabled)} 
                        className={cn(
                          "p-2 md:p-3 rounded-xl transition-all",
                          voiceEnabled ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"
                        )}
                        title={voiceEnabled ? t.mute : t.unmute}
                      >
                        {voiceEnabled ? <Volume2 className="w-4 h-4 md:w-5 md:h-5" /> : <VolumeX className="w-4 h-4 md:w-5 md:h-5" />}
                      </button>

                      <button type="submit" disabled={isTyping || (!input.trim() && !selectedImage)} className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground p-2 md:p-3 rounded-xl transition-all shadow-md">
                        <Send className={cn("w-4 h-4 md:w-5 md:h-5", language === 'ar' && "rotate-180")} />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          ) : view === 'videos' ? (
            <motion.div 
              key="videos"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Video Library Header */}
              <div className="p-8 bg-gradient-to-b from-primary/5 to-transparent border-b border-border">
                <div className="max-w-6xl mx-auto">
                  <h1 
                    onClick={() => {
                      setVideoSearch('');
                      setActiveCategory('All');
                    }}
                    className="text-3xl font-bold text-foreground mb-2 cursor-pointer hover:text-primary transition-colors inline-block"
                  >
                    GME.ABDO Academy
                  </h1>
                  <p className="text-muted-foreground text-sm mb-8">{t.masterRoboticsText}</p>
                  
                  {/* Trending Topics */}
                  <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">{t.trending}:</span>
                    {['ROS2 Humble', 'PID Tuning', 'Lidar SLAM', 'ESP32 Cam', 'Inverse Kinematics', 'OpenCV Python'].map(topic => (
                      <button 
                        key={topic}
                        onClick={() => setVideoSearch(topic)}
                        className="px-3 py-1 rounded-full bg-muted border border-border text-[10px] font-medium hover:border-primary/50 hover:text-primary transition-all whitespace-nowrap"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>

                  {/* Filters & Search */}
                  <div className="flex flex-col lg:flex-row gap-4 mt-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                      {['All', 'Robotics', 'AI', 'Sensors', 'Programming'].map(topic => (
                        <button 
                          key={topic}
                          onClick={() => setActiveTopic(topic)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap",
                            activeTopic === topic ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:bg-accent"
                          )}
                        >
                          {topic === 'All' ? t.all : topic}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        value={videoSearch}
                        onChange={(e) => setVideoSearch(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && setVideoSearch(videoSearch)}
                        placeholder={t.searchPlaceholder}
                        className="w-full bg-card border border-border rounded-xl py-3 pl-10 pr-12 text-sm focus:border-primary/50 outline-none transition-all shadow-sm"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {videoSearch && (
                          <button 
                            onClick={() => setVideoSearch('')}
                            className="p-1.5 hover:bg-muted rounded-md transition-colors"
                          >
                            <X className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        )}
                        <button 
                          onClick={() => setVideoSearch(videoSearch)}
                          className="p-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors"
                        >
                          <Search className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                      {['All', 'Beginner', 'Intermediate', 'Advanced'].map(cat => (
                        <button 
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap",
                            activeCategory === cat ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:bg-accent"
                          )}
                        >
                          {cat === 'All' ? t.all : cat === 'Beginner' ? t.beginner : cat === 'Intermediate' ? t.intermediate : t.advanced}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Academy Progress Tracker */}
                  <div className="mt-8 p-4 bg-card/50 border border-border rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Award className="text-primary w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground">{t.academyProgress}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{completedQuizzes.length} / {Object.keys(QUIZ_DATA).length} {t.quizzesMastered}</div>
                      </div>
                    </div>
                    <div className="flex-1 max-w-xs mx-8 hidden md:block">
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000" 
                          style={{ width: `${(completedQuizzes.length / Object.keys(QUIZ_DATA).length) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-mono font-bold text-primary">{Math.round((completedQuizzes.length / Object.keys(QUIZ_DATA).length) * 100)}%</div>
                      <div className="text-[9px] uppercase text-muted-foreground font-bold">{t.rank}: {completedQuizzes.length >= 3 ? t.expert : completedQuizzes.length >= 1 ? t.apprentice : t.novice}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Grid */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto">
                  {isLoadingVideos ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                      <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest">{t.fetchingContent}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(dynamicVideos.length > 0 ? dynamicVideos : VIDEO_LIBRARY).filter(v => {
                        const matchesCategory = activeCategory === 'All' || v.category === activeCategory;
                        const matchesTopic = activeTopic === 'All' || v.topic === activeTopic;
                        return matchesCategory && matchesTopic;
                      }).map((video) => (
                        <motion.div 
                          key={video.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all shadow-md flex flex-col"
                        >
                          <div 
                            className="aspect-video relative overflow-hidden cursor-pointer"
                            onClick={() => {
                              setSelectedVideo(video);
                              setIsVideoLoading(true);
                            }}
                          >
                            <img src={video.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                                <Play className="w-6 h-6 fill-current" />
                              </div>
                            </div>
                            <div className="absolute top-3 left-3">
                              <span className={cn(
                                "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                                video.category === 'Beginner' ? "bg-blue-500/20 text-blue-500" :
                                video.category === 'Intermediate' ? "bg-primary/20 text-primary" :
                                "bg-purple-500/20 text-purple-500"
                              )}>
                                {video.category === 'Beginner' ? t.beginner : video.category === 'Intermediate' ? t.intermediate : t.advanced}
                              </span>
                            </div>
                          </div>
                          <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-foreground font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{video.title}</h3>
                            <p className="text-muted-foreground text-xs leading-relaxed mb-4 flex-1 line-clamp-3">{video.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {video.tags.map(tag => (
                                <span key={tag} className="text-[9px] font-mono text-muted-foreground bg-muted px-2 py-1 rounded">#{tag}</span>
                              ))}
                            </div>
                            <button 
                              onClick={() => {
                                setSelectedVideo(video);
                                setIsVideoLoading(true);
                              }}
                              className="flex items-center justify-between w-full p-3 bg-muted hover:bg-primary hover:text-primary-foreground rounded-xl text-xs font-bold transition-all group/btn"
                            >
                              <span>{t.watchTutorial}</span>
                              <Play className="w-3 h-3" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  {!isLoadingVideos && dynamicVideos.length === 0 && VIDEO_LIBRARY.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                      <Search className="w-12 h-12 mb-4 opacity-20" />
                      <p>No tutorials found matching your search.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Video Player Modal */}
              <AnimatePresence>
                {selectedVideo && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                  >
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="w-full max-w-6xl h-[90vh] bg-card border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
                    >
                      {/* Left Side: Video Player */}
                      <div className="flex-[2] bg-black flex flex-col">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-card/50 backdrop-blur-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Play className="w-4 h-4 text-primary" />
                            </div>
                            <h2 className="font-bold text-white truncate max-w-md">{selectedVideo.title}</h2>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setIsAudioOnly(!isAudioOnly)}
                              className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all",
                                isAudioOnly ? "bg-primary text-primary-foreground" : "bg-white/10 text-white hover:bg-white/20"
                              )}
                            >
                              {isAudioOnly ? <Volume2 className="w-3 h-3" /> : <Headphones className="w-3 h-3" />}
                              {isAudioOnly ? 'Audio Mode On' : 'Audio Only'}
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedVideo(null);
                                setShowVideoQuiz(false);
                                resetVideoQuiz();
                              }}
                              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex-1 relative bg-zinc-950">
                          {isVideoLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-10">
                              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Initializing Video Stream...</p>
                            </div>
                          )}
                          
                          {isAudioOnly && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-[5] text-center p-8">
                              <motion.div 
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 mb-6"
                              >
                                <Headphones className="w-10 h-10 text-primary" />
                              </motion.div>
                              <h3 className="text-xl font-bold text-white mb-2">Audio Playback Mode</h3>
                              <p className="text-sm text-zinc-400 max-w-xs">Listening to the tutorial audio. Focus on the concepts while the video is hidden.</p>
                            </div>
                          )}

                          <iframe 
                            src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&controls=1&rel=0&modestbranding=1`}
                            title={selectedVideo.title}
                            onLoad={() => setIsVideoLoading(false)}
                            className={cn(
                              "w-full h-full border-none transition-all duration-500",
                              isAudioOnly ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
                            )}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>

                        {/* Related Images Gallery */}
                        {selectedVideo.relatedImages && selectedVideo.relatedImages.length > 0 && (
                          <div className="p-4 bg-black/50 border-t border-white/10">
                            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Topic Visuals</div>
                            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                              {selectedVideo.relatedImages.map((img, idx) => (
                                <motion.div 
                                  key={idx}
                                  whileHover={{ scale: 1.05 }}
                                  className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 cursor-zoom-in"
                                >
                                  <img src={img} className="w-full h-full object-cover" />
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Side: Details & Quiz */}
                      <div className="flex-1 bg-card border-l border-border flex flex-col overflow-hidden">
                        <div className="flex border-b border-border">
                          <button 
                            onClick={() => setShowVideoQuiz(false)}
                            className={cn(
                              "flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all",
                              !showVideoQuiz ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            Overview
                          </button>
                          {selectedVideo.quizId && (
                            <button 
                              onClick={() => setShowVideoQuiz(true)}
                              className={cn(
                                "flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all",
                                showVideoQuiz ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              Quiz
                            </button>
                          )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                          {!showVideoQuiz ? (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-6"
                            >
                              <div>
                                <h3 className="text-lg font-bold text-foreground mb-4">Tutorial Description</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {selectedVideo.description}
                                </p>
                              </div>

                              <div className="pt-6 border-t border-border">
                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Key Learning Outcomes</h4>
                                <ul className="space-y-3">
                                  {selectedVideo.tags.map(tag => (
                                    <li key={tag} className="flex items-center gap-3 text-sm text-foreground">
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                      <span>Mastery of <strong>{tag}</strong> concepts</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {selectedVideo.quizId && (
                                <button 
                                  onClick={() => setShowVideoQuiz(true)}
                                  className="w-full mt-8 p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-between group hover:bg-primary hover:text-primary-foreground transition-all"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-white/20">
                                      <Trophy className="w-4 h-4 text-primary group-hover:text-white" />
                                    </div>
                                    <div className="text-left">
                                      <div className="text-xs font-bold">Ready for the test?</div>
                                      <div className="text-[10px] opacity-70">10 Questions • Instant Feedback</div>
                                    </div>
                                  </div>
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              )}
                            </motion.div>
                          ) : (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="h-full flex flex-col"
                            >
                              {videoQuizFinished ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                                    <Trophy className="w-10 h-10 text-primary" />
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-bold text-foreground">Quiz Complete!</h3>
                                    <p className="text-sm text-muted-foreground mt-2">You scored {videoQuizScore} out of {QUIZ_DATA[selectedVideo.quizId!].questions.length}</p>
                                  </div>
                                  <div className="w-full p-4 bg-muted rounded-2xl">
                                    <div className="text-2xl font-bold text-primary">{Math.round((videoQuizScore / QUIZ_DATA[selectedVideo.quizId!].questions.length) * 100)}%</div>
                                    <div className="text-[10px] uppercase text-muted-foreground font-bold">Accuracy</div>
                                  </div>
                                  <button 
                                    onClick={resetVideoQuiz}
                                    className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-lg shadow-primary/20"
                                  >
                                    Retake Quiz
                                  </button>
                                </div>
                              ) : (
                                <div className="flex-1 flex flex-col">
                                  <div className="flex items-center justify-between mb-6">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Question {videoQuizStep + 1} of {QUIZ_DATA[selectedVideo.quizId!].questions.length}</div>
                                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-primary transition-all duration-500" 
                                        style={{ width: `${((videoQuizStep + 1) / QUIZ_DATA[selectedVideo.quizId!].questions.length) * 100}%` }}
                                      />
                                    </div>
                                  </div>

                                  <h3 className="text-base font-bold text-foreground mb-6 leading-relaxed">
                                    {QUIZ_DATA[selectedVideo.quizId!].questions[videoQuizStep].question}
                                  </h3>

                                  <div className="space-y-3 flex-1">
                                    {QUIZ_DATA[selectedVideo.quizId!].questions[videoQuizStep].type === 'mcq' ? (
                                      QUIZ_DATA[selectedVideo.quizId!].questions[videoQuizStep].options?.map((option) => (
                                        <button
                                          key={option}
                                          disabled={!!videoQuizFeedback}
                                          onClick={() => handleVideoQuizAnswer(option)}
                                          className={cn(
                                            "w-full p-4 rounded-xl text-left text-sm transition-all border",
                                            videoQuizAnswers[QUIZ_DATA[selectedVideo.quizId!].questions[videoQuizStep].id] === option
                                              ? (videoQuizFeedback?.isCorrect ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" : "bg-red-500/10 border-red-500/50 text-red-500")
                                              : "bg-muted/50 border-border hover:border-primary/50 hover:bg-muted"
                                          )}
                                        >
                                          {option}
                                        </button>
                                      ))
                                    ) : QUIZ_DATA[selectedVideo.quizId!].questions[videoQuizStep].type === 'tf' ? (
                                      ['True', 'False'].map((option) => (
                                        <button
                                          key={option}
                                          disabled={!!videoQuizFeedback}
                                          onClick={() => handleVideoQuizAnswer(option)}
                                          className={cn(
                                            "w-full p-4 rounded-xl text-left text-sm transition-all border",
                                            videoQuizAnswers[QUIZ_DATA[selectedVideo.quizId!].questions[videoQuizStep].id] === option
                                              ? (videoQuizFeedback?.isCorrect ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" : "bg-red-500/10 border-red-500/50 text-red-500")
                                              : "bg-muted/50 border-border hover:border-primary/50 hover:bg-muted"
                                          )}
                                        >
                                          {option}
                                        </button>
                                      ))
                                    ) : (
                                      <div className="space-y-4">
                                        <input 
                                          type="text"
                                          placeholder="Type your answer..."
                                          disabled={!!videoQuizFeedback}
                                          onKeyPress={(e) => e.key === 'Enter' && handleVideoQuizAnswer((e.target as HTMLInputElement).value)}
                                          className="w-full p-4 bg-muted border border-border rounded-xl text-sm focus:border-primary/50 outline-none"
                                        />
                                        <p className="text-[10px] text-muted-foreground italic">Press Enter to submit</p>
                                      </div>
                                    )}
                                  </div>

                                  {videoQuizFeedback && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className={cn(
                                        "mt-6 p-4 rounded-2xl border",
                                        videoQuizFeedback.isCorrect ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"
                                      )}
                                    >
                                      <div className="flex items-center gap-2 mb-2">
                                        {videoQuizFeedback.isCorrect ? (
                                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        ) : (
                                          <XCircle className="w-4 h-4 text-red-500" />
                                        )}
                                        <span className={cn("text-xs font-bold", videoQuizFeedback.isCorrect ? "text-emerald-500" : "text-red-500")}>
                                          {videoQuizFeedback.isCorrect ? "Correct!" : "Incorrect"}
                                        </span>
                                      </div>
                                      <p className="text-xs text-muted-foreground leading-relaxed">{videoQuizFeedback.explanation}</p>
                                      <button 
                                        onClick={nextVideoQuizStep}
                                        className="w-full mt-4 py-2 bg-foreground text-background rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                                      >
                                        {videoQuizStep < QUIZ_DATA[selectedVideo.quizId!].questions.length - 1 ? "Next Question" : "Finish Quiz"}
                                      </button>
                                    </motion.div>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Certificate Modal */}
              <AnimatePresence>
                {showCertificate && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
                  >
                    <motion.div 
                      initial={{ scale: 0.8, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      className="max-w-2xl w-full bg-white dark:bg-zinc-900 border-8 border-primary/20 p-12 rounded-none shadow-2xl text-center relative overflow-hidden"
                    >
                      {/* Certificate Background Pattern */}
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                           style={{ backgroundImage: 'radial-gradient(circle, currentColor 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
                      
                      <div className="relative z-10">
                        <div className="flex justify-center mb-8">
                          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/30">
                            <Award className="w-12 h-12 text-primary" />
                          </div>
                        </div>
                        
                        <h2 className="font-mono text-4xl font-black tracking-tighter text-primary mb-2 uppercase">Certificate of Achievement</h2>
                        <div className="h-1 w-32 bg-primary mx-auto mb-8" />
                        
                        <p className="text-muted-foreground italic mb-8">This certifies that</p>
                        <h3 className="text-3xl font-bold text-foreground mb-8 border-b-2 border-muted inline-block px-8 pb-2">Future Robotics Engineer</h3>
                        
                        <p className="text-muted-foreground mb-12 leading-relaxed">
                          Has successfully mastered the core concepts of <br/>
                          <span className="text-foreground font-bold text-xl">
                            {selectedVideo?.quizId ? QUIZ_DATA[selectedVideo.quizId].topic : 'Robotics Engineering'}
                          </span> <br/>
                          with a perfect score in the GME.ABDO Academy Proficiency Test.
                        </p>
                        
                        <div className="flex justify-between items-end pt-8 border-t border-muted">
                          <div className="text-left">
                            <div className="font-mono text-[10px] text-muted-foreground uppercase">Date Issued</div>
                            <div className="font-bold text-sm">{new Date().toLocaleDateString()}</div>
                          </div>
                          <div className="text-center">
                            <div className="w-24 h-24 opacity-20 mx-auto mb-2">
                              <Cpu className="w-full h-full" />
                            </div>
                            <div className="font-mono text-[8px] text-muted-foreground uppercase">Verification ID: GME-{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-[10px] text-muted-foreground uppercase">Authorized By</div>
                            <div className="font-bold text-sm italic">GME.ABDO AI Core</div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => setShowCertificate(false)}
                          className="mt-12 px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-transform shadow-xl"
                        >
                          Claim Achievement
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 flex flex-col items-center justify-center p-6 bg-background/40 backdrop-blur-sm relative overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary rounded-full blur-3xl" />
              </div>

              {!activeQuiz ? (
                <div className="max-w-4xl w-full">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-2">Proficiency Center</h2>
                    <p className="text-muted-foreground">Select a module to test your robotics expertise.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.values(QUIZ_DATA).map(quiz => {
                      const isCompleted = completedQuizzes.includes(quiz.id);
                      return (
                        <motion.button 
                          key={quiz.id}
                          whileHover={{ y: -5 }}
                          onClick={() => startQuiz(quiz)}
                          className={cn(
                            "p-6 rounded-3xl border text-left transition-all relative overflow-hidden group",
                            isCompleted ? "bg-emerald-500/5 border-emerald-500/20" : "bg-card border-border hover:border-primary/50"
                          )}
                        >
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                              <div className={cn(
                                "p-3 rounded-2xl",
                                isCompleted ? "bg-emerald-500/20 text-emerald-500" : "bg-primary/10 text-primary"
                              )}>
                                <Trophy className="w-6 h-6" />
                              </div>
                              {isCompleted && (
                                <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold uppercase">
                                  <CheckCircle2 className="w-3 h-3" />
                                  {t.mastered}
                                </div>
                              )}
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-1">{quiz.title}</h3>
                            <p className="text-xs text-muted-foreground mb-4">{quiz.questions.length} {t.questions} • {quiz.topic}</p>
                            <div className="flex items-center gap-2 text-xs font-bold text-primary group-hover:gap-3 transition-all">
                              <span>{t.startAssessment}</span>
                              <ChevronRight className={cn("w-4 h-4", language === 'ar' && "rotate-180")} />
                            </div>
                          </div>
                          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ) : quizFinished ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md w-full bg-card border border-border p-8 rounded-3xl shadow-2xl text-center relative z-10"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
                    <Trophy className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{t.testComplete}</h2>
                  <p className="text-muted-foreground text-sm mb-8">{t.demonstratedKnowledge} {activeQuiz.topic}.</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-muted p-4 rounded-2xl">
                      <div className="text-2xl font-bold text-primary">{quizScore}/{activeQuiz.questions.length}</div>
                      <div className="text-[10px] uppercase text-muted-foreground font-bold">{t.score}</div>
                    </div>
                    <div className="bg-muted p-4 rounded-2xl">
                      <div className="text-2xl font-bold text-primary">+5%</div>
                      <div className="text-[10px] uppercase text-muted-foreground font-bold">{t.proficiency}</div>
                    </div>
                  </div>

                  {/* Related Videos in Quiz Results */}
                  <div className="mb-8 text-left">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Play className="w-3 h-3" />
                      {t.recommendedTutorials}
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {VIDEO_LIBRARY.filter(v => v.tags.some(t => activeQuiz.topic.toLowerCase().includes(t.toLowerCase()))).slice(0, 2).map(video => (
                        <button 
                          key={video.id}
                          onClick={() => {
                            setVideoSearch(activeQuiz.topic);
                            setView('videos');
                          }}
                          className="flex items-center gap-3 p-3 bg-muted/50 hover:bg-muted border border-border rounded-xl transition-all group"
                        >
                          <div className="w-16 aspect-video rounded-lg overflow-hidden shrink-0">
                            <img src={video.thumbnail} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-bold text-foreground truncate group-hover:text-primary transition-colors">{video.title}</div>
                            <div className="text-[9px] text-muted-foreground uppercase font-mono">{video.category}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setView('chat')}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg"
                  >
                    {t.returnToChat}
                  </button>
                </motion.div>
              ) : (
                <div className="max-w-2xl w-full relative z-10">
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                      <span>{t.question} {currentQuestionIndex + 1} {t.of} {activeQuiz.questions.length}</span>
                      <span>{Math.round(((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100)}% {t.complete}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>

                  {/* Question Card */}
                  <motion.div 
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card border border-border p-8 rounded-3xl shadow-xl"
                  >
                    <h3 className="text-xl font-bold text-foreground mb-8 leading-tight">
                      {activeQuiz.questions[currentQuestionIndex].question}
                    </h3>

                    <div className="space-y-3">
                      {activeQuiz.questions[currentQuestionIndex].type === 'mcq' || activeQuiz.questions[currentQuestionIndex].type === 'tf' ? (
                        (activeQuiz.questions[currentQuestionIndex].options || (activeQuiz.questions[currentQuestionIndex].type === 'tf' ? ['True', 'False'] : [])).map((option) => {
                          const isSelected = selectedAnswer === option;
                          const isCorrect = option.toLowerCase() === activeQuiz.questions[currentQuestionIndex].answer.toLowerCase();
                          
                          return (
                            <button
                              key={option}
                              onClick={() => handleQuizAnswer(option)}
                              disabled={!!selectedAnswer}
                              className={cn(
                                "w-full p-4 rounded-2xl text-left text-sm font-medium transition-all border flex items-center justify-between group",
                                !selectedAnswer ? "bg-muted/50 border-border hover:border-primary/50 hover:bg-muted" :
                                isCorrect ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" :
                                isSelected ? "bg-destructive/10 border-destructive/50 text-destructive" :
                                "bg-muted/30 border-border opacity-50"
                              )}
                            >
                              <span>{option}</span>
                              {selectedAnswer && isCorrect && <CheckCircle2 className="w-4 h-4" />}
                              {selectedAnswer && isSelected && !isCorrect && <XCircle className="w-4 h-4" />}
                            </button>
                          );
                        })
                      ) : (
                        <div className="space-y-4">
                          <input 
                            type="text"
                            placeholder="Type your answer..."
                            disabled={!!selectedAnswer}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleQuizAnswer((e.target as HTMLInputElement).value);
                            }}
                            className="w-full bg-muted border border-border p-4 rounded-2xl outline-none focus:border-primary/50 transition-all"
                          />
                          {selectedAnswer && (
                            <div className={cn(
                              "p-4 rounded-2xl border text-sm",
                              selectedAnswer.toLowerCase() === activeQuiz.questions[currentQuestionIndex].answer.toLowerCase() 
                                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" 
                                : "bg-destructive/10 border-destructive/50 text-destructive"
                            )}>
                              Your answer: {selectedAnswer}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <AnimatePresence>
                      {showExplanation && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-8 pt-8 border-t border-border"
                        >
                          <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-2xl">
                            <Bot className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{t.insight}</div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {activeQuiz.questions[currentQuestionIndex].explanation}
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={nextQuestion}
                            className="w-full mt-6 bg-primary text-primary-foreground py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                          >
                            <span>{currentQuestionIndex === activeQuiz.questions.length - 1 ? t.finishQuiz : t.nextQuestion}</span>
                            <ChevronRight className={cn("w-4 h-4", language === 'ar' && "rotate-180")} />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Right Stats Panel */}
      <aside className="hidden xl:flex w-80 bg-card/40 backdrop-blur-md border-l border-border flex-col z-10">
        <div className="p-6 border-b border-border">
          <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Learning Progress</h3>
        </div>
        <div className="p-6 space-y-8 flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Core Proficiency</span>
              <span className="text-xs font-mono text-primary">{proficiency}%</span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${proficiency}%` }}
                className="bg-primary h-full"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2">
              <BarChart3 className="w-3 h-3" />
              Leaderboard
            </div>
            <div className="space-y-3">
              {[
                { name: 'Alex_ROS', score: 98, active: false },
                { name: 'You', score: proficiency, active: true },
                { name: 'BotMaster', score: 82, active: false },
                { name: 'CircuitWiz', score: 75, active: false }
              ].sort((a, b) => b.score - a.score).map((user, idx) => (
                <div 
                  key={user.name}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border transition-all",
                    user.active ? "bg-primary/10 border-primary/30" : "bg-muted/50 border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground">#{idx + 1}</span>
                    <span className={cn("text-xs font-medium", user.active ? "text-primary" : "text-foreground")}>{user.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-muted-foreground">{user.score}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Recent Certifications</div>
            <div className="space-y-2">
              {['Basic ROS2', 'Circuit Debugging'].map(cert => (
                <div key={cert} className="flex items-center gap-3 p-3 bg-muted border border-border rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[11px] text-foreground">{cert}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-border">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-primary" />
                <h4 className="text-[11px] font-bold text-primary uppercase">Next Milestone</h4>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">Complete the "Inverse Kinematics" module to unlock advanced manipulator control.</p>
              <button 
                onClick={() => setView('videos')}
                className="mt-3 flex items-center gap-2 text-[10px] font-bold text-primary hover:text-primary/90"
              >
                <span>Go to Module</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
