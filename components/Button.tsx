import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'destructive';
}

export default function Button({ children, className, variant = 'default', ...props }: ButtonProps) {
  const baseClasses = "px-6 py-3 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    default: "bg-gradient-to-r from-blue-500 to-purple-600",
    destructive: "bg-gradient-to-r from-red-500 to-red-700",
  };

  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
