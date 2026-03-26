import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Event {
    id: bigint;
    title: string;
    date: Time;
    description: string;
    department: string;
}
export type UserId = string;
export type Department = string;
export interface LeaveRequest {
    id: bigint;
    status: LeaveStatus;
    userId: UserId;
    toDate: Time;
    fromDate: Time;
    reason: string;
}
export interface Reminder {
    id: bigint;
    userId: UserId;
    text: string;
    dueDate: Time;
    priority: ReminderPriority;
}
export interface StudyMaterial {
    id: bigint;
    title: string;
    subject: string;
    link: string;
    timestamp: Time;
    department: Department;
    uploadedBy: UserId;
}
export interface Assignment {
    id: bigint;
    title: string;
    subject: string;
    createdBy: UserId;
    dueDate: Time;
    description: string;
    priority: AssignmentPriority;
    department: Department;
}
export interface AttendanceRecord {
    total: bigint;
    studentId: UserId;
    subject: string;
    present: bigint;
}
export interface UserProfile {
    id: UserId;
    isStaff: boolean;
    password: string;
    name: string;
    department?: Department;
}
export enum LeaveStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum ReminderPriority {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAssignment(title: string, subject: string, department: Department, dueDate: Time, description: string, createdBy: UserId, priority: AssignmentPriority): Promise<boolean>;
    addReminder(userId: UserId, text: string, priority: ReminderPriority, dueDate: Time): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    authenticateUser(userId: string, password: string): Promise<boolean>;
    createEvent(title: string, description: string, date: Time, department: string): Promise<boolean>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getAssignmentsByDepartment(department: Department): Promise<Array<Assignment>>;
    getAttendance(studentId: UserId): Promise<Array<AttendanceRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEventsByDepartment(department: string): Promise<Array<Event>>;
    getLeaveRequests(userId: UserId): Promise<Array<LeaveRequest>>;
    getMaterialsByDepartment(department: Department): Promise<Array<StudyMaterial>>;
    getReminders(userId: UserId): Promise<Array<Reminder>>;
    getUserProfile(userId: UserId): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerStaff(staffId: string, name: string, password: string): Promise<boolean>;
    registerStudent(registerNumber: string, name: string, dob: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitLeave(userId: UserId, fromDate: Time, toDate: Time, reason: string): Promise<boolean>;
    updateAttendance(studentId: UserId, subject: string, present: bigint, total: bigint): Promise<boolean>;
    updateLeaveStatus(leaveId: bigint, status: LeaveStatus): Promise<boolean>;
    updateLoginStreak(userId: UserId): Promise<bigint>;
    uploadMaterial(title: string, subject: string, department: Department, link: string, uploadedBy: UserId): Promise<boolean>;
}
