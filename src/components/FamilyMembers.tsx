import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, ChevronRight, CreditCard } from 'lucide-react';
import { mockFamilies } from '../data';

const FamilyMembers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const family = mockFamilies.find(f => f.id === id);

  if (!family) {
    return <div className="text-white">Family not found</div>;
  }

  const maskCardNumber = (cardNumber: string) => {
    const prefix = cardNumber.slice(0, 3);
    const suffix = cardNumber.slice(-3);
    return `${prefix}${'*'.repeat(cardNumber.length - 6)}${suffix}`;
  };

  return (
    <div className="max-w-2xl mx-auto glass-card rounded-xl overflow-hidden mt-10">
      <div className="p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 rounded-full">
            <Users className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Family Members</h2>
          <div className="flex items-center justify-center text-blue-300">
            <CreditCard className="w-5 h-5 mr-2" />
            <span>{maskCardNumber(family.cardNumber)}</span>
          </div>
        </div>

        <div className="space-y-4">
          {family.members.map(member => (
            <button
              key={member.id}
              onClick={() => navigate(`/stock/${family.id}/${member.id}`)}
              className="w-full member-card p-4 rounded-lg text-left hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-blue-300">{member.relation}</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-blue-300">{member.age} years</span>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-blue-400" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FamilyMembers;