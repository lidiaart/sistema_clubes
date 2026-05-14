export interface User {
  id: number;
  email: string;
  name: string;
  created_at: Date;
}

export interface Role {
  id: number;
  name: 'admin_system' | 'admin_club' | 'user';
}

export interface UserRole {
  id: number;
  user_id: number;
  role_id: number;
  club_id?: number;
  assigned_at: Date;
}

export interface RequestAdminClub {
  id: number;
  user_id: number;
  club_id: number;
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  attempts: number;
  last_attempt: Date;
  created_at: Date;
}

export interface RequestJoinClub {
  id: number;
  user_id: number;
  club_id: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: Date;
}

export interface Club {
  id: number;
  name: string;
  category: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  club_id: number;
  event_date: Date;
  location: string;
  max_participants?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  club_id: number;
  joined_at: Date;
}