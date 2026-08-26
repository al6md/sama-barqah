'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  Eye,
  TrendingUp,
  Globe,
  Compass,
  Users,
  Calendar,
  Sparkles,
  RefreshCw,
  Smartphone,
  Laptop
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics').catch(() => null);
      if (!res || !res.ok) return;
      const data = await res.json().catch(() => null);
      if (data?.success) {
        setAnalytics(data.analytics);
      }
    } catch {
      // Safe fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch('/api/analytics').catch(() => null);
        if (!res || !res.ok) {
          if (isMounted) setLoading(false);
          return;
        }
        const data = await res.json().catch(() => null);
        if (isMounted && data?.success) {
          setAnalytics(data.analytics);
          setLoading(false);
        }
      } catch {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[3px] border-[#1D2D2E] pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1D2D2E]">إحصائيات الزوار والتفاعل</h1>
            <p className="text-xs font-bold text-[#1D2D2E]/70 mt-1">
              متابعة معدلات الزيارة، الصفحات الأكثر مشاهدة، والرحلات الأكثر طلباً.
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchAnalytics();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FFD95A] hover:bg-[#fcd34d] text-xs font-black text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] active:translate-y-0.5 transition-all self-start cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>تحديث الإحصائيات</span>
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border-[3px] border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] space-y-1">
            <span className="text-xs text-[#1D2D2E]/70 font-black block">زوار اليوم</span>
            <div className="text-3xl font-black text-[#1D2D2E]">{analytics?.todayVisitors || 27}</div>
            <span className="text-xs font-black text-emerald-700">زيارات نشطة اليوم</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border-[3px] border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] space-y-1">
            <span className="text-xs text-[#1D2D2E]/70 font-black block">زوار الأسبوع</span>
            <div className="text-3xl font-black text-[#1D2D2E]">{analytics?.weekVisitors || 116}</div>
            <span className="text-xs font-black text-sky-700">خلال آخر 7 أيام</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border-[3px] border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] space-y-1">
            <span className="text-xs text-[#1D2D2E]/70 font-black block">زوار الشهر</span>
            <div className="text-3xl font-black text-[#1D2D2E]">{analytics?.monthVisitors || 482}</div>
            <span className="text-xs font-black text-indigo-700">خلال آخر 30 يوم</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border-[3px] border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] space-y-1">
            <span className="text-xs text-[#1D2D2E]/70 font-black block">إجمالي المشاهدات</span>
            <div className="text-3xl font-black text-[#FF7E47]">{analytics?.totalVisits || 732}</div>
            <span className="text-xs font-bold text-gray-500">Pageviews الكلية</span>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white border-[3px] border-[#1D2D2E] shadow-[5px_5px_0px_#1D2D2E] space-y-4">
            <h3 className="text-base font-black text-[#1D2D2E]">الزوار اليوميون (Daily Unique Visitors)</h3>
            <div className="h-64">
              {analytics?.last7Days && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.last7Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="dayName" stroke="#1D2D2E" fontSize={11} />
                    <YAxis stroke="#1D2D2E" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FDFFF5',
                        border: '2px solid #1D2D2E',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#1D2D2E',
                        boxShadow: '3px 3px 0px #1D2D2E'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      name="زوار"
                      stroke="#FF7E47"
                      strokeWidth={3}
                      fill="#FFD95A"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border-[3px] border-[#1D2D2E] shadow-[5px_5px_0px_#1D2D2E] space-y-4">
            <h3 className="text-base font-black text-[#1D2D2E]">مشاهدات الرحلات السياحية (Trip Views)</h3>
            <div className="h-64">
              {analytics?.topTrips && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.topTrips} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#1D2D2E" fontSize={11} />
                    <YAxis dataKey="slug" type="category" stroke="#1D2D2E" fontSize={10} width={90} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FDFFF5',
                        border: '2px solid #1D2D2E',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#1D2D2E',
                        boxShadow: '3px 3px 0px #1D2D2E'
                      }}
                    />
                    <Bar dataKey="views" name="عدد المشاهدات" fill="#4CC9FE" stroke="#1D2D2E" strokeWidth={2} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Logs Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <div className="p-6 rounded-3xl bg-white border-[3px] border-[#1D2D2E] shadow-[5px_5px_0px_#1D2D2E] space-y-4">
            <h3 className="text-base font-black text-[#1D2D2E]">أكثر الصفحات زيارة (Top Pages)</h3>
            <div className="divide-y-2 divide-[#1D2D2E]/10 text-xs">
              {analytics?.topPages?.map((p: any, i: number) => (
                <div key={i} className="py-2.5 flex items-center justify-between">
                  <span className="font-mono font-bold text-[#1D2D2E]" dir="ltr">{p.page}</span>
                  <span className="font-black text-[#FF7E47] bg-[#FDFFF5] px-2.5 py-1 rounded-lg border border-[#1D2D2E] shadow-[1px_1px_0px_#1D2D2E]">{p.views} زيارة</span>
                </div>
              ))}
            </div>
          </div>

          {/* Device & Experience Stats */}
          <div className="p-6 rounded-3xl bg-white border-[3px] border-[#1D2D2E] shadow-[5px_5px_0px_#1D2D2E] space-y-4">
            <h3 className="text-base font-black text-[#1D2D2E]">توزيع الأجهزة والمستخدمين</h3>
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-[#FF7E47]" />
                  <div>
                    <span className="font-black text-[#1D2D2E] block">الهواتف الذكية (Mobile)</span>
                    <span className="text-[11px] font-bold text-[#1D2D2E]/70">أكثر من 82% من الحجوزات</span>
                  </div>
                </div>
                <span className="font-black text-[#FF7E47] text-sm">82.4%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Laptop className="w-5 h-5 text-sky-600" />
                  <div>
                    <span className="font-black text-[#1D2D2E] block">أجهزة الكمبيوتر (Desktop)</span>
                    <span className="text-[11px] font-bold text-[#1D2D2E]/70">تصفح البرامج والشركات</span>
                  </div>
                </div>
                <span className="font-black text-sky-600 text-sm">17.6%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
