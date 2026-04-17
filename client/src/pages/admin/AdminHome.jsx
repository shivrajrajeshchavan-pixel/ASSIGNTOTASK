import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, ClipboardList, Clock } from 'lucide-react';
import { getDashboardStats } from '../../api/adminApi';

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-gray-600">Loading metrics...</div>;

  const cards = [
    { title: 'Total Teachers', value: stats?.totalTeachers || 0, icon: <Users size={24} className="text-admin" />, bg: 'bg-blue-100' },
    { title: 'Total Students', value: stats?.totalStudents || 0, icon: <GraduationCap size={24} className="text-student" />, bg: 'bg-purple-100' },
    { title: 'Total Tasks Assigned', value: stats?.totalAssignments || 0, icon: <ClipboardList size={24} className="text-teacher" />, bg: 'bg-green-100' },
    { title: 'Pending Reviews', value: stats?.pendingReviews || 0, icon: <Clock size={24} className="text-orange-500" />, bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Overview Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="glass-panel card-hover p-6 flex items-center space-x-4 border-l-4 border-admin">
            <div className={`p-3 rounded-full ${card.bg}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
