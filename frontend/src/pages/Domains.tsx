import { Clock, Zap, ChevronRight, ChevronLeft, CheckCircle2, Target as TargetIcon, Database, BarChart3, Layout, Settings, Rocket, Award, Lock, Search, Map, Palette, Smartphone, Play } from 'lucide-react';

interface AssessmentItem {
  day: number;
  category: string;
  title: string;
  description: string;
  dataset?: string;
  scenario?: string;
  task?: string;
  submission?: string;
  icon?: React.ReactNode;
}

export const defaultAssessmentContent: AssessmentItem[] = [
  {
    day: 1,
    category: "Product & UX",
    title: "User Experience Analysis",
    description: "Analyze the current onboarding flow of our platform. Describe three specific improvements you would make to reduce cognitive load for first-time users."
  },
  {
    day: 2,
    category: "Software Engineering",
    title: "System Design Challenge",
    description: "Design a scalable notification system that handles millions of messages across email, SMS, and push notifications. Explain your choice of message broker and database."
  },
  {
    day: 3,
    category: "Data Analysis",
    title: "Metrics & KPIs",
    description: "A recently launched feature saw a 20% drop in user retention after week 1. Identify five metrics you would investigate to find the root cause and propose a hypothesis."
  },
  {
    day: 4,
    category: "Industry Strategy",
    title: "Market Positioning",
    description: "Assess the competitive landscape for JobSim. How would you differentiate our platform from traditional career boards to appeal to Gen Z job seekers?"
  },
  {
    day: 5,
    category: "Frontend Dev",
    title: "Performance Optimization",
    description: "Our main dashboard is taking 6 seconds to load interactive elements. List five optimization techniques (e.g., code splitting, memoization) you would implement and why."
  },
  {
    day: 6,
    category: "Interpersonal Skills",
    title: "Conflict Resolution",
    description: "You're in a sprint planning meeting where the lead developer and the product owner disagree on priority. Draft a communication plan to reach a consensus."
  },
  {
    day: 7,
    category: "Final Review",
    title: "Career Readiness Pitch",
    description: "Synthesize your learnings from the past six days into a 2-minute pitch for why your identified career path is the right fit for your current skill set."
  }
];


export const dataScientistContent: AssessmentItem[] = [
  {
    day: 1,
    category: "Data Analysis",
    title: "Day 1: The Data Detective",
    dataset: "Airline Passenger Satisfaction (Kaggle)",
    scenario: "Imagine you joined SkyHigh Airlines. The management is worried about falling ratings.",
    task: "Download the dataset and analyze the relationship between 'Inflight Entertainment' and 'Overall Satisfaction'.",
    submission: "List the top 3 features that correlate most with a 'Satisfied' customer. Explain your logic in 4-5 sentences.",
    description: "Identify key satisfaction drivers for an airline through correlation analysis.",
    icon: <TargetIcon className="w-6 h-6 text-indigo-600" />
  },
  {
    day: 2,
    category: "Data Cleaning",
    title: "Day 2: Cleaning the Mess",
    dataset: "Medical Cost Personal Datasets (Kaggle)",
    scenario: "HealthGuard Insurance has a messy database. Some BMI values are missing, and smokers' data is inconsistent.",
    task: "Explain how you will handle missing values in the 'bmi' column. Will you use Mean, Median, or Mode?",
    submission: "Provide the Python logic/strategy to detect and remove outliers from the 'charges' column so the company doesn't lose money on skewed data.",
    description: "Handle missing data and outliers in health insurance records.",
    icon: <Settings className="w-6 h-6 text-emerald-600" />
  },
  {
    day: 3,
    category: "Data Visualization",
    title: "Day 3: The Visual Storyteller",
    dataset: "Superstore Sales Dataset (Kaggle)",
    scenario: "The CEO of RetailPulse wants a visual report of the 'South Region' performance.",
    task: "Decide which plot is best to show the sales trend of the 'Technology' category over the last 2 years.",
    submission: "Describe the X-axis, Y-axis, and the type of chart (Line/Bar/Scatter) you would use. Explain why this chart is the best choice for a non-technical CEO.",
    description: "Create impactful visualizations for executive decision making.",
    icon: <BarChart3 className="w-6 h-6 text-rose-600" />
  },
  {
    day: 4,
    category: "Feature Engineering",
    title: "Day 4: Feature Architect",
    dataset: "NYC Taxi Trip Duration (Kaggle)",
    scenario: "CityCab AI needs better predictions. The raw 'pickup_datetime' isn't enough to predict traffic.",
    task: "Create 3 new features from the timestamp that could impact trip duration.",
    submission: "Explain the logic for these 3 features (e.g., peak hours, weekend vs weekday). Describe how these features help a machine learning model understand traffic patterns.",
    description: "Engineer new temporal features to improve taxi trip duration predictions.",
    icon: <Layout className="w-6 h-6 text-amber-600" />
  },
  {
    day: 5,
    category: "Machine Learning",
    title: "Day 5: The Model Builder",
    dataset: "Loan Prediction Dataset (Kaggle)",
    scenario: "EasyLoan Bank wants to automate loan approvals.",
    task: "This is a classification problem. Choose between Logistic Regression and Random Forest.",
    submission: "Justify your choice of algorithm. Explain what 'Train-Test Split' ratio you would use (e.g., 80/20) and why it's important to keep some data hidden from the model during training.",
    description: "Build and justify a classification model for financial risk assessment.",
    icon: <Database className="w-6 h-6 text-blue-600" />
  },
  {
    day: 6,
    category: "Model Tuning",
    title: "Day 6: Tuning the Engine",
    dataset: "House Prices - Advanced Regression (Kaggle)",
    scenario: "RealEstate Pro's current model is underperforming. They need high accuracy for high-stakes property deals.",
    task: "Use 'Hyperparameter Tuning' to improve the model.",
    submission: "Explain the concept of 'GridSearchCV'. Pick 3 parameters of your chosen model and describe how you would find their optimal values to boost accuracy.",
    description: "Optimize regression models for high-stakes real estate valuation.",
    icon: <Rocket className="w-6 h-6 text-purple-600" />
  },
  {
    day: 7,
    category: "Capstone",
    title: "Day 7: The CEO Presentation",
    scenario: "Combine your learnings from the past 6 days.",
    task: "You need to present a complete Data Science Pipeline to the Board of Directors.",
    description: "Present a comprehensive data science project lifecycle to stakeholders.",
    icon: <Award className="w-6 h-6 text-indigo-600" />
  }
];


export const webDeveloperContent: AssessmentItem[] = [
  {
    day: 1,
    category: "Layout Mastery",
    title: "Day 1: Layout Mastery",
    scenario: "FitTrack Gym needs a professional landing page. The first impression is the most important.",
    task: "Design a navigation bar and a Hero Section. Everything must be perfectly centered on the screen.",
    submission: "Explain which CSS properties you would use to center a div both horizontally and vertically. Provide the logic for Flexbox vs. CSS Grid.",
    description: "Design a centered navigation bar and hero section for FitTrack Gym.",
    icon: <Layout className="w-6 h-6 text-indigo-600" />
  },
  {
    day: 2,
    category: "Mobile-First",
    title: "Day 2: The Mobile-First Challenge",
    scenario: "90% of FoodieExpress users order from mobile phones, but the current menu card layout is breaking on small screens.",
    task: "Make the menu card layout responsive without breaking the design.",
    submission: "Explain the concept of 'Media Queries'. How do you change a 3-column layout to a 1-column layout for screens smaller than 768px?",
    description: "Create a responsive menu card layout for FoodieExpress.",
    icon: <Settings className="w-6 h-6 text-emerald-600" />
  },
  {
    day: 3,
    category: "Interactions",
    title: "Day 3: Dynamic Interactions",
    scenario: "Users want a 'Dark Mode' feature for better productivity at night.",
    task: "Implement a toggle button that changes the entire website's background and text color when clicked.",
    submission: "How do you use JavaScript's addEventListener to manipulate the DOM? Explain how you would store the user's theme preference.",
    description: "Implement a dark mode toggle and theme persistence.",
    icon: <Zap className="w-6 h-6 text-rose-600" />
  },
  {
    day: 4,
    category: "API Integration",
    title: "Day 4: API Integration",
    scenario: "CryptoTracker needs to show live Bitcoin prices to users using a third-party public API.",
    task: "Fetch real-time data from an API and display it on a clean dashboard.",
    submission: "Describe how fetch(), async, and await work together. How do you handle cases where the API fails to return data (Error Handling)?",
    description: "Fetch and display real-time crypto data.",
    icon: <Database className="w-6 h-6 text-amber-600" />
  },
  {
    day: 5,
    category: "Validation",
    title: "Day 5: Secure Data Entry",
    scenario: "SecureBank is facing issues with users entering invalid email addresses and weak passwords.",
    task: "Create a robust form validation system for the login page.",
    submission: "Explain the use of 'Regex' (Regular Expressions) for email validation. List two security checks you must perform before allowing the form to submit.",
    description: "Build a form validation system with security checks.",
    icon: <Lock className="w-6 h-6 text-blue-600" />
  },
  {
    day: 6,
    category: "Components",
    title: "Day 6: Scalable Components",
    scenario: "ShopZilla is expanding. They have 100+ products and need a way to display them without writing repetitive code.",
    task: "Design a reusable 'Product Card' component using a modern framework like React.",
    submission: "Explain the difference between 'Props' and 'State'. How do you pass data dynamically to a single component to render different products?",
    description: "Design a reusable product card component in React.",
    icon: <Layout className="w-6 h-6 text-purple-600" />
  },
  {
    day: 7,
    category: "Performance",
    title: "Day 7: Performance & Launch",
    scenario: "It is launch day! You need to optimize the website so it loads in under 2 seconds.",
    task: "Optimize images, minify code, and prepare the site for production deployment.",
    submission: "List three strategies to improve website loading speed. Which platform (Vercel/Netlify/GitHub Pages) will you choose for deployment and why?",
    description: "Optimize and prepare a website for production launch.",
    icon: <Rocket className="w-6 h-6 text-indigo-600" />
  }
];


export const uiuxDesignerContent: AssessmentItem[] = [
  {
    day: 1,
    category: "User Research",
    title: "Day 1: Empathy & Problem Research",
    scenario: "PetAdopt is an app for pet adoption. Users are complaining that the onboarding process is too long, confusing, and they are giving up halfway.",
    task: "Create a plan to understand this problem using 'User Research'.",
    submission: "List 3 specific questions you would ask users during an interview. Explain why creating a 'User Persona' is essential for this project.",
    description: "Plan user research to identify friction in PetAdopt's onboarding.",
    icon: <Search className="w-6 h-6 text-indigo-600" />
  },
  {
    day: 2,
    category: "User Flow",
    title: "Day 2: Mapping the Journey",
    scenario: "QuickCart wants its users to complete the checkout process within 3 clicks after adding items to the cart.",
    task: "Design the step-by-step user journey from login to 'Order Success'.",
    submission: "Describe the 'User Flow Diagram' steps. Explain how identifying 'Pain Points' in this journey helps improve the final design.",
    description: "Design a 3-click checkout journey for QuickCart.",
    icon: <Map className="w-6 h-6 text-emerald-600" />
  },
  {
    day: 3,
    category: "Wireframing",
    title: "Day 3: Skeleton of Design",
    scenario: "StudyBuddy is a student portal. They need a dashboard layout that helps students track their courses and progress.",
    task: "Create a structure (Wireframe) for the dashboard, focusing only on layout without colors or images.",
    submission: "Explain the benefits of 'Low-Fidelity Wireframes'. List 4 essential elements (e.g., Profile, Progress Bar) that must be on the dashboard and justify their placement.",
    description: "Create a low-fidelity wireframe for the StudyBuddy dashboard.",
    icon: <Layout className="w-6 h-6 text-rose-600" />
  },
  {
    day: 4,
    category: "Visual Identity",
    title: "Day 4: Visual Hierarchy & Colors",
    scenario: "LuxeStay is a premium hotel booking app, but their current design feels 'cheap' and dated.",
    task: "Decide on visual design elements that reflect a 'Premium' brand identity.",
    submission: "What 'Color Palette' and 'Typography' (font style) will you choose? Explain how you will use 'Negative Space' to create a clean, high-end feel.",
    description: "Define a premium visual identity for LuxeStay.",
    icon: <Palette className="w-6 h-6 text-amber-600" />
  },
  {
    day: 5,
    category: "UI Design",
    title: "Day 5: High-Fidelity UI",
    scenario: "CryptoWallet app needs a 'Send Money' screen that builds trust and is easy for first-time users.",
    task: "Design the logic and final look (mockup) of this screen.",
    submission: "How will you use 'Visual Hierarchy' to highlight the 'Confirm Transaction' button? What role do icons and shadows play in your design to guide the user?",
    description: "Design a high-fidelity 'Send Money' screen for CryptoWallet.",
    icon: <Smartphone className="w-6 h-6 text-blue-600" />
  },
  {
    day: 6,
    category: "Prototyping",
    title: "Day 6: Interactive Prototypes",
    scenario: "FoodMood delivery wants their app to feel 'Real' and responsive before going into development.",
    task: "Plan the screen transitions and animations (Micro-interactions) for the checkout flow.",
    submission: "Describe how you would use 'Smart Animate' or 'Transitions' (in tools like Figma) to make the user experience smooth. List 2 specific micro-interactions that would enhance the user experience (UX).",
    description: "Design interative transitions and micro-interactions for FoodMood.",
    icon: <Play className="w-6 h-6 text-purple-600" />
  },
  {
    day: 7,
    category: "Case Study",
    title: "Day 7: The Final Case Study",
    scenario: "It is time to present your work. You need to convert your 6 days of effort into a convincing professional portfolio piece.",
    task: "Explain the entire journey from the initial problem statement to the final design solution.",
    submission: "List 5 main headings for a professional UX Case Study. How would you incorporate user feedback from 'Usability Testing' into your final presentation?",
    description: "Consolidate your UX work into a professional portfolio case study.",
    icon: <Award className="w-6 h-6 text-indigo-600" />
  }
];


