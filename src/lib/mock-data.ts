// lib/mock-data.ts

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface MetricCardData {
  id: string;
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface ActivityItem {
  id: string;
  title: string;
  category: string;
  timestamp: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

// 1. Mock Registered User Profile
export const mockUser: UserProfile = {
  id: "usr_01",
  firstName: "Alex",
  lastName: "Quaye",
  email: "alex.quaye@example.com",
  location: "Accra, Ghana",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  createdAt: "2026-01-15",
};

// 2. Mock Dashboard Metrics (KPI Cards)
export const mockMetrics: MetricCardData[] = [
  {
    id: "m1",
    label: "Total Projects",
    value: 12,
    change: "+2 this month",
    trend: "up",
  },
  {
    id: "m2",
    label: "Pending Reviews",
    value: 3,
    change: "Requires attention",
    trend: "neutral",
  },
  {
    id: "m3",
    label: "Completed Tasks",
    value: 48,
    change: "+14% from last week",
    trend: "up",
  },
];

// 3. Mock Recent Activity List
export const mockActivities: ActivityItem[] = [
  {
    id: "act_1",
    title: "Submitted project proposal draft",
    category: "Projects",
    timestamp: "2 hours ago",
    status: "In Progress",
  },
  {
    id: "act_2",
    title: "Updated profile location details",
    category: "Account",
    timestamp: "1 day ago",
    status: "Completed",
  },
  {
    id: "act_3",
    title: "Review feedback requested",
    category: "Review",
    timestamp: "3 days ago",
    status: "Pending",
  },
];