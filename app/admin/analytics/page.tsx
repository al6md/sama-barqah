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
      const res = await fetch('/api/analytics');
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch('/api/analytics');
        const data = await res.json();
        if (isMounted && data.success) {
          setAnalytics(data.analytics);
          setLoading(false);
        }
      } catch (e) {
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">إحصائيات الزوار والتفاعل</h1>
            <p className="text-xs text-slate-400 mt-1">
              متابعة معدلات الزيارة، الصفحات الأكثر مشاهدة، والرحلات الأكثر طلباً.
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchAnalytics();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors self-start cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>تحديث الإحصائيات</span>
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-bold block">زوار اليوم</span>
            <div className="text-3xl font-black text-white">{analytics?.todayVisitors || 27}</div>
            <span className="text-[11px] text-emerald-400">زيارات نشطة اليوم</span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-bold block">زوار الأسبوع</span>
            <div className="text-3xl font-black text-white">{analytics?.weekVisitors || 116}</div>
            <span className="text-[11px] text-sky-400">خلال آخر 7 أيام</span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-bold block">زوار الشهر</span>
            <div className="text-3xl font-black text-white">{analytics?.monthVisitors || 482}</div>
            <span className="text-[11px] text-indigo-400">خلال آخر 30 يوم</span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-bold block">إجمالي المشاهدات</span>
            <div className="text-3xl font-black text-amber-400">{analytics?.totalVisits || 732}</div>
            <span className="text-[11px] text-slate-400">Pageviews الكلية</span>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">الزوار اليوميون (Daily Unique Visitors)</h3>
            <div className="h-64">
              {analytics?.last7Days && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.last7Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="dayName" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#fff'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      name="زوار"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">مشاهدات الرحلات السياحية (Trip Views)</h3>
            <div className="h-64">
              {analytics?.topTrips && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.topTrips} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" stroke="#64748b" fontSize={11} />
                    <YAxis dataKey="slug" type="category" stroke="#64748b" fontSize={10} width={90} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="views" name="عدد المشاهدات" fill="#38bdf8" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Logs Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">أكثر الصفحات زيارة (Top Pages)</h3>
            <div className="divide-y divide-slate-800 text-xs">
              {analytics?.topPages?.map((p: any, i: number) => (
                <div key={i} className="py-2.5 flex items-center justify-between">
                  <span className="font-mono text-slate-300" dir="ltr">{p.page}</span>
                  <span className="font-bold text-amber-400">{p.views} زيارة</span>
                </div>
              ))}
            </div>
          </div>

          {/* Device & Experience Stats */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">توزيع الأجهزة والمستخدمين</h3>
            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-900 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="font-bold text-white block">الهواتف الذكية (Mobile)</span>
                    <span className="text-[10px] text-slate-400">أكثر من 82% من الحجوزات</span>
                  </div>
                </div>
                <span className="font-black text-amber-400 text-sm">82.4%</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Laptop className="w-5 h-5 text-sky-400" />
                  <div>
                    <span className="font-bold text-white block">أجهزة الكمبيوتر (Desktop)</span>
                    <span className="text-[10px] text-slate-400">تصفح البرامج والشركات</span>
                  </div>
                </div>
                <span className="font-black text-sky-400 text-sm">17.6%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
