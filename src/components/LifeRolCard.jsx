// LifeRolCard.jsx
import React from 'react';

const LifeRolCard = ({ key, title, longTermGoal, shortTermGoal, satisfaction }) => {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto max-h-fit h-60">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
          <div
            className="bg-blue-500 h-4 rounded-full"
            style={{ width: `${satisfaction}%` }}
          ></div>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-1">Meta a largo plazo:</h3>
        <p className="text-gray-300">{longTermGoal}</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-1">Meta a corto plazo:</h3>
        <p className="text-gray-300">{shortTermGoal}</p>
      </div>
    </div>
  );
};

export default LifeRolCard;
