import React, { useState } from 'react';
import { History, Calendar, User, Package, Download, Search, Filter } from 'lucide-react';
import { mockTransactions } from '../data';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

const TransactionHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDate = !dateFilter || transaction.date === dateFilter;
    
    return matchesSearch && matchesDate;
  });

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(18);
    doc.text('Transaction History Report', 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy')}`, 20, 30);
    
    // Add transactions
    let yPos = 50;
    filteredTransactions.forEach((transaction, index) => {
      doc.text(`Transaction #${index + 1}`, 20, yPos);
      doc.text(`Member: ${transaction.memberName}`, 30, yPos + 10);
      doc.text(`Date: ${transaction.date}`, 30, yPos + 20);
      
      transaction.items.forEach((item, itemIndex) => {
        doc.text(`${item.name}: ${item.quantity}kg`, 40, yPos + 30 + (itemIndex * 10));
      });
      
      yPos += 60;
      
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
    });
    
    doc.save('transaction-history.pdf');
    toast.success('PDF downloaded successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto glass-card rounded-xl overflow-hidden mt-10">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full mr-4">
              <History className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Transaction History</h2>
          </div>
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Export PDF</span>
          </button>
        </div>

        <div className="mb-6 flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10 pr-4 py-2 rounded-lg"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input-field px-4 py-2 rounded-lg"
            />
            <Filter className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="space-y-4">
          {filteredTransactions.map(transaction => (
            <div
              key={transaction.id}
              className="transaction-card rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-lg font-semibold text-gray-800">{transaction.memberName}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{transaction.date}</span>
                </div>
              </div>
              <div className="space-y-2">
                {transaction.items.map((item, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <Package className="w-4 h-4 mr-2" />
                    <span>{item.name}: {item.quantity} kg</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;