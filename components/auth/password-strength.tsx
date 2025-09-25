
import React from 'react';

interface PasswordStrengthProps {
  password?: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const getStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length > 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();

  const getColor = () => {
    switch (strength) {
      case 0:
        return 'bg-gray-500';
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-blue-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
      <div
        className={`h-full rounded-full ${getColor()}`}
        style={{ width: `${(strength / 4) * 100}%` }}
      />
    </div>
  );
};

export default PasswordStrength;
