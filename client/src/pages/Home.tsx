import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Calculator, Target, GraduationCap, TrendingUp, Rocket } from 'lucide-react';

const menuItems = [
  {
    title: "Internal Score",
    description: "Calculate Theory & Integrated marks",
    icon: Calculator,
    href: "/internal",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Target Sense",
    description: "Find required Model Exam marks",
    icon: Target,
    href: "/target",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "GPA Predictor",
    description: "Estimate GPA for current semester",
    icon: TrendingUp,
    href: "/gpa",
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "CGPA Calculator",
    description: "Calculate cumulative grade points",
    icon: GraduationCap,
    href: "/cgpa",
    color: "from-orange-500 to-red-500"
  },
  {
    title: "CGPA Booster",
    description: "Plan required GPA for target CGPA",
    icon: Rocket,
    href: "/booster",
    color: "from-pink-500 to-rose-500"
  }
];

export const Home = () => {
  return (
    <div className="space-y-8 pt-8 pb-12">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
          Welcome to Markify
        </h1>
        <p className="text-muted-foreground">All your academic calculations in one place</p>
      </div>

      <div className="grid gap-4">
        {menuItems.map((item, index) => (
          <Link key={item.href} href={item.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer relative overflow-hidden p-6 rounded-2xl glass-card hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              <div className="relative z-10 flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};
