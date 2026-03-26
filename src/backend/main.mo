import Time "mo:core/Time";
import List "mo:core/List";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Access control state initialization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types and comparison modules
  type Department = Text;
  type UserId = Text;
  type UserProfile = {
    id : UserId;
    name : Text;
    password : Text;
    department : ?Department;
    isStaff : Bool;
  };

  module UserProfile {
    public func compare(u1 : UserProfile, u2 : UserProfile) : Order.Order {
      Text.compare(u1.id, u2.id);
    };
  };

  type StudyMaterial = {
    id : Nat;
    title : Text;
    subject : Text;
    department : Department;
    link : Text;
    uploadedBy : UserId;
    timestamp : Time.Time;
  };

  module StudyMaterial {
    public func compare(m1 : StudyMaterial, m2 : StudyMaterial) : Order.Order {
      Int.compare(m1.id, m2.id);
    };
  };

  type AssignmentPriority = {
    #high;
    #medium;
    #low;
  };

  type Assignment = {
    id : Nat;
    title : Text;
    subject : Text;
    department : Department;
    dueDate : Time.Time;
    description : Text;
    createdBy : UserId;
    priority : AssignmentPriority;
  };

  module Assignment {
    public func compare(a1 : Assignment, a2 : Assignment) : Order.Order {
      Int.compare(a1.id, a2.id);
    };
  };

  type AttendanceRecord = {
    studentId : UserId;
    subject : Text;
    present : Nat;
    total : Nat;
  };

  module AttendanceRecord {
    public func compare(r1 : AttendanceRecord, r2 : AttendanceRecord) : Order.Order {
      Text.compare(r1.studentId, r2.studentId);
    };
  };

  type LeaveStatus = {
    #pending;
    #approved;
    #rejected;
  };

  type LeaveRequest = {
    id : Nat;
    userId : UserId;
    fromDate : Time.Time;
    toDate : Time.Time;
    reason : Text;
    status : LeaveStatus;
  };

  module LeaveRequest {
    public func compare(l1 : LeaveRequest, l2 : LeaveRequest) : Order.Order {
      Int.compare(l1.id, l2.id);
    };
  };

  type Event = {
    id : Nat;
    title : Text;
    description : Text;
    date : Time.Time;
    department : Text;
  };

  module Event {
    public func compare(e1 : Event, e2 : Event) : Order.Order {
      Int.compare(e1.id, e2.id);
    };
  };

  type ReminderPriority = {
    #high;
    #medium;
    #low;
  };

  type Reminder = {
    id : Nat;
    userId : UserId;
    text : Text;
    priority : ReminderPriority;
    dueDate : Time.Time;
  };

  module Reminder {
    public func compare(r1 : Reminder, r2 : Reminder) : Order.Order {
      Int.compare(r1.id, r2.id);
    };
  };

  type LoginStreak = {
    userId : UserId;
    currentStreak : Nat;
    lastLogin : Time.Time;
  };

  module LoginStreak {
    public func compare(s1 : LoginStreak, s2 : LoginStreak) : Order.Order {
      Text.compare(s1.userId, s2.userId);
    };
  };

  // Data storage
  let users = Map.empty<UserId, UserProfile>();
  let userPrincipalMap = Map.empty<Principal, UserId>();
  let studyMaterials = Map.empty<Nat, StudyMaterial>();
  let assignments = Map.empty<Nat, Assignment>();
  let attendanceRecords = Map.empty<UserId, AttendanceRecord>();
  let leaveRequests = Map.empty<Nat, LeaveRequest>();
  let events = Map.empty<Nat, Event>();
  let reminders = Map.empty<Nat, Reminder>();
  let loginStreaks = Map.empty<UserId, LoginStreak>();

  var nextMaterialId = 0;
  var nextAssignmentId = 0;
  var nextLeaveId = 0;
  var nextEventId = 0;
  var nextReminderId = 0;

  // Utility functions
  func getDepartmentFromRegisterNumber(registerNumber : Text) : ?Department {
    if (registerNumber.size() < 4) { return null };
    if (registerNumber.startsWith(#text "ITR")) { return ?"IT" };
    if (registerNumber.startsWith(#text "CSR")) { return ?"CSE" };
    if (registerNumber.startsWith(#text "ECR")) { return ?"ECE" };
    if (registerNumber.startsWith(#text "MECHR")) { return ?"MECH" };
    if (registerNumber.startsWith(#text "CIVR")) { return ?"CIVIL" };
    if (registerNumber.startsWith(#text "EEER")) { return ?"EEE" };
    if (registerNumber.startsWith(#text "MBAR")) { return ?"MBA" };
    if (registerNumber.startsWith(#text "MCAR")) { return ?"MCA" };
    null;
  };

  func getUserIdFromPrincipal(principal : Principal) : ?UserId {
    userPrincipalMap.get(principal);
  };

  func isStaffUser(userId : UserId) : Bool {
    switch (users.get(userId)) {
      case (null) { false };
      case (?user) { user.isStaff };
    };
  };

  // Required profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    switch (getUserIdFromPrincipal(caller)) {
      case (null) { null };
      case (?userId) { users.get(userId) };
    };
  };

  public query ({ caller }) func getUserProfile(userId : UserId) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    let callerUserId = switch (getUserIdFromPrincipal(caller)) {
      case (null) { Runtime.trap("Caller not registered") };
      case (?id) { id };
    };
    // Users can view their own profile or admins can view any profile
    if (callerUserId != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    users.get(userId);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let callerUserId = switch (getUserIdFromPrincipal(caller)) {
      case (null) { Runtime.trap("Caller not registered") };
      case (?id) { id };
    };
    // Users can only update their own profile
    if (callerUserId != profile.id) {
      Runtime.trap("Unauthorized: Can only update your own profile");
    };
    users.add(profile.id, profile);
  };

  // User management
  public shared ({ caller }) func registerStudent(registerNumber : Text, name : Text, dob : Text) : async Bool {
    // Admin-only registration to prevent unauthorized accounts
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can register students");
    };
    let department = switch (getDepartmentFromRegisterNumber(registerNumber)) {
      case (null) { Runtime.trap("Invalid register number prefix. ") };
      case (?dep) { dep };
    };
    let user : UserProfile = {
      id = registerNumber;
      name;
      password = dob;
      department = ?department;
      isStaff = false;
    };
    users.add(registerNumber, user);
    true;
  };

  public shared ({ caller }) func registerStaff(staffId : Text, name : Text, password : Text) : async Bool {
    // Admin-only registration to prevent unauthorized accounts
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can register staff");
    };
    let user : UserProfile = {
      id = staffId;
      name;
      password;
      department = null;
      isStaff = true;
    };
    users.add(staffId, user);
    true;
  };

  public shared ({ caller }) func authenticateUser(userId : Text, password : Text) : async Bool {
    // Authentication is public but links principal to userId
    switch (users.get(userId)) {
      case (null) { false };
      case (?user) { 
        if (user.password == password) {
          userPrincipalMap.add(caller, userId);
          true;
        } else {
          false;
        };
      };
    };
  };

  // Study Materials
  public shared ({ caller }) func uploadMaterial(title : Text, subject : Text, department : Department, link : Text, uploadedBy : UserId) : async Bool {
    // Only authenticated users (staff) can upload materials
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can upload materials");
    };
    let callerUserId = switch (getUserIdFromPrincipal(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (?id) { id };
    };
    // Verify the uploader is staff
    if (not isStaffUser(callerUserId)) {
      Runtime.trap("Unauthorized: Only staff can upload materials");
    };
    // Verify uploadedBy matches caller
    if (callerUserId != uploadedBy) {
      Runtime.trap("Unauthorized: Can only upload materials as yourself");
    };
    let material : StudyMaterial = {
      id = nextMaterialId;
      title;
      subject;
      department;
      link;
      uploadedBy;
      timestamp = Time.now();
    };
    nextMaterialId += 1;
    studyMaterials.add(material.id, material);
    true;
  };

  public query ({ caller }) func getMaterialsByDepartment(department : Department) : async [StudyMaterial] {
    // Only authenticated users can view materials
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view materials");
    };
    let callerUserId = switch (getUserIdFromPrincipal(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (?id) { id };
    };
    // Students can only view materials for their department
    switch (users.get(callerUserId)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) {
        if (not user.isStaff) {
          // Student - check department match
          switch (user.department) {
            case (null) { Runtime.trap("Student has no department") };
            case (?userDept) {
              if (userDept != department) {
                Runtime.trap("Unauthorized: Can only view materials for your department");
              };
            };
          };
        };
        // Staff can view all departments
      };
    };
    studyMaterials.values().toArray().filter(func(mat : StudyMaterial) : Bool { mat.department == department }).sort();
  };

  // Assignments
  public shared ({ caller }) func addAssignment(title : Text, subject : Text, department : Department, dueDate : Time.Time, description : Text, createdBy : UserId, priority : AssignmentPriority) : async Bool {
    // Only staff can create assignments
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create assignments");
    };
    let callerUserId = switch (getUserIdFromPrincipal(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (?id) { id };
    };
    if (not isStaffUser(callerUserId)) {
      Runtime.trap("Unauthorized: Only staff can create assignments");
    };
    if (callerUserId != createdBy) {
      Runtime.trap("Unauthorized: Can only create assignments as yourself");
    };
    let assignment : Assignment = {
      id = nextAssignmentId;
      title;
      subject;
      department;
      dueDate;
      description;
      createdBy;
      priority;
    };
    nextAssignmentId += 1;
    assignments.add(assignment.id, assignment);
    true;
  };

  public query ({ caller }) func getAssignmentsByDepartment(department : Department) : async [Assignment] {
    // Only authenticated users can view assignments
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view assignments");
    };
    let callerUserId = switch (getUserIdFromPrincipal(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (?id) { id };
    };
    // Students can only view assignments for their department
    switch (users.get(callerUserId)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) {
        if (not user.isStaff) {
          switch (user.department) {
            case (null) { Runtime.trap("Student has no department") };
            case (?userDept) {
              if (userDept != department) {
                Runtime.trap("Unauthorized: Can only view assignments for your department");
              };
            };
          };
        };
      };
    };
    assignments.values().toArray().filter(func(a : Assignment) : Bool { a.department == department }).sort();
  };

  // Attendance
  public shared ({ caller }) func updateAttendance(studentId : UserId, subject : Text, present : Nat, total : Nat) : async Bool {
    // Only staff can update attendance
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update attendance");
    };
    let callerUserId = switch (getUserIdFromPrincipal(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (?id) { id };
    };
    if (not isStaffUser(callerUserId)) {
      Runtime.trap("Unauthorized: Only staff can update attendance");
    };
    let record : AttendanceRecord = {
      studentId;
      subject;
      present;
      total;
    };
    attendanceRecords.add(studentId, record);
    true;
  };

  public query ({ caller }) func getAttendance(studentId : UserId) : async [AttendanceRecord] {
    // Users can view their own attendance, staff can view any
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view attendance");
    };
    let callerUserId = switch (getUserIdFromPrincipal(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (?id) { id };
    };
    if (callerUserId != studentId and not isStaffUser(callerUserId)) {
      Runtime.trap("Unauthorized: Can only view your own attendance");
    };
    attendanceRecords.values().toArray().filter(func(r : AttendanceRecord) : Bool { r.studentId == studentId }).sort();
  };

  // Leave Requests
  public shared ({ caller }) func submitLeave(userId : UserId, fromDate : Time.Time, toDate : Time.Time, reason : Text) : async Bool {
    // Only authenticated users can submit leave
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit leave");
    };
    let callerUserId = switch (getUserIdFromPrincipal(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (?id) { id };
    };
    if (callerUserId != userId) {
      Runtime.trap("Unauthorized: Can only submit leave for yourself");
    };
    let leave : LeaveRequest = {
      id = nextLeaveId;
      userId;
      fromDate;
      toDate;
      reason;
      status = #pending;
    };
    nextLeaveId += 1;
    leaveRequests.add(leave.id, leave);
    true;
  };

  public shared ({ caller }) func updateLeaveStatus(leaveId : Nat, status : LeaveStatus) : async Bool {
    // Only staff/admin can update leave status
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update leave status");
    };
    let callerUserId = switch (getUserIdFromPrincipal(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (?id) { id };
    };
    if (not isStaffUser(callerUserId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only staff or admins can update leave status");
    };
    switch (leaveRequests.get(leaveId)) {
      case (null) { Runtime.trap("Leave request not found") };
      case (?leave) {
        let updatedLeave = { leave with status };
        leaveRequests.add(leaveId, updatedLeave);
        true;
      };
    };
  };

  public query ({ caller }) func getLeaveRequests(userId : UserId) : async [LeaveRequest] {
    // Users can view their own leave requests, staff can view all
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view leave requests");
    };
    let callerUserId = switch (getUserIdFromPrincipal(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (?id) { id };
    };
    if (callerUserId != userId and not isStaffUser(callerUserId)) {
      Runtime.trap("Unauthorized: Can only view your own leave requests");
    };
    leaveRequests.values().toArray().filter(func(l : LeaveRequest) : Bool { l.userId == userId }).sort();
  };

  // Events
  public shared ({ caller }) func createEvent(title : Text, description : Text, date : Time.Time, department : Text) : async Bool {
    // Only staff/admin can create events
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create events");
    };
    let callerUserId = switch (getUserIdFromPrincipal(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (?id) { id };
    };
    if (not isStaffUser(callerUserId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only staff or admins can create events");
    };
    let event : Event = {
      id = nextEventId;
      title;
      description;
      date;
      department;
    };
    nextEventId += 1;
    events.add(event.id, event);
    true;
  };

  public query ({ caller }) func getEventsByDepartment(department : Text) : async [Event] {
    // Only authenticated users can view events
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view events");
    };
    let callerUserId = switch (getUserIdFromPrincipal(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (?id) { id };
    };
    // Students can only view events for their department or "all"
    switch (users.get(callerUserId)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) {
        if (not user.isStaff) {
          switch (user.department) {
            case (null) { Runtime.trap("Student has no department") };
            case (?userDept) {
              if (userDept != department and department != "all") {
                Runtime.trap("Unauthorized: Can only view events for your department");
              };
            };
          };
        };
      };
    };
    events.values().toArray().filter(func(e : Event) : Bool { e.department == department or e.department == "all" }).sort();
  };

  // Reminders
  public shared ({ caller }) func addReminder(userId : UserId, text : Text, priority : ReminderPriority, dueDate : Time.Time) : async Bool {
    // Users can only add reminders for themselves
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add reminders");
    };
    let callerUserId = switch (getUserIdFromPrincipal(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (?id) { id };
    };
    if (callerUserId != userId) {
      Runtime.trap("Unauthorized: Can only add reminders for yourself");
    };
    let reminder : Reminder = {
      id = nextReminderId;
      userId;
      text;
      priority;
      dueDate;
    };
    nextReminderId += 1;
    reminders.add(reminder.id, reminder);
    true;
  };

  public query ({ caller }) func getReminders(userId : UserId) : async [Reminder] {
    // Users can only view their own reminders
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view reminders");
    };
    let callerUserId = switch (getUserIdFromPrincipal(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (?id) { id };
    };
    if (callerUserId != userId) {
      Runtime.trap("Unauthorized: Can only view your own reminders");
    };
    reminders.values().toArray().filter(func(r : Reminder) : Bool { r.userId == userId }).sort();
  };

  // Login Streaks
  public shared ({ caller }) func updateLoginStreak(userId : UserId) : async Nat {
    // Users can only update their own login streak
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update login streak");
    };
    let callerUserId = switch (getUserIdFromPrincipal(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (?id) { id };
    };
    if (callerUserId != userId) {
      Runtime.trap("Unauthorized: Can only update your own login streak");
    };
    let currentTime = Time.now();
    let streak = switch (loginStreaks.get(userId)) {
      case (null) {
        let newStreak = {
          userId;
          currentStreak = 1;
          lastLogin = currentTime;
        };
        loginStreaks.add(userId, newStreak);
        1;
      };
      case (?streak) {
        let daysSinceLastLogin = (currentTime - streak.lastLogin) / 86_400_000_000_000;
        let updatedStreak = {
          userId;
          currentStreak = if (daysSinceLastLogin == 1) { streak.currentStreak + 1 } else { 1 };
          lastLogin = currentTime;
        };
        loginStreaks.add(userId, updatedStreak);
        updatedStreak.currentStreak;
      };
    };
    streak;
  };

  // Get all users (for admin)
  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    // Admin-only function
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    users.values().toArray().sort();
  };
};
