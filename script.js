// =====================================================
// PUNERI METRO PORTAL - COMPLETE JAVASCRIPT
// =====================================================

// =====================================================
// AIRTABLE CONFIGURATION - CHANGE THESE VALUES!
// =====================================================
/*
 * HOW TO GET YOUR AIRTABLE API KEY:
 * 1. Go to https://airtable.com/create/tokens
 * 2. Click "Create new token"
 * 3. Give it a name (e.g., "HazardRiskPortal")
 * 
 * IMPORTANT SCOPES TO SELECT:
 * ✅ data.records:read    - Read records from tables
 * ✅ data.records:write   - Create/update/delete records
 * ✅ schema.bases:read    - Read base schema (optional but helpful)
 * 
 * BASE ACCESS:
 * - Select your "HazardRiskPortal" base
 * - Or select "All current and future bases" for convenience
 * 
 * 4. Click "Create token" and copy it
 * 5. Paste below in AIRTABLE_API_KEY
 * 
 * HOW TO GET YOUR BASE ID:
 * 1. Open your base in Airtable
 * 2. Click "Help" menu → "API documentation"
 * 3. In the URL or docs, find the Base ID (starts with "app...")
 * 4. Paste below in AIRTABLE_BASE_ID
 */

/*
 * =====================================================
 * AIRTABLE TABLE SCHEMA - CREATE THESE EXACT FIELDS!
 * =====================================================
 * 
 * TABLE 1: "Stations"
 * ┌─────────────────┬──────────────────┬─────────────────────────────────────────┐
 * │ Field Name      │ Field Type       │ Description                             │
 * ├─────────────────┼──────────────────┼─────────────────────────────────────────┤
 * │ id              │ Single line text │ Primary field - Unique station ID       │
 * │ name            │ Single line text │ Station name (e.g., "Aarey Station")    │
 * │ columns         │ Long text        │ JSON array of column configurations     │
 * │ enabled         │ Checkbox         │ Whether station is active/visible       │
 * │ editedByAdmin   │ Checkbox         │ Tracks if admin has modified            │
 * └─────────────────┴──────────────────┴─────────────────────────────────────────┘
 * 
 * TABLE 2: "Entries"  
 * ┌───────────────────┬──────────────────┬─────────────────────────────────────────┐
 * │ Field Name        │ Field Type       │ Description                             │
 * ├───────────────────┼──────────────────┼─────────────────────────────────────────┤
 * │ id                │ Single line text │ Primary field - Unique entry ID         │
 * │ stationId         │ Single line text │ Links entry to a station                │
 * │ data              │ Long text        │ JSON object with all form field values  │
 * │ editedByController│ Checkbox         │ Tracks if controller has modified       │
 * │ createdBy         │ Single line text │ User ID of who created the entry        │
 * │ createdDate       │ Single line text │ Date entry was created (YYYY-MM-DD)     │
 * │ editedBy          │ Single line text │ User ID of who last edited the entry    │
 * │ editedDate        │ Single line text │ Date entry was last edited (YYYY-MM-DD) │
 * └───────────────────┴──────────────────┴─────────────────────────────────────────┘
 * 
 * TABLE 3: "StationUsers"
 * ┌─────────────────┬──────────────────┬─────────────────────────────────────────┐
 * │ Field Name      │ Field Type       │ Description                             │
 * ├─────────────────┼──────────────────┼─────────────────────────────────────────┤
 * │ id              │ Single line text │ Primary field - Unique user ID          │
 * │ odId            │ Single line text │ User ID (login - case sensitive)        │
 * │ empId           │ Single line text │ Employee ID                             │
 * │ name            │ Single line text │ Full name of the employee               │
 * │ designation     │ Single line text │ Job designation                         │
 * │ contactNo       │ Single line text │ Contact number                          │
 * │ assignedStations│ Long text        │ JSON array of assigned station IDs      │
 * └─────────────────┴──────────────────┴─────────────────────────────────────────┘
 * 
 * TABLE 4: "ShiftReports"
 * ┌─────────────────┬──────────────────┬─────────────────────────────────────────┐
 * │ Field Name      │ Field Type       │ Description                             │
 * ├─────────────────┼──────────────────┼─────────────────────────────────────────┤
 * │ id              │ Single line text │ Primary field - Unique report ID        │
 * │ stationId       │ Single line text │ Links to station                        │
 * │ date            │ Single line text │ Report date (YYYY-MM-DD)                │
 * │ shift           │ Single line text │ Shift (A/B/C)                           │
 * │ scName          │ Single line text │ Station Controller name                 │
 * │ scEmpId         │ Single line text │ Station Controller EMP ID               │
 * │ data            │ Long text        │ JSON with all report fields             │
 * └─────────────────┴──────────────────┴─────────────────────────────────────────┘
 * 
 * TABLE 5: "Instructions"
 * ┌─────────────────┬──────────────────┬─────────────────────────────────────────┐
 * │ Field Name      │ Field Type       │ Description                             │
 * ├─────────────────┼──────────────────┼─────────────────────────────────────────┤
 * │ id              │ Single line text │ Primary field - Unique instruction ID   │
 * │ text            │ Long text        │ Instruction text content                │
 * │ createdDate     │ Single line text │ Date created (YYYY-MM-DD)               │
 * └─────────────────┴──────────────────┴─────────────────────────────────────────┘
 * 
 * IMPORTANT: Create EXACT field names (case-sensitive!)
 * =====================================================
 */

const AIRTABLE_CONFIG = {
  // ⬇️ PASTE YOUR API KEY HERE (starts with "pat...")
  API_KEY: "patfXZtAQF24Ynu8K.301041af7168126b7dc01a55836482a6169347a819f316a9202ac3d96d9c4f20",
  
  // ⬇️ PASTE YOUR BASE ID HERE (starts with "app...")
  BASE_ID: "appWA7YoldYBbig7U",
  
  // Table names - create these exact tables in Airtable
  STATIONS_TABLE: "Stations",
  ENTRIES_TABLE: "Entries",
  VISITS_TABLE: "Visits",
  STATION_USERS_TABLE: "StationUsers",
  SHIFT_REPORTS_TABLE: "ShiftReports",
  INSTRUCTIONS_TABLE: "Instructions",
  SM_USERS_TABLE: "SMUsers"
};

/*
 * TABLE 6: "Visits" (for visit counter)
 * ┌─────────────────┬──────────────────┬─────────────────────────────────────────┐
 * │ Field Name      │ Field Type       │ Description                             │
 * ├─────────────────┼──────────────────┼─────────────────────────────────────────┤
 * │ id              │ Single line text │ Primary field - Always "counter"        │
 * │ count           │ Number           │ Total visit count                       │
 * └─────────────────┴──────────────────┴─────────────────────────────────────────┘
 */

// Check if Airtable is configured
const isAirtableConfigured = () => {
  return AIRTABLE_CONFIG.API_KEY !== "YOUR_AIRTABLE_API_KEY_HERE" && 
         AIRTABLE_CONFIG.BASE_ID !== "YOUR_BASE_ID_HERE";
};

// Airtable API URL
const getAirtableUrl = (table) => 
  `https://api.airtable.com/v0/${AIRTABLE_CONFIG.BASE_ID}/${encodeURIComponent(table)}`;

// Airtable headers
const getHeaders = () => ({
  'Authorization': `Bearer ${AIRTABLE_CONFIG.API_KEY}`,
  'Content-Type': 'application/json'
});

// =====================================================
// CONSTANTS
// =====================================================
const LEVELS_OPTIONS = ["Ground", "Mezzanine", "Concourse", "DN Platform", "UP Platform"];
const INFORM_TO_OPTIONS = ["Civil", "MEP", "Telecom", "Signaling", "Fire detection", "Fire suppression", "IT", "Traction", "Viaduct", "AFC", "Security", "Other"];
const ADMIN_PASSWORD = "Hazard2025";
const COO_PASSWORD = "KIPL";
const MAX_IMAGE_SIZE = 50000;
const VISITOR_KEY = "hazard_portal_visitor_id";
const SESSION_KEY = "hazard_portal_session";

// Shift definitions (IST 24-hour format)
const SHIFTS = {
  A: { name: "Shift A", start: 6, end: 15, label: "06:00 - 14:00" },
  B: { name: "Shift B", start: 14, end: 23, label: "14:00 - 22:00" },
  C: { name: "Shift C", start: 22, end: 7, label: "22:00 - 06:00" }
};

// Equipment status options
const EQUIPMENT_STATUS_OPTIONS = ["Working", "Not Working", "Under Maintenance", "NA"];

// =====================================================
// DEBOUNCE UTILITY - Prevent multiple button clicks
// =====================================================
const buttonStates = {};

function debounceClick(buttonId, callback, delay = 1000) {
  if (buttonStates[buttonId]) {
    return;
  }
  buttonStates[buttonId] = true;
  callback();
  setTimeout(() => {
    buttonStates[buttonId] = false;
  }, delay);
}

// =====================================================
// SESSION PERSISTENCE
// =====================================================
function saveSession() {
  const sessionData = {
    currentView: state.currentView,
    isAdmin: state.isAdmin,
    isCOO: state.isCOO,
    loggedInUser: state.loggedInUser,
    loggedInSM: state.loggedInSM,
    selectedShift: state.selectedShift,
    selectedStationForLogin: state.selectedStationForLogin,
    selectedStation: state.selectedStation,
    entryDateFilter: state.entryDateFilter,
    adminEntryDateFilter: state.adminEntryDateFilter,
    instructionAcknowledged: state.instructionAcknowledged
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
}

function loadSession() {
  try {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      return session;
    }
  } catch (e) {
    console.error("Error loading session:", e);
  }
  return null;
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// =====================================================
// STATE
// =====================================================
let state = {
  currentView: "login",
  isAdmin: false,
  isCOO: false,
  loggedInUser: null,
  loggedInSM: null,
  selectedShift: null,
  selectedStationForLogin: null,
  stations: [],
  entries: [],
  stationUsers: [],
  smUsers: [],
  shiftReports: [],
  instructions: [],
  selectedStation: null,
  editingEntry: null,
  editingStation: null,
  previewImage: null,
  visitCount: 0,
  dialogOpen: false,
  entryDateFilter: null,
  adminEntryDateFilter: null,
  instructionAcknowledged: false,
  marqueeIndex: 0
};

// DOM Elements
const app = document.getElementById("app");

// =====================================================
// UNIQUE VISITOR TRACKING
// =====================================================
function getOrCreateVisitorId() {
  let visitorId = localStorage.getItem(VISITOR_KEY);
  if (!visitorId) {
    visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(VISITOR_KEY, visitorId);
  }
  return visitorId;
}

function hasVisitorBeenCounted() {
  return localStorage.getItem(VISITOR_KEY + '_counted') === 'true';
}

function markVisitorAsCounted() {
  localStorage.setItem(VISITOR_KEY + '_counted', 'true');
}

// =====================================================
// SHIFT UTILITIES
// =====================================================
function getCurrentISTTime() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const ist = new Date(utc + istOffset);
  return ist;
}

function getCurrentShift() {
  const ist = getCurrentISTTime();
  const hour = ist.getHours();
  
  if (hour >= 6 && hour < 14) return 'A';
  if (hour >= 14 && hour < 22) return 'B';
  return 'C';
}

function isShiftActive(shiftKey) {
  return getCurrentShift() === shiftKey;
}

function formatISTDate() {
  const ist = getCurrentISTTime();
  return ist.toISOString().split('T')[0];
}

function formatISTDateTime() {
  const ist = getCurrentISTTime();
  return ist.toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function formatISTTimeHHMMSS() {
  const ist = getCurrentISTTime();
  const hours = ist.getHours().toString().padStart(2, '0');
  const minutes = ist.getMinutes().toString().padStart(2, '0');
  const seconds = ist.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

// Start clock update interval
let clockInterval = null;
function startClock() {
  if (clockInterval) clearInterval(clockInterval);
  clockInterval = setInterval(() => {
    const clockEl = document.getElementById('navbarClock');
    if (clockEl) {
      clockEl.textContent = formatISTTimeHHMMSS();
    }
  }, 1000);
}

// Marquee for instructions
let marqueeInterval = null;
function startMarquee() {
  if (marqueeInterval) clearInterval(marqueeInterval);
  if (state.instructions.length === 0) return;
  
  marqueeInterval = setInterval(() => {
    state.marqueeIndex = (state.marqueeIndex + 1) % state.instructions.length;
    const marqueeEl = document.getElementById('instructionMarquee');
    if (marqueeEl && state.instructions.length > 0) {
      marqueeEl.textContent = state.instructions[state.marqueeIndex]?.text || '';
    }
  }, 5000);
}

function formatISTTimeForEntry() {
  const ist = getCurrentISTTime();
  return ist.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// =====================================================
// DATA OPERATIONS (Airtable + localStorage fallback)
// =====================================================

async function fetchStations() {
  if (!isAirtableConfigured()) {
    console.warn("⚠️ Airtable not configured. Please configure Airtable to use this portal.");
    return [];
  }

  try {
    const response = await fetch(getAirtableUrl(AIRTABLE_CONFIG.STATIONS_TABLE), {
      headers: getHeaders()
    });
    
    if (!response.ok) throw new Error(`Airtable error: ${response.status}`);
    
    const data = await response.json();
    return data.records.map(record => ({
      id: record.fields.id || record.id,
      name: record.fields.name || '',
      columns: record.fields.columns ? JSON.parse(record.fields.columns) : [],
      enabled: record.fields.enabled || false,
      editedByAdmin: record.fields.editedByAdmin || false,
      airtableRecordId: record.id
    }));
  } catch (error) {
    console.error("Error fetching stations:", error);
    return [];
  }
}

async function createStationApi(station) {
  if (!isAirtableConfigured()) {
    showToast("Please configure Airtable to create stations", "error");
    return null;
  }

  try {
    const response = await fetch(getAirtableUrl(AIRTABLE_CONFIG.STATIONS_TABLE), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        records: [{
          fields: {
            id: station.id,
            name: station.name,
            columns: JSON.stringify(station.columns),
            enabled: station.enabled,
            editedByAdmin: station.editedByAdmin || false
          }
        }]
      })
    });
    
    if (!response.ok) throw new Error(`Airtable error: ${response.status}`);
    
    const data = await response.json();
    return { ...station, airtableRecordId: data.records[0].id };
  } catch (error) {
    console.error("Error creating station:", error);
    showToast("Failed to create station in Airtable", "error");
    return null;
  }
}

async function updateStationApi(station) {
  if (!isAirtableConfigured() || !station.airtableRecordId) {
    showToast("Cannot update: Airtable not configured", "error");
    return;
  }

  try {
    await fetch(`${getAirtableUrl(AIRTABLE_CONFIG.STATIONS_TABLE)}/${station.airtableRecordId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        fields: {
          name: station.name,
          columns: JSON.stringify(station.columns),
          enabled: station.enabled,
          editedByAdmin: station.editedByAdmin || false
        }
      })
    });
  } catch (error) {
    console.error("Error updating station:", error);
    showToast("Failed to update station", "error");
  }
}

async function deleteStationApi(stationId, airtableRecordId) {
  if (!isAirtableConfigured() || !airtableRecordId) {
    showToast("Cannot delete: Airtable not configured", "error");
    return;
  }

  try {
    await fetch(`${getAirtableUrl(AIRTABLE_CONFIG.STATIONS_TABLE)}/${airtableRecordId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch (error) {
    console.error("Error deleting station:", error);
    showToast("Failed to delete station", "error");
  }
}

async function fetchEntries() {
  if (!isAirtableConfigured()) {
    const saved = localStorage.getItem("hazard-entries");
    return saved ? JSON.parse(saved) : [];
  }

  try {
    const response = await fetch(getAirtableUrl(AIRTABLE_CONFIG.ENTRIES_TABLE), {
      headers: getHeaders()
    });
    
    if (!response.ok) throw new Error(`Airtable error: ${response.status}`);
    
    const data = await response.json();
    return data.records.map(record => ({
      id: record.fields.id || record.id,
      stationId: record.fields.stationId || '',
      data: record.fields.data ? JSON.parse(record.fields.data) : {},
      editedByController: record.fields.editedByController || false,
      createdBy: record.fields.createdBy || '',
      createdDate: record.fields.createdDate || '',
      editedBy: record.fields.editedBy || '',
      editedDate: record.fields.editedDate || '',
      status: record.fields.status || 'Open',
      closureRemark: record.fields.closureRemark || '',
      closedBy: record.fields.closedBy || '',
      closedDate: record.fields.closedDate || '',
      airtableRecordId: record.id
    }));
  } catch (error) {
    console.error("Error fetching entries:", error);
    return [];
  }
}

async function createEntryApi(entry) {
  if (!isAirtableConfigured()) {
    // Fallback to localStorage
    const saved = localStorage.getItem("hazard-entries");
    const entries = saved ? JSON.parse(saved) : [];
    entries.push(entry);
    localStorage.setItem("hazard-entries", JSON.stringify(entries));
    return entry;
  }

  try {
    const response = await fetch(getAirtableUrl(AIRTABLE_CONFIG.ENTRIES_TABLE), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        records: [{
          fields: {
            id: entry.id,
            stationId: entry.stationId,
            data: JSON.stringify(entry.data),
            editedByController: entry.editedByController || false,
            createdBy: entry.createdBy || '',
            createdDate: entry.createdDate || '',
            editedBy: entry.editedBy || '',
            editedDate: entry.editedDate || '',
            status: entry.status || 'Open',
            closureRemark: entry.closureRemark || '',
            closedBy: entry.closedBy || '',
            closedDate: entry.closedDate || ''
          }
        }]
      })
    });
    
    if (!response.ok) throw new Error(`Airtable error: ${response.status}`);
    
    const data = await response.json();
    return { ...entry, airtableRecordId: data.records[0].id };
  } catch (error) {
    console.error("Error creating entry:", error);
    // Fallback to localStorage
    const saved = localStorage.getItem("hazard-entries");
    const entries = saved ? JSON.parse(saved) : [];
    entries.push(entry);
    localStorage.setItem("hazard-entries", JSON.stringify(entries));
    return entry;
  }
}

async function updateEntryApi(entry) {
  if (!isAirtableConfigured() || !entry.airtableRecordId) {
    // Fallback to localStorage
    const saved = localStorage.getItem("hazard-entries");
    const entries = saved ? JSON.parse(saved) : [];
    const idx = entries.findIndex(e => e.id === entry.id);
    if (idx !== -1) { entries[idx] = entry; }
    localStorage.setItem("hazard-entries", JSON.stringify(entries));
    return;
  }

  try {
    await fetch(`${getAirtableUrl(AIRTABLE_CONFIG.ENTRIES_TABLE)}/${entry.airtableRecordId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        fields: {
          data: JSON.stringify(entry.data),
          editedByController: entry.editedByController || false,
          editedBy: entry.editedBy || '',
          editedDate: entry.editedDate || '',
          status: entry.status || 'Open',
          closureRemark: entry.closureRemark || '',
          closedBy: entry.closedBy || '',
          closedDate: entry.closedDate || ''
        }
      })
    });
  } catch (error) {
    console.error("Error updating entry:", error);
    showToast("Failed to update entry", "error");
  }
}

async function deleteEntryApi(entryId, airtableRecordId) {
  if (!isAirtableConfigured() || !airtableRecordId) {
    // Fallback to localStorage
    const saved = localStorage.getItem("hazard-entries");
    const entries = saved ? JSON.parse(saved) : [];
    const filtered = entries.filter(e => e.id !== entryId);
    localStorage.setItem("hazard-entries", JSON.stringify(filtered));
    return;
  }

  try {
    await fetch(`${getAirtableUrl(AIRTABLE_CONFIG.ENTRIES_TABLE)}/${airtableRecordId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch (error) {
    console.error("Error deleting entry:", error);
    showToast("Failed to delete entry", "error");
  }
}

// =====================================================
// STATION USERS API
// =====================================================
async function fetchStationUsers() {
  if (!isAirtableConfigured()) return [];

  try {
    const response = await fetch(getAirtableUrl(AIRTABLE_CONFIG.STATION_USERS_TABLE), {
      headers: getHeaders()
    });
    
    if (!response.ok) throw new Error(`Airtable error: ${response.status}`);
    
    const data = await response.json();
    return data.records.map(record => ({
      id: record.fields.id || record.id,
      odId: record.fields.odId || '',
      empId: record.fields.empId || '',
      name: record.fields.name || '',
      designation: record.fields.designation || '',
      contactNo: record.fields.contactNo || '',
      assignedStations: record.fields.assignedStations ? JSON.parse(record.fields.assignedStations) : [],
      registeredBySM: record.fields.registeredBySM || '',
      airtableRecordId: record.id
    }));
  } catch (error) {
    console.error("Error fetching station users:", error);
    return [];
  }
}

async function createStationUserApi(user) {
  if (!isAirtableConfigured()) {
    showToast("Please configure Airtable", "error");
    return null;
  }

  try {
    const response = await fetch(getAirtableUrl(AIRTABLE_CONFIG.STATION_USERS_TABLE), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        records: [{
          fields: {
            id: user.id,
            odId: user.odId,
            empId: user.empId,
            name: user.name,
            designation: user.designation,
            contactNo: user.contactNo || '',
            assignedStations: JSON.stringify(user.assignedStations || []),
            registeredBySM: user.registeredBySM || ''
          }
        }]
      })
    });
    
    if (!response.ok) throw new Error(`Airtable error: ${response.status}`);
    
    const data = await response.json();
    return { ...user, airtableRecordId: data.records[0].id };
  } catch (error) {
    console.error("Error creating station user:", error);
    showToast("Failed to create user", "error");
    return null;
  }
}

async function updateStationUserApi(user) {
  if (!isAirtableConfigured() || !user.airtableRecordId) return;

  try {
    await fetch(`${getAirtableUrl(AIRTABLE_CONFIG.STATION_USERS_TABLE)}/${user.airtableRecordId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        fields: {
          odId: user.odId,
          empId: user.empId,
          name: user.name,
          designation: user.designation,
          contactNo: user.contactNo || '',
          assignedStations: JSON.stringify(user.assignedStations || []),
          registeredBySM: user.registeredBySM || ''
        }
      })
    });
  } catch (error) {
    console.error("Error updating station user:", error);
    showToast("Failed to update user", "error");
  }
}

async function deleteStationUserApi(userId, airtableRecordId) {
  if (!isAirtableConfigured() || !airtableRecordId) return;

  try {
    await fetch(`${getAirtableUrl(AIRTABLE_CONFIG.STATION_USERS_TABLE)}/${airtableRecordId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch (error) {
    console.error("Error deleting station user:", error);
    showToast("Failed to delete user", "error");
  }
}

// =====================================================
// INSTRUCTIONS API
// =====================================================
async function fetchInstructions() {
  if (!isAirtableConfigured()) return [];

  try {
    const response = await fetch(getAirtableUrl(AIRTABLE_CONFIG.INSTRUCTIONS_TABLE), {
      headers: getHeaders()
    });
    
    if (!response.ok) throw new Error(`Airtable error: ${response.status}`);
    
    const data = await response.json();
    return data.records.map(record => ({
      id: record.fields.id || record.id,
      text: record.fields.text || '',
      createdDate: record.fields.createdDate || '',
      createdBySM: record.fields.createdBySM || '',
      createdTime: record.fields.createdTime || '',
      airtableRecordId: record.id
    }));
  } catch (error) {
    console.error("Error fetching instructions:", error);
    return [];
  }
}

async function createInstructionApi(instruction) {
  if (!isAirtableConfigured()) {
    showToast("Please configure Airtable", "error");
    return null;
  }

  try {
    const response = await fetch(getAirtableUrl(AIRTABLE_CONFIG.INSTRUCTIONS_TABLE), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        records: [{
          fields: {
            id: instruction.id,
            text: instruction.text,
            createdDate: instruction.createdDate,
            createdBySM: instruction.createdBySM || '',
            createdTime: instruction.createdTime || ''
          }
        }]
      })
    });
    
    if (!response.ok) throw new Error(`Airtable error: ${response.status}`);
    
    const data = await response.json();
    return { ...instruction, airtableRecordId: data.records[0].id };
  } catch (error) {
    console.error("Error creating instruction:", error);
    showToast("Failed to create instruction", "error");
    return null;
  }
}

async function deleteInstructionApi(instructionId, airtableRecordId) {
  if (!isAirtableConfigured() || !airtableRecordId) return;

  try {
    await fetch(`${getAirtableUrl(AIRTABLE_CONFIG.INSTRUCTIONS_TABLE)}/${airtableRecordId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch (error) {
    console.error("Error deleting instruction:", error);
    showToast("Failed to delete instruction", "error");
  }
}

// =====================================================
// SM USERS API
// =====================================================
async function fetchSMUsers() {
  if (!isAirtableConfigured()) return [];

  try {
    const response = await fetch(getAirtableUrl(AIRTABLE_CONFIG.SM_USERS_TABLE), {
      headers: getHeaders()
    });
    
    if (!response.ok) throw new Error(`Airtable error: ${response.status}`);
    
    const data = await response.json();
    return data.records.map(record => ({
      id: record.fields.id || record.id,
      odId: record.fields.odId || '',
      empId: record.fields.empId || '',
      name: record.fields.name || '',
      designation: record.fields.designation || '',
      contactNo: record.fields.contactNo || '',
      assignedStations: record.fields.assignedStations ? JSON.parse(record.fields.assignedStations) : [],
      airtableRecordId: record.id
    }));
  } catch (error) {
    console.error("Error fetching SM users:", error);
    return [];
  }
}

async function createSMUserApi(user) {
  if (!isAirtableConfigured()) {
    showToast("Please configure Airtable", "error");
    return null;
  }

  try {
    const response = await fetch(getAirtableUrl(AIRTABLE_CONFIG.SM_USERS_TABLE), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        records: [{
          fields: {
            id: user.id,
            odId: user.odId,
            empId: user.empId,
            name: user.name,
            designation: user.designation,
            contactNo: user.contactNo || '',
            assignedStations: JSON.stringify(user.assignedStations || [])
          }
        }]
      })
    });
    
    if (!response.ok) throw new Error(`Airtable error: ${response.status}`);
    
    const data = await response.json();
    return { ...user, airtableRecordId: data.records[0].id };
  } catch (error) {
    console.error("Error creating SM user:", error);
    showToast("Failed to create SM user", "error");
    return null;
  }
}

async function updateSMUserApi(user) {
  if (!isAirtableConfigured() || !user.airtableRecordId) return;

  try {
    await fetch(`${getAirtableUrl(AIRTABLE_CONFIG.SM_USERS_TABLE)}/${user.airtableRecordId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        fields: {
          odId: user.odId,
          empId: user.empId,
          name: user.name,
          designation: user.designation,
          contactNo: user.contactNo || '',
          assignedStations: JSON.stringify(user.assignedStations || [])
        }
      })
    });
  } catch (error) {
    console.error("Error updating SM user:", error);
    showToast("Failed to update SM user", "error");
  }
}

async function deleteSMUserApi(userId, airtableRecordId) {
  if (!isAirtableConfigured() || !airtableRecordId) return;

  try {
    await fetch(`${getAirtableUrl(AIRTABLE_CONFIG.SM_USERS_TABLE)}/${airtableRecordId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch (error) {
    console.error("Error deleting SM user:", error);
    showToast("Failed to delete SM user", "error");
  }
}

// =====================================================
// SHIFT REPORTS API
// =====================================================
async function fetchShiftReports() {
  if (!isAirtableConfigured()) return [];

  try {
    const response = await fetch(getAirtableUrl(AIRTABLE_CONFIG.SHIFT_REPORTS_TABLE), {
      headers: getHeaders()
    });
    
    if (!response.ok) throw new Error(`Airtable error: ${response.status}`);
    
    const data = await response.json();
    return data.records.map(record => ({
      id: record.fields.id || record.id,
      stationId: record.fields.stationId || '',
      date: record.fields.date || '',
      shift: record.fields.shift || '',
      scName: record.fields.scName || '',
      scEmpId: record.fields.scEmpId || '',
      data: record.fields.data ? JSON.parse(record.fields.data) : {},
      airtableRecordId: record.id
    }));
  } catch (error) {
    console.error("Error fetching shift reports:", error);
    return [];
  }
}

async function createShiftReportApi(report) {
  if (!isAirtableConfigured()) {
    showToast("Please configure Airtable", "error");
    return null;
  }

  try {
    const response = await fetch(getAirtableUrl(AIRTABLE_CONFIG.SHIFT_REPORTS_TABLE), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        records: [{
          fields: {
            id: report.id,
            stationId: report.stationId,
            date: report.date,
            shift: report.shift,
            scName: report.scName,
            scEmpId: report.scEmpId,
            data: JSON.stringify(report.data)
          }
        }]
      })
    });
    
    if (!response.ok) throw new Error(`Airtable error: ${response.status}`);
    
    const data = await response.json();
    return { ...report, airtableRecordId: data.records[0].id };
  } catch (error) {
    console.error("Error creating shift report:", error);
    showToast("Failed to create shift report", "error");
    return null;
  }
}

async function updateShiftReportApi(report) {
  if (!isAirtableConfigured() || !report.airtableRecordId) return;

  try {
    await fetch(`${getAirtableUrl(AIRTABLE_CONFIG.SHIFT_REPORTS_TABLE)}/${report.airtableRecordId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        fields: {
          data: JSON.stringify(report.data)
        }
      })
    });
  } catch (error) {
    console.error("Error updating shift report:", error);
    showToast("Failed to update shift report", "error");
  }
}

async function deleteShiftReportApi(reportId, airtableRecordId) {
  if (!isAirtableConfigured() || !airtableRecordId) return;

  try {
    await fetch(`${getAirtableUrl(AIRTABLE_CONFIG.SHIFT_REPORTS_TABLE)}/${airtableRecordId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch (error) {
    console.error("Error deleting shift report:", error);
    showToast("Failed to delete shift report", "error");
  }
}

// =====================================================
// VISIT COUNTER
// =====================================================
async function getVisitCount() {
  if (!isAirtableConfigured()) return 0;
  
  try {
    const response = await fetch(getAirtableUrl(AIRTABLE_CONFIG.VISITS_TABLE), {
      headers: getHeaders()
    });
    
    if (!response.ok) return 0;
    
    const data = await response.json();
    if (data.records.length > 0) {
      return data.records[0].fields.count || 0;
    }
    return 0;
  } catch (error) {
    console.error("Error fetching visit count:", error);
    return 0;
  }
}

async function incrementVisitCount() {
  if (!isAirtableConfigured()) return 0;
  
  if (hasVisitorBeenCounted()) {
    return await getVisitCount();
  }
  
  try {
    const response = await fetch(getAirtableUrl(AIRTABLE_CONFIG.VISITS_TABLE), {
      headers: getHeaders()
    });
    
    if (!response.ok) return 0;
    
    const data = await response.json();
    
    if (data.records.length > 0) {
      const record = data.records[0];
      const newCount = (record.fields.count || 0) + 1;
      
      await fetch(`${getAirtableUrl(AIRTABLE_CONFIG.VISITS_TABLE)}/${record.id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({
          fields: { count: newCount }
        })
      });
      
      markVisitorAsCounted();
      return newCount;
    } else {
      const createResponse = await fetch(getAirtableUrl(AIRTABLE_CONFIG.VISITS_TABLE), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          records: [{
            fields: {
              id: "counter",
              count: 1
            }
          }]
        })
      });
      
      if (createResponse.ok) {
        markVisitorAsCounted();
        return 1;
      }
      return 0;
    }
  } catch (error) {
    console.error("Error incrementing visit count:", error);
    return 0;
  }
}

// =====================================================
// LOAD DATA
// =====================================================
async function loadData() {
  state.stations = await fetchStations();
  state.entries = await fetchEntries();
  state.stationUsers = await fetchStationUsers();
  state.smUsers = await fetchSMUsers();
  state.shiftReports = await fetchShiftReports();
  state.instructions = await fetchInstructions();
  state.visitCount = await incrementVisitCount();
  state.entryDateFilter = formatISTDate();
  state.adminEntryDateFilter = formatISTDate();
}

async function refreshData() {
  state.stations = await fetchStations();
  state.entries = await fetchEntries();
  state.stationUsers = await fetchStationUsers();
  state.smUsers = await fetchSMUsers();
  state.shiftReports = await fetchShiftReports();
  state.instructions = await fetchInstructions();
  state.visitCount = await getVisitCount();
}

// =====================================================
// TOAST NOTIFICATIONS
// =====================================================
function showToast(message, type = "success") {
  const container = document.querySelector(".toast-container") || createToastContainer();
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function createToastContainer() {
  const container = document.createElement("div");
  container.className = "toast-container";
  document.body.appendChild(container);
  return container;
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================
function generateId() {
  return Date.now().toString();
}

function getUserNameByOdId(odId) {
  if (!odId) return '-';
  if (odId === 'Admin') return 'Admin';
  if (odId === 'COO') return 'COO';
  const user = state.stationUsers.find(u => u.odId === odId);
  if (user) return user.name;
  const smUser = state.smUsers.find(u => u.odId === odId);
  if (smUser) return smUser.name;
  return odId;
}

// =====================================================
// ICONS (SVG strings)
// =====================================================
const icons = {
  alertTriangle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  building: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  arrowLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>`,
  power: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 11-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  document: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  archive: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>`,
  logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  merge: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  clipboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  login: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`,
  fileText: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  grip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  paperclip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`
};

// =====================================================
// RENDER FUNCTIONS
// =====================================================
function render() {
  if (state.currentView === "login") {
    app.innerHTML = renderLoginPage();
    startMarquee();
  } else {
    app.innerHTML = `
      ${renderNavbar()}
      ${state.currentView === "admin" ? renderAdminDashboard() : (state.currentView === "coo" ? renderCOODashboard() : renderControllerDashboard())}
      ${renderFooter()}
      ${renderDialogs()}
    `;
    startClock();
  }
  attachEventListeners();
  saveSession();
}

function renderLoginPage() {
  const currentShift = getCurrentShift();
  
  // For station login, show only instructions from the SM who manages this user's stations
  // (We'll filter after user enters their ID - for now show all at login page level)
  const hasInstructions = state.instructions.length > 0;
  
  // COO instructions (golden priority)
  const cooInstructions = state.instructions.filter(i => i.createdBySM === 'COO');
  const smInstructions = state.instructions.filter(i => i.createdBySM !== 'COO');
  
  return `
    <div class="login-page">
      <div class="login-overlay"></div>
      <div class="login-container">
        <div class="login-card">
          <div class="login-header-compact">
            <div class="login-icon-small">
              <div class="login-icon-inner-small">${icons.alertTriangle}</div>
            </div>
            <div class="login-title-group">
              <h1 class="login-title-compact">PUNERI METRO</h1>
              <p class="login-subtitle-compact">"Be aware, take care"</p>
            </div>
          </div>

          <div class="login-tabs">
            <button class="login-tab active" id="stationTab" onclick="switchLoginTab('station')">
              ${icons.building}
              Station Login
            </button>
            <button class="login-tab" id="adminTab" onclick="switchLoginTab('admin')">
              ${icons.shield}
              SM Login
            </button>
            <button class="login-tab" id="cooTab" onclick="switchLoginTab('coo')">
              ${icons.users}
              COO Login
            </button>
          </div>

          <div id="stationLoginForm" class="login-form">
            
            <div class="login-row-3col">
              <div class="login-field">
                <label class="form-label-compact">User ID</label>
                <input type="text" class="form-input form-input-compact" id="stationUserId" placeholder="User ID" autocomplete="off" onblur="filterStationsByUser(); filterInstructionsForUser()" onkeyup="filterStationsByUser(); filterInstructionsForUser()">
              </div>
              <div class="login-field">
                <label class="form-label-compact">Station</label>
                <select class="form-select form-input-compact" id="loginStationSelect">
                  <option value="">Select...</option>
                  ${state.stations.filter(s => s.enabled).map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                </select>
              </div>
              <div class="login-field">
                <label class="form-label-compact">Shift</label>
                <div class="shift-pills">
                  ${Object.keys(SHIFTS).map(key => `
                    <span class="shift-pill ${currentShift === key ? 'shift-pill-active' : ''}">${key}</span>
                  `).join('')}
                </div>
              </div>
            </div>
            
            <div id="stationInstructionsContainer">
              ${hasInstructions ? renderStationInstructions(state.instructions) : ''}
            </div>
            
            <button class="btn btn-accent btn-full" id="stationLoginBtn" onclick="debounceClick('stationLogin', handleStationLogin)" ${hasInstructions ? 'disabled' : ''}>
              ${icons.login}
              Enter Station
            </button>
          </div>

          <div id="adminLoginForm" class="login-form" style="display: none;">
            <div class="form-group-compact">
              <label class="form-label-compact">SM User ID</label>
              <input type="text" class="form-input form-input-compact" id="adminPasswordInput" placeholder="Enter SM User ID" onkeyup="if(event.key === 'Enter') debounceClick('adminLogin', handleAdminLogin)">
            </div>
            <button class="btn btn-primary btn-full" onclick="debounceClick('adminLogin', handleAdminLogin)">
              ${icons.shield}
              Access SM Panel
            </button>
          </div>
          
          <div id="cooLoginForm" class="login-form" style="display: none;">
            <div class="form-group-compact">
              <label class="form-label-compact">COO Login ID</label>
              <input type="text" class="form-input form-input-compact" id="cooPasswordInput" placeholder="Enter COO Login ID" onkeyup="if(event.key === 'Enter') debounceClick('cooLogin', handleCOOLogin)">
            </div>
            <button class="btn btn-primary btn-full" onclick="debounceClick('cooLogin', handleCOOLogin)">
              ${icons.users}
              Access COO Panel
            </button>
          </div>
          
          <div class="login-footer-info">
            <p class="login-time">${formatISTDateTime()} IST</p>
            <p class="login-visitors">Total Visitors: ${state.visitCount.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStationInstructions(instructions) {
  if (instructions.length === 0) return '';
  
  // Separate COO instructions (golden priority) and SM instructions
  const cooInstructions = instructions.filter(i => i.createdBySM === 'COO');
  const smInstructions = instructions.filter(i => i.createdBySM !== 'COO');
  
  return `
    <div class="declaration-section">
      <div class="declaration-header">
        <h4>${icons.clipboard} Declaration</h4>
      </div>
      <div class="declaration-content">
        <div class="instructions-list">
          ${cooInstructions.map((inst, idx) => `
            <div class="instruction-item instruction-coo-priority">
              <span class="instruction-number" style="color: #DAA520; font-weight: bold;">${idx + 1}.</span>
              <span class="instruction-text" style="color: #DAA520; font-weight: bold;">⭐ [COO] ${inst.text}</span>
            </div>
          `).join('')}
          ${smInstructions.map((inst, idx) => `
            <div class="instruction-item">
              <span class="instruction-number">${cooInstructions.length + idx + 1}.</span>
              <span class="instruction-text">${inst.text}</span>
            </div>
          `).join('')}
        </div>
        <label class="declaration-checkbox">
          <input type="checkbox" id="acknowledgeCheckbox" onchange="handleAcknowledgeChange(this.checked)">
          <span>I have read and understood all the above instructions</span>
        </label>
      </div>
    </div>
  `;
}

function filterInstructionsForUser() {
  const userId = document.getElementById('stationUserId').value.trim();
  const user = state.stationUsers.find(u => u.odId === userId);
  const container = document.getElementById('stationInstructionsContainer');
  const loginBtn = document.getElementById('stationLoginBtn');
  if (!container) return;
  
  // COO instructions always visible to everyone
  const cooInstructions = state.instructions.filter(i => i.createdBySM === 'COO');
  let smFilteredInstructions = [];
  
  if (user && user.assignedStations && user.assignedStations.length > 0) {
    // Find which SM(s) manage stations this user is assigned to
    const smNames = [];
    for (const sm of state.smUsers) {
      if (sm.assignedStations && sm.assignedStations.length > 0) {
        const overlap = sm.assignedStations.some(sid => user.assignedStations.includes(sid));
        if (overlap) smNames.push(sm.name);
      }
    }
    if (smNames.length > 0) {
      smFilteredInstructions = state.instructions.filter(inst => inst.createdBySM !== 'COO' && smNames.includes(inst.createdBySM));
    }
  } else {
    smFilteredInstructions = state.instructions.filter(i => i.createdBySM !== 'COO');
  }
  
  const allFiltered = [...cooInstructions, ...smFilteredInstructions];
  
  if (allFiltered.length > 0) {
    container.innerHTML = renderStationInstructions(allFiltered);
    if (loginBtn) loginBtn.disabled = true;
    state.instructionAcknowledged = false;
  } else {
    container.innerHTML = '';
    if (loginBtn) loginBtn.disabled = false;
  }
}

function handleAcknowledgeChange(checked) {
  state.instructionAcknowledged = checked;
  const loginBtn = document.getElementById('stationLoginBtn');
  if (loginBtn) {
    loginBtn.disabled = !checked;
  }
}

function switchLoginTab(tab) {
  const stationTab = document.getElementById('stationTab');
  const adminTab = document.getElementById('adminTab');
  const cooTab = document.getElementById('cooTab');
  const stationForm = document.getElementById('stationLoginForm');
  const adminForm = document.getElementById('adminLoginForm');
  const cooForm = document.getElementById('cooLoginForm');
  
  stationTab.classList.remove('active');
  adminTab.classList.remove('active');
  cooTab.classList.remove('active');
  stationForm.style.display = 'none';
  adminForm.style.display = 'none';
  cooForm.style.display = 'none';
  
  if (tab === 'station') {
    stationTab.classList.add('active');
    stationForm.style.display = 'flex';
  } else if (tab === 'admin') {
    adminTab.classList.add('active');
    adminForm.style.display = 'flex';
  } else {
    cooTab.classList.add('active');
    cooForm.style.display = 'flex';
  }
}

function handleStationLogin() {
  const userId = document.getElementById('stationUserId').value.trim();
  const stationId = document.getElementById('loginStationSelect').value;
  const currentShift = getCurrentShift();
  const hasInstructions = state.instructions.length > 0;
  
  if (!userId) {
    showToast("Please enter your User ID", "error");
    return;
  }
  
  if (!stationId) {
    showToast("Please select a station", "error");
    return;
  }
  
  if (hasInstructions && !state.instructionAcknowledged) {
    showToast("Please acknowledge the instructions", "error");
    return;
  }
  
  const user = state.stationUsers.find(u => u.odId === userId);
  
  if (!user) {
    showToast("User ID not found. Contact admin to register.", "error");
    return;
  }
  
  // Check if user is assigned to this station
  if (user.assignedStations && user.assignedStations.length > 0 && !user.assignedStations.includes(stationId)) {
    showToast("You are not assigned to this station. Contact admin.", "error");
    return;
  }
  
  state.loggedInUser = user;
  state.selectedStationForLogin = stationId;
  state.selectedShift = currentShift;
  state.currentView = "controller";
  state.isAdmin = false;
  state.selectedStation = stationId;
  state.entryDateFilter = formatISTDate();
  
  showToast(`Welcome, ${user.name}!`);
  startInstructionPolling();
  render();
}

// Filter stations based on User ID input
function filterStationsByUser() {
  const userId = document.getElementById('stationUserId').value.trim();
  const selectEl = document.getElementById('loginStationSelect');
  if (!selectEl) return;
  
  const user = state.stationUsers.find(u => u.odId === userId);
  let filteredStations = state.stations.filter(s => s.enabled);
  
  if (user && user.assignedStations && user.assignedStations.length > 0) {
    filteredStations = filteredStations.filter(s => user.assignedStations.includes(s.id));
  }
  
  const currentVal = selectEl.value;
  selectEl.innerHTML = `<option value="">Select...</option>` + 
    filteredStations.map(s => `<option value="${s.id}" ${s.id === currentVal ? 'selected' : ''}>${s.name}</option>`).join('');
}

function handleAdminLogin() {
  const smUserId = document.getElementById('adminPasswordInput').value.trim();
  
  if (!smUserId) {
    showToast("Please enter SM User ID", "error");
    return;
  }
  
  const smUser = state.smUsers.find(u => u.odId === smUserId);
  
  if (!smUser) {
    showToast("SM User ID not found. Contact COO.", "error");
    return;
  }
  
  state.isAdmin = true;
  state.isCOO = false;
  state.currentView = "admin";
  state.loggedInUser = null;
  state.loggedInSM = smUser;
  state.selectedStation = null;
  state.adminEntryDateFilter = formatISTDate();
  showToast(`Welcome, ${smUser.name}!`);
  render();
}

function handleCOOLogin() {
  const cooId = document.getElementById('cooPasswordInput').value.trim();
  
  if (cooId === COO_PASSWORD) {
    state.isCOO = true;
    state.isAdmin = false;
    state.currentView = "coo";
    state.loggedInUser = null;
    state.loggedInSM = null;
    state.selectedStation = null;
    state.adminEntryDateFilter = formatISTDate();
    showToast("COO access granted");
    render();
  } else {
    showToast("Invalid COO Login ID", "error");
  }
}

function renderNavbar() {
  const userName = state.loggedInUser ? state.loggedInUser.name : "";
  const shiftInfo = state.selectedShift ? SHIFTS[state.selectedShift] : null;
  
  return `
    <nav class="navbar">
      <div class="navbar-content">
        <div class="navbar-brand">
          <div class="navbar-icon">
            <div class="navbar-icon-glow"></div>
            <div class="navbar-icon-inner">${icons.alertTriangle}</div>
          </div>
          <div>
            <h1 class="navbar-title">PUNERI METRO</h1>
            <p class="navbar-subtitle">"Be aware, take care"</p>
          </div>
        </div>
        <div class="navbar-actions">
          <div class="navbar-clock" id="navbarClock">${formatISTTimeHHMMSS()}</div>
          ${state.isCOO ? `
            <div class="admin-id-badge">COO Panel</div>
          ` : state.isAdmin ? `
            <div class="admin-id-badge">SM: ${state.loggedInSM ? state.loggedInSM.name : 'Admin'}</div>
          ` : `
            <div class="user-info-badge">
              <span class="user-name">${userName}</span>
              ${shiftInfo ? `<span class="shift-badge">${shiftInfo.name}</span>` : ''}
            </div>
          `}
          <button class="btn btn-outline btn-sm" onclick="debounceClick('refresh', handleRefreshData)" title="Refresh Data">
            ${icons.refresh}
          </button>
          <button class="btn btn-logout" onclick="debounceClick('logout', handleLogout)">
            ${icons.logout}
            Logout
          </button>
        </div>
      </div>
    </nav>
  `;
}

async function handleRefreshData() {
  showToast("Refreshing data...");
  await refreshData();
  render();
  showToast("Data refreshed successfully");
}

function renderFooter() {
  return `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-text">
          <p>© 2025 PUNERI METRO Portal. All rights reserved.</p>
          <p class="visit-counter">Total Unique Visitors: ${state.visitCount.toLocaleString()}</p>
        </div>
        <div class="footer-credits">
          <p>Created by Prashant Golhar</p>
          <p>Department : Operation</p>
        </div>
      </div>
    </footer>
  `;
}

function renderAdminDashboard() {
  if (state.selectedStation) {
    return renderAdminStationView();
  }
  return `
    <main class="main-content">
      <div class="main-overlay"></div>
      <div class="content-wrapper">
        <div class="admin-tabs">
          <button class="admin-tab active" onclick="switchAdminTab('stations')" id="tabStations">
            ${icons.building}
            Stations
          </button>
          <button class="admin-tab" onclick="switchAdminTab('users')" id="tabUsers">
            ${icons.users}
            Station Users
          </button>
          <button class="admin-tab" onclick="switchAdminTab('shiftReports')" id="tabShiftReports">
            ${icons.clipboard}
            Shift Reports
          </button>
          <button class="admin-tab" onclick="switchAdminTab('instructions')" id="tabInstructions">
            ${icons.info}
            Instructions
          </button>
        </div>
        
        <div id="adminStationsContent">
          ${renderAdminStationsTab()}
        </div>
        
        <div id="adminUsersContent" style="display: none;">
          ${renderAdminUsersTab()}
        </div>
        
        <div id="adminShiftReportsContent" style="display: none;">
          ${renderAdminShiftReportsTab()}
        </div>
        
        <div id="adminInstructionsContent" style="display: none;">
          ${renderAdminInstructionsTab()}
        </div>
      </div>
    </main>
  `;
}

function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  const tabEl = document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
  if (tabEl) tabEl.classList.add('active');
  
  document.getElementById('adminStationsContent').style.display = tab === 'stations' ? 'block' : 'none';
  document.getElementById('adminUsersContent').style.display = tab === 'users' ? 'block' : 'none';
  document.getElementById('adminShiftReportsContent').style.display = tab === 'shiftReports' ? 'block' : 'none';
  document.getElementById('adminInstructionsContent').style.display = tab === 'instructions' ? 'block' : 'none';
}

function getAdminAssignedStations() {
  if (state.loggedInSM && state.loggedInSM.assignedStations && state.loggedInSM.assignedStations.length > 0) {
    return state.stations.filter(s => state.loggedInSM.assignedStations.includes(s.id));
  }
  return state.stations;
}

function renderAdminStationsTab() {
  const assignedStations = getAdminAssignedStations();
  return `
    <div class="page-header">
      <h1 class="page-title">SM Dashboard - Stations</h1>
      <div class="flex gap-3">
        <button class="btn btn-merge" onclick="debounceClick('merge', openMergeStationDialog)">
          ${icons.merge}
          Merge Stations
        </button>
        <button class="btn btn-primary" onclick="debounceClick('addStation', openAddStationDialog)">
          ${icons.plus}
          Add Station
        </button>
      </div>
    </div>
    <div class="grid grid-cols-3">
      ${assignedStations.map((station, index) => renderStationCard(station, index, true)).join("")}
    </div>
  `;
}

function renderAdminUsersTab() {
  // SM can only assign stations that COO gave them
  const smAssignedStations = getAdminAssignedStations();
  // SM sees only users they registered
  const smName = state.loggedInSM ? state.loggedInSM.name : '';
  const visibleUsers = smName ? state.stationUsers.filter(u => u.registeredBySM === smName) : state.stationUsers;
  
  return `
    <div class="page-header">
      <h1 class="page-title">Station Users Management</h1>
      <button class="btn btn-primary" onclick="debounceClick('addUser', openAddUserDialog)">
        ${icons.plus}
        Register User
      </button>
    </div>
    <div class="card">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>User ID</th>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Contact No</th>
              <th>Assigned Stations</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${visibleUsers.length === 0 ? `
              <tr>
                <td colspan="8" style="text-align: center; padding: 2rem;">
                  No users registered. Click "Register User" to add station users.
                </td>
              </tr>
            ` : visibleUsers.map((user, index) => `
              <tr>
                <td>${index + 1}</td>
                <td><strong>${user.odId || '-'}</strong></td>
                <td>${user.empId || '-'}</td>
                <td>${user.name}</td>
                <td>${user.designation}</td>
                <td>${user.contactNo || '-'}</td>
                <td>${(user.assignedStations || []).map(sid => {
                  const s = state.stations.find(st => st.id === sid);
                  return s ? s.name : '';
                }).filter(Boolean).join(', ') || 'All'}</td>
                <td>
                  <div class="actions-cell">
                    <button class="btn btn-ghost" onclick="debounceClick('editUser${user.id}', () => openEditUserDialog('${user.id}'))">
                      ${icons.edit}
                    </button>
                    <button class="btn btn-ghost text-destructive" onclick="debounceClick('deleteUser${user.id}', () => deleteUser('${user.id}'))">
                      ${icons.trash}
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div class="info-card">
      <h4>Login Credentials Info</h4>
      <p>Users login with their <strong>User ID</strong> (case-sensitive). No password required. If no stations are assigned, user can access all stations.</p>
    </div>
  `;
}

function renderAdminInstructionsTab() {
  const today = new Date().toISOString().split('T')[0];
  // SM sees their own + COO instructions; COO/Admin sees all
  const smName = state.loggedInSM ? state.loggedInSM.name : '';
  let myInstructions;
  if (smName) {
    myInstructions = state.instructions.filter(i => i.createdBySM === smName || i.createdBySM === 'COO');
  } else {
    myInstructions = state.instructions;
  }
  // COO instructions on top
  myInstructions = [
    ...myInstructions.filter(i => i.createdBySM === 'COO'),
    ...myInstructions.filter(i => i.createdBySM !== 'COO')
  ];
  
  return `
    <div class="page-header">
      <h1 class="page-title">Instructions Management</h1>
      <div class="flex gap-3 items-center flex-wrap">
        <div class="filter-group">
          <label class="filter-label">${icons.calendar} Date Filter</label>
          <input type="date" class="form-input form-input-sm" id="instructionDateFilter" max="${today}" onchange="filterInstructionsByDate(this.value)">
        </div>
        <button class="btn btn-primary" onclick="debounceClick('addInstruction', openAddInstructionDialog)">
          ${icons.plus}
          Add Instruction
        </button>
      </div>
    </div>
    <div class="card">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Instruction Text</th>
              <th>Created By</th>
              <th>Created Date</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody id="instructionsTableBody">
            ${renderInstructionRows(myInstructions, smName)}
          </tbody>
        </table>
      </div>
    </div>
    <div class="info-card">
      <h4>Instructions Info</h4>
      <p>Instructions you add are displayed only to station users assigned to your stations. COO instructions are top priority and visible to all SMs and station users.</p>
    </div>
  `;
}

function renderInstructionRows(instructions, currentSmName) {
  if (instructions.length === 0) {
    return `<tr><td colspan="5" style="text-align: center; padding: 2rem;">No instructions found.</td></tr>`;
  }
  return instructions.map((inst, index) => {
    const isCoo = inst.createdBySM === 'COO';
    const canDelete = currentSmName ? (inst.createdBySM === currentSmName) : true;
    return `
    <tr ${isCoo ? 'style="background: rgba(218, 165, 32, 0.08);"' : ''}>
      <td>${index + 1}</td>
      <td ${isCoo ? 'style="color: #DAA520; font-weight: 600;"' : ''}>${isCoo ? '⭐ ' : ''}${inst.text}</td>
      <td><strong ${isCoo ? 'style="color: #DAA520;"' : ''}>${inst.createdBySM || '-'}</strong></td>
      <td>${inst.createdDate || '-'}</td>
      <td>
        <div class="actions-cell">
          ${canDelete ? `<button class="btn btn-ghost text-destructive" onclick="debounceClick('deleteInst${inst.id}', () => deleteInstruction('${inst.id}'))">${icons.trash}</button>` : '<span style="color: var(--muted-foreground); font-size: 0.7rem;">View only</span>'}
        </div>
      </td>
    </tr>
  `;}).join('');
}

function filterInstructionsByDate(dateValue) {
  const smName = state.loggedInSM ? state.loggedInSM.name : '';
  let filtered;
  if (smName) {
    filtered = state.instructions.filter(i => i.createdBySM === smName || i.createdBySM === 'COO');
  } else {
    filtered = [...state.instructions];
  }
  if (dateValue) {
    filtered = filtered.filter(i => i.createdDate === dateValue);
  }
  filtered = [
    ...filtered.filter(i => i.createdBySM === 'COO'),
    ...filtered.filter(i => i.createdBySM !== 'COO')
  ];
  document.getElementById('instructionsTableBody').innerHTML = renderInstructionRows(filtered, smName);
}

function openAddInstructionDialog() {
  document.getElementById("newInstructionText").value = "";
  openDialog("addInstructionDialog");
}

async function createInstruction() {
  const text = document.getElementById("newInstructionText").value.trim();
  
  if (!text) {
    showToast("Please enter instruction text", "error");
    return;
  }
  
  const smName = state.loggedInSM ? state.loggedInSM.name : (state.isCOO ? 'COO' : 'Admin');
  
  const instruction = {
    id: generateId(),
    text: text,
    createdDate: formatISTDate(),
    createdBySM: smName,
    createdTime: formatISTTimeHHMMSS()
  };
  
  const created = await createInstructionApi(instruction);
  if (created) {
    state.instructions.push(created);
    closeDialog("addInstructionDialog");
    showToast("Instruction added successfully");
    render();
  }
}

async function deleteInstruction(instructionId) {
  if (confirm("Are you sure you want to delete this instruction?")) {
    const inst = state.instructions.find(i => i.id === instructionId);
    await deleteInstructionApi(instructionId, inst?.airtableRecordId);
    state.instructions = state.instructions.filter(i => i.id !== instructionId);
    showToast("Instruction deleted");
    render();
  }
}

function renderAdminShiftReportsTab() {
  const today = new Date().toISOString().split('T')[0];
  // SM sees only shift reports for their assigned stations
  const assignedStations = getAdminAssignedStations();
  const assignedStationIds = assignedStations.map(s => s.id);
  const filteredReports = state.isCOO ? state.shiftReports : state.shiftReports.filter(r => assignedStationIds.includes(r.stationId));
  const stationsForFilter = state.isCOO ? state.stations : assignedStations;
  
  return `
    <div class="page-header">
      <h1 class="page-title">Shift Reports</h1>
      <div class="flex gap-3 flex-wrap">
        <div class="filter-group">
          <label class="filter-label">From Date</label>
          <input type="date" class="form-input form-input-sm" id="shiftReportFilterFromDate" max="${today}" onchange="filterShiftReports()">
        </div>
        <div class="filter-group">
          <label class="filter-label">To Date</label>
          <input type="date" class="form-input form-input-sm" id="shiftReportFilterToDate" max="${today}" onchange="filterShiftReports()">
        </div>
        <div class="filter-group">
          <label class="filter-label">Station</label>
          <select class="form-select form-select-sm" id="shiftReportFilterStation" onchange="filterShiftReports()">
            <option value="">All Stations</option>
            ${stationsForFilter.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">Shift</label>
          <select class="form-select form-select-sm" id="shiftReportFilterShift" onchange="filterShiftReports()">
            <option value="">All Shifts</option>
            <option value="A">Shift A</option>
            <option value="B">Shift B</option>
            <option value="C">Shift C</option>
          </select>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Date</th>
              <th>Station</th>
              <th>Shift</th>
              <th>SC Name</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody id="shiftReportsTableBody">
            ${renderShiftReportsRows(filteredReports)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderShiftReportsRows(reports) {
  if (reports.length === 0) {
    return `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem;">
          No shift reports found.
        </td>
      </tr>
    `;
  }
  
  return reports.map((report, index) => {
    const station = state.stations.find(s => s.id === report.stationId);
    return `
      <tr>
        <td>${index + 1}</td>
        <td>${report.date}</td>
        <td>${station ? station.name : 'Unknown'}</td>
        <td><span class="shift-badge-table">${SHIFTS[report.shift]?.name || report.shift}</span></td>
        <td>${report.scName}</td>
        <td>
          <div class="actions-cell">
            <button class="btn btn-ghost" onclick="debounceClick('viewReport${report.id}', () => viewShiftReport('${report.id}'))" title="View">
              ${icons.eye}
            </button>
            <button class="btn btn-ghost" onclick="debounceClick('exportExcel${report.id}', () => exportShiftReportExcel('${report.id}'))" title="Export Excel">
              ${icons.download}
            </button>
            <button class="btn btn-ghost" onclick="debounceClick('exportPdf${report.id}', () => exportShiftReportPDF('${report.id}'))" title="Export PDF">
              ${icons.fileText}
            </button>
            <button class="btn btn-ghost text-destructive" onclick="debounceClick('deleteReport${report.id}', () => deleteShiftReport('${report.id}'))" title="Delete">
              ${icons.trash}
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterShiftReports() {
  const stationFilter = document.getElementById('shiftReportFilterStation').value;
  const shiftFilter = document.getElementById('shiftReportFilterShift').value;
  const fromDateFilter = document.getElementById('shiftReportFilterFromDate').value;
  const toDateFilter = document.getElementById('shiftReportFilterToDate').value;
  
  // SM sees only assigned station reports
  const assignedStations = getAdminAssignedStations();
  const assignedStationIds = assignedStations.map(s => s.id);
  let filtered = state.isCOO ? [...state.shiftReports] : state.shiftReports.filter(r => assignedStationIds.includes(r.stationId));
  
  if (stationFilter) {
    filtered = filtered.filter(r => r.stationId === stationFilter);
  }
  
  if (shiftFilter) {
    filtered = filtered.filter(r => r.shift === shiftFilter);
  }
  
  if (fromDateFilter) {
    filtered = filtered.filter(r => r.date >= fromDateFilter);
  }
  
  if (toDateFilter) {
    filtered = filtered.filter(r => r.date <= toDateFilter);
  }
  
  document.getElementById('shiftReportsTableBody').innerHTML = renderShiftReportsRows(filtered);
}

function renderAdminStationView() {
  const station = state.stations.find(s => s.id === state.selectedStation);
  if (!station) return '';
  
  const allEntries = state.entries.filter(e => e.stationId === station.id);
  const filteredEntries = allEntries;
  
  return `
    <main class="main-content">
      <div class="main-overlay"></div>
      <div class="content-wrapper">
        <div class="page-header">
          <div class="flex items-center gap-4">
            <button class="btn btn-outline" onclick="debounceClick('backAdmin', goBackAdmin)">
              ${icons.arrowLeft}
              Back
            </button>
            <h1 class="page-title">${station.name}</h1>
            <div class="status-badge ${station.enabled ? 'status-active' : 'status-disabled'}">
              ${station.enabled ? 'Enabled' : 'Disabled'}
            </div>
          </div>
           <div class="flex gap-2 items-center flex-wrap">
            <button class="btn btn-outline" onclick="debounceClick('editStation${station.id}', () => openEditStationDialog('${station.id}'))">
              ${icons.edit}
              Edit Station
            </button>
            <button class="btn btn-outline" onclick="debounceClick('exportExcel${station.id}', () => exportToExcel('${station.id}'))">
              ${icons.download}
              Export to Excel
            </button>
            <button class="btn btn-primary" onclick="debounceClick('addEntry${station.id}', () => openAddEntryDialog('${station.id}'))">
              ${icons.plus}
              Add Entry
            </button>
          </div>
        </div>
        <div class="card">
          <div class="entries-summary">
            <span>All entries for: <strong>${station.name}</strong></span>
            <span class="entry-count-badge">${filteredEntries.length} entries</span>
          </div>
          <div class="table-container">
            <div class="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Sr No</th>
                    ${station.columns.filter(c => !c.isDefault).map(col => `<th>${col.name}</th>`).join("")}
                    <th>SC Name</th>
                    <th>Entry Time</th>
                    <th>Created By</th>
                    <th>Edited By</th>
                    <th>Status</th>
                    <th>Closure Remark</th>
                    <th style="text-align: right;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredEntries.length === 0 ? `
                    <tr>
                      <td colspan="${station.columns.filter(c => !c.isDefault).length + 8}" style="text-align: center; padding: 2rem;">
                        No entries found
                      </td>
                    </tr>
                  ` : filteredEntries.map((entry, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      ${station.columns.filter(c => !c.isDefault).map(col => `
                        <td>
                          ${col.type === "file" && entry.data[col.id] ? `
                            <div class="flex items-center gap-2">
                              <img src="${entry.data[col.id]}" alt="Thumbnail" class="image-thumbnail" onclick="openImagePreview('${entry.id}', '${col.id}')" />
                              <button class="btn btn-outline btn-sm" onclick="openImagePreview('${entry.id}', '${col.id}')">
                                ${icons.eye}
                              </button>
                            </div>
                          ` : col.type === "date" && entry.data[col.id] ? `
                            <span>${new Date(entry.data[col.id]).toLocaleDateString()}</span>
                          ` : col.type === "levels" ? `
                            <span class="levels-badge">${entry.data[col.id] || "-"}</span>
                          ` : `
                            <span>${entry.data[col.id] || "-"}</span>
                          `}
                        </td>
                      `).join("")}
                      <td>${entry.data['sc_name'] || getUserNameByOdId(entry.createdBy)}</td>
                      <td>${entry.data['entry_time'] || '-'}</td>
                      <td>${entry.createdDate || '-'}</td>
                      <td>${entry.editedBy ? `${getUserNameByOdId(entry.editedBy)} (${entry.editedDate || ''})` : '-'}</td>
                      <td>${renderStatusPill(entry.status)}</td>
                      <td class="closure-remark-cell">${entry.status === 'Closed' && entry.closureRemark ? `${entry.closureRemark}<br><small style="color: var(--muted-foreground);">— ${getUserNameByOdId(entry.closedBy) || entry.closedBy || ''} (${entry.closedDate || ''})</small>` : '-'}</td>
                      <td>
                        <div class="actions-cell">
                          <button class="btn btn-ghost" onclick="debounceClick('editEntry${entry.id}', () => openEditEntryDialog('${entry.id}'))">
                            ${icons.edit}
                          </button>
                          <button class="btn btn-ghost text-destructive" onclick="debounceClick('deleteEntry${entry.id}', () => deleteEntry('${entry.id}'))">
                            ${icons.trash}
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

function filterAdminEntriesByDate(dateValue) {
  state.adminEntryDateFilter = dateValue;
  render();
}

// =====================================================
// COO DASHBOARD
// =====================================================
function renderCOODashboard() {
  if (state.selectedStation) {
    return renderCOOStationView();
  }
  return `
    <main class="main-content">
      <div class="main-overlay"></div>
      <div class="content-wrapper">
        <div class="admin-tabs">
          <button class="admin-tab active" onclick="switchCOOTab('stations')" id="cooTabStations">
            ${icons.building}
            All Stations
          </button>
          <button class="admin-tab" onclick="switchCOOTab('smUsers')" id="cooTabSmUsers">
            ${icons.users}
            SM Users
          </button>
          <button class="admin-tab" onclick="switchCOOTab('stationUsers')" id="cooTabStationUsers">
            ${icons.users}
            Station Users
          </button>
          <button class="admin-tab" onclick="switchCOOTab('shiftReports')" id="cooTabShiftReports">
            ${icons.clipboard}
            Shift Reports
          </button>
          <button class="admin-tab" onclick="switchCOOTab('instructions')" id="cooTabInstructions">
            ${icons.info}
            Instructions
          </button>
        </div>
        
        <div id="cooStationsContent">
          ${renderCOOStationsTab()}
        </div>
        
        <div id="cooSmUsersContent" style="display: none;">
          ${renderCOOSMUsersTab()}
        </div>
        
        <div id="cooStationUsersContent" style="display: none;">
          ${renderCOOStationUsersTab()}
        </div>
        
        <div id="cooShiftReportsContent" style="display: none;">
          ${renderAdminShiftReportsTab()}
        </div>
        
        <div id="cooInstructionsContent" style="display: none;">
          ${renderCOOInstructionsTab()}
        </div>
      </div>
    </main>
  `;
}

function switchCOOTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  const tabMap = { stations: 'cooTabStations', smUsers: 'cooTabSmUsers', stationUsers: 'cooTabStationUsers', shiftReports: 'cooTabShiftReports', instructions: 'cooTabInstructions' };
  const tabEl = document.getElementById(tabMap[tab]);
  if (tabEl) tabEl.classList.add('active');
  
  document.getElementById('cooStationsContent').style.display = tab === 'stations' ? 'block' : 'none';
  document.getElementById('cooSmUsersContent').style.display = tab === 'smUsers' ? 'block' : 'none';
  document.getElementById('cooStationUsersContent').style.display = tab === 'stationUsers' ? 'block' : 'none';
  document.getElementById('cooShiftReportsContent').style.display = tab === 'shiftReports' ? 'block' : 'none';
  document.getElementById('cooInstructionsContent').style.display = tab === 'instructions' ? 'block' : 'none';
}

function renderCOOStationsTab() {
  return `
    <div class="page-header">
      <h1 class="page-title">COO Dashboard - All Stations</h1>
      <div class="flex gap-3">
        <button class="btn btn-merge" onclick="debounceClick('merge', openMergeStationDialog)">
          ${icons.merge}
          Merge Stations
        </button>
        <button class="btn btn-primary" onclick="debounceClick('addStation', openAddStationDialog)">
          ${icons.plus}
          Add Station
        </button>
      </div>
    </div>
    <div class="grid grid-cols-3">
      ${state.stations.map((station, index) => renderStationCard(station, index, true)).join("")}
    </div>
  `;
}

function renderCOOStationView() {
  const station = state.stations.find(s => s.id === state.selectedStation);
  if (!station) return '';
  
  const allEntries = state.entries.filter(e => e.stationId === station.id);
  const filteredEntries = allEntries;
  
  return `
    <main class="main-content">
      <div class="main-overlay"></div>
      <div class="content-wrapper">
        <div class="page-header">
          <div class="flex items-center gap-4">
            <button class="btn btn-outline" onclick="debounceClick('backCOO', goBackAdmin)">
              ${icons.arrowLeft}
              Back
            </button>
            <h1 class="page-title">${station.name}</h1>
            <div class="status-badge ${station.enabled ? 'status-active' : 'status-disabled'}">
              ${station.enabled ? 'Enabled' : 'Disabled'}
            </div>
          </div>
          <div class="flex gap-2 items-center flex-wrap">
            <button class="btn btn-outline" onclick="debounceClick('editStation${station.id}', () => openEditStationDialog('${station.id}'))">
              ${icons.edit}
              Edit Station
            </button>
            <button class="btn btn-outline" onclick="debounceClick('exportExcel${station.id}', () => exportToExcel('${station.id}'))">
              ${icons.download}
              Export to Excel
            </button>
            <button class="btn btn-primary" onclick="debounceClick('addEntry${station.id}', () => openAddEntryDialog('${station.id}'))">
              ${icons.plus}
              Add Entry
            </button>
          </div>
        </div>
        <div class="card">
          <div class="entries-summary">
            <span>All entries for: <strong>${station.name}</strong></span>
            <span class="entry-count-badge">${filteredEntries.length} entries</span>
          </div>
          <div class="table-container">
            <div class="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Sr No</th>
                    ${station.columns.filter(c => !c.isDefault).map(col => `<th>${col.name}</th>`).join("")}
                    <th>SC Name</th>
                    <th>Entry Time</th>
                    <th>Created By</th>
                    <th>Edited By</th>
                    <th>Status</th>
                    <th>Closure Remark</th>
                    <th style="text-align: right;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredEntries.length === 0 ? `
                    <tr>
                      <td colspan="${station.columns.filter(c => !c.isDefault).length + 8}" style="text-align: center; padding: 2rem;">
                        No entries found
                      </td>
                    </tr>
                  ` : filteredEntries.map((entry, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      ${station.columns.filter(c => !c.isDefault).map(col => `
                        <td>
                          ${col.type === "file" && entry.data[col.id] ? `
                            <div class="flex items-center gap-2">
                              <img src="${entry.data[col.id]}" alt="Thumbnail" class="image-thumbnail" onclick="openImagePreview('${entry.id}', '${col.id}')" />
                              <button class="btn btn-outline btn-sm" onclick="openImagePreview('${entry.id}', '${col.id}')">
                                ${icons.eye}
                              </button>
                            </div>
                          ` : col.type === "date" && entry.data[col.id] ? `
                            <span>${new Date(entry.data[col.id]).toLocaleDateString()}</span>
                          ` : col.type === "levels" ? `
                            <span class="levels-badge">${entry.data[col.id] || "-"}</span>
                          ` : `
                            <span>${entry.data[col.id] || "-"}</span>
                          `}
                        </td>
                      `).join("")}
                      <td>${entry.data['sc_name'] || getUserNameByOdId(entry.createdBy)}</td>
                      <td>${entry.data['entry_time'] || '-'}</td>
                      <td>${entry.createdDate || '-'}</td>
                      <td>${entry.editedBy ? getUserNameByOdId(entry.editedBy) + ' (' + (entry.editedDate || '') + ')' : '-'}</td>
                      <td>${renderStatusPill(entry.status)}</td>
                      <td class="closure-remark-cell">${entry.status === 'Closed' && entry.closureRemark ? `${entry.closureRemark}<br><small style="color: var(--muted-foreground);">— ${getUserNameByOdId(entry.closedBy) || entry.closedBy || ''} (${entry.closedDate || ''})</small>` : '-'}</td>
                      <td>
                        <div class="actions-cell">
                          <button class="btn btn-ghost" onclick="debounceClick('editEntry${entry.id}', () => openEditEntryDialog('${entry.id}'))">
                            ${icons.edit}
                          </button>
                          <button class="btn btn-ghost text-destructive" onclick="debounceClick('deleteEntry${entry.id}', () => deleteEntry('${entry.id}'))">
                            ${icons.trash}
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

function renderCOOSMUsersTab() {
  return `
    <div class="page-header">
      <h1 class="page-title">SM Users Management</h1>
      <button class="btn btn-primary" onclick="debounceClick('addSMUser', openAddSMUserDialog)">
        ${icons.plus}
        Register SM User
      </button>
    </div>
    <div class="card">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>SM User ID</th>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Contact No</th>
              <th>Assigned Stations</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.smUsers.length === 0 ? `
              <tr>
                <td colspan="8" style="text-align: center; padding: 2rem;">
                  No SM users registered. Click "Register SM User" to add.
                </td>
              </tr>
            ` : state.smUsers.map((user, index) => `
              <tr>
                <td>${index + 1}</td>
                <td><strong>${user.odId || '-'}</strong></td>
                <td>${user.empId || '-'}</td>
                <td>${user.name}</td>
                <td>${user.designation}</td>
                <td>${user.contactNo || '-'}</td>
                <td>${(user.assignedStations || []).map(sid => {
                  const s = state.stations.find(st => st.id === sid);
                  return s ? s.name : '';
                }).filter(Boolean).join(', ') || 'All'}</td>
                <td>
                  <div class="actions-cell">
                    <button class="btn btn-ghost" onclick="debounceClick('editSMUser${user.id}', () => openEditSMUserDialog('${user.id}'))">
                      ${icons.edit}
                    </button>
                    <button class="btn btn-ghost text-destructive" onclick="debounceClick('deleteSMUser${user.id}', () => deleteSMUser('${user.id}'))">
                      ${icons.trash}
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div class="info-card">
      <h4>SM Users Info</h4>
      <p>SM users login with their <strong>SM User ID</strong> (case-sensitive). Assign stations to limit SM access to specific stations only.</p>
    </div>
  `;
}

// COO Station Users Tab with SM filter
function renderCOOStationUsersTab() {
  return `
    <div class="page-header">
      <h1 class="page-title">Station Users (All)</h1>
      <div class="flex gap-3 items-center flex-wrap">
        <div class="filter-group">
          <label class="filter-label">${icons.users} Filter by SM</label>
          <select class="form-select form-select-sm" id="cooStationUserSMFilter" onchange="filterCOOStationUsersBySM(this.value)">
            <option value="">All SM Users</option>
            ${state.smUsers.map(sm => `<option value="${sm.id}">${sm.name}</option>`).join('')}
          </select>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>User ID</th>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Contact No</th>
              <th>Assigned Stations</th>
              <th>Under SM</th>
            </tr>
          </thead>
          <tbody id="cooStationUsersTableBody">
            ${renderCOOStationUserRows(state.stationUsers)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderCOOStationUserRows(users) {
  if (users.length === 0) {
    return '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No station users found.</td></tr>';
  }
  return users.map((user, index) => {
    // Find which SM manages this user (by station overlap)
    const userStations = user.assignedStations || [];
    const managingSMs = state.smUsers.filter(sm => {
      const smStations = sm.assignedStations || [];
      return smStations.some(sid => userStations.includes(sid));
    }).map(sm => sm.name);
    
    return `
      <tr>
        <td>${index + 1}</td>
        <td><strong>${user.odId || '-'}</strong></td>
        <td>${user.empId || '-'}</td>
        <td>${user.name}</td>
        <td>${user.designation}</td>
        <td>${user.contactNo || '-'}</td>
        <td>${userStations.map(sid => {
          const s = state.stations.find(st => st.id === sid);
          return s ? s.name : '';
        }).filter(Boolean).join(', ') || 'All'}</td>
        <td>${managingSMs.length > 0 ? managingSMs.join(', ') : '-'}</td>
      </tr>
    `;
  }).join('');
}

function filterCOOStationUsersBySM(smId) {
  let filtered = [...state.stationUsers];
  if (smId) {
    const sm = state.smUsers.find(u => u.id === smId);
    if (sm && sm.assignedStations && sm.assignedStations.length > 0) {
      filtered = state.stationUsers.filter(u => {
        const userStations = u.assignedStations || [];
        return userStations.some(sid => sm.assignedStations.includes(sid));
      });
    }
  }
  document.getElementById('cooStationUsersTableBody').innerHTML = renderCOOStationUserRows(filtered);
}

function renderCOOInstructionsTab() {
  const today = new Date().toISOString().split('T')[0];
  return `
    <div class="page-header">
      <h1 class="page-title">All Instructions</h1>
      <div class="flex gap-3 items-center flex-wrap">
        <div class="filter-group">
          <label class="filter-label">${icons.calendar} Date Filter</label>
          <input type="date" class="form-input form-input-sm" id="cooInstructionDateFilter" max="${today}" onchange="filterCOOInstructionsByDate(this.value)">
        </div>
        <button class="btn btn-primary" onclick="debounceClick('addCOOInstruction', openAddInstructionDialog)">
          ${icons.plus}
          Add COO Instruction
        </button>
      </div>
    </div>
    <div class="card">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Instruction Text</th>
              <th>SM Name</th>
              <th>Created Date</th>
              <th>Time</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody id="cooInstructionsTableBody">
            ${renderCOOInstructionRows(state.instructions)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderCOOInstructionRows(instructions) {
  if (instructions.length === 0) {
    return '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No instructions found.</td></tr>';
  }
  return instructions.map((inst, index) => `
    <tr ${inst.createdBySM === 'COO' ? 'style="background: rgba(218, 165, 32, 0.1);"' : ''}>
      <td>${index + 1}</td>
      <td ${inst.createdBySM === 'COO' ? 'style="color: #DAA520; font-weight: bold;"' : ''}>${inst.createdBySM === 'COO' ? '⭐ ' : ''}${inst.text}</td>
      <td><strong ${inst.createdBySM === 'COO' ? 'style="color: #DAA520;"' : ''}>${inst.createdBySM || '-'}</strong></td>
      <td>${inst.createdDate || '-'}</td>
      <td>${inst.createdTime || '-'}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-ghost text-destructive" onclick="debounceClick('deleteInst${inst.id}', () => deleteInstruction('${inst.id}'))">
            ${icons.trash}
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterCOOInstructionsByDate(dateValue) {
  let filtered = [...state.instructions];
  if (dateValue) {
    filtered = filtered.filter(i => i.createdDate === dateValue);
  }
  document.getElementById('cooInstructionsTableBody').innerHTML = renderCOOInstructionRows(filtered);
}

// SM User Management
let editingSMUserId = null;

function openAddSMUserDialog() {
  render();
  setTimeout(() => {
    document.getElementById("newSMUserOdId").value = "";
    document.getElementById("newSMUserEmpId").value = "";
    document.getElementById("newSMUserName").value = "";
    document.getElementById("newSMUserDesignation").value = "";
    document.getElementById("newSMUserContactNo").value = "";
    document.querySelectorAll('.new-sm-user-station-cb').forEach(cb => cb.checked = false);
    openDialog("addSMUserDialog");
  }, 50);
}

async function createSMUser() {
  const odId = document.getElementById("newSMUserOdId").value.trim();
  const empId = document.getElementById("newSMUserEmpId").value.trim();
  const name = document.getElementById("newSMUserName").value.trim();
  const designation = document.getElementById("newSMUserDesignation").value.trim();
  const contactNo = document.getElementById("newSMUserContactNo").value.trim();
  const assignedStations = Array.from(document.querySelectorAll('.new-sm-user-station-cb:checked')).map(cb => cb.value);
  
  if (!odId || !name || !designation) {
    showToast("Please fill SM User ID, Name and Designation", "error");
    return;
  }
  
  if (state.smUsers.find(u => u.odId === odId)) {
    showToast("SM User ID already exists", "error");
    return;
  }
  
  const user = {
    id: generateId(),
    odId: odId,
    empId: empId,
    name: name,
    designation: designation,
    contactNo: contactNo,
    assignedStations: assignedStations
  };
  
  const created = await createSMUserApi(user);
  if (created) {
    state.smUsers.push(created);
    closeDialog("addSMUserDialog");
    showToast("SM User registered successfully");
    render();
  }
}

function openEditSMUserDialog(userId) {
  const user = state.smUsers.find(u => u.id === userId);
  if (!user) return;
  
  editingSMUserId = userId;
  document.getElementById("editSMUserOdId").value = user.odId || '';
  document.getElementById("editSMUserEmpId").value = user.empId || '';
  document.getElementById("editSMUserName").value = user.name;
  document.getElementById("editSMUserDesignation").value = user.designation;
  document.getElementById("editSMUserContactNo").value = user.contactNo || '';
  
  const listEl = document.getElementById("editSMUserStationsList");
  if (listEl) {
    listEl.innerHTML = state.stations.map(s => `
      <label class="station-checkbox-item">
        <input type="checkbox" value="${s.id}" class="edit-sm-user-station-cb" ${(user.assignedStations || []).includes(s.id) ? 'checked' : ''}>
        <span>${s.name}</span>
      </label>
    `).join('');
  }
  
  openDialog("editSMUserDialog");
}

async function saveSMUserEdit() {
  const odId = document.getElementById("editSMUserOdId").value.trim();
  const empId = document.getElementById("editSMUserEmpId").value.trim();
  const name = document.getElementById("editSMUserName").value.trim();
  const designation = document.getElementById("editSMUserDesignation").value.trim();
  const contactNo = document.getElementById("editSMUserContactNo").value.trim();
  const assignedStations = Array.from(document.querySelectorAll('.edit-sm-user-station-cb:checked')).map(cb => cb.value);
  
  if (!odId || !name || !designation) {
    showToast("Please fill SM User ID, Name and Designation", "error");
    return;
  }
  
  const user = state.smUsers.find(u => u.id === editingSMUserId);
  if (user) {
    user.odId = odId;
    user.empId = empId;
    user.name = name;
    user.designation = designation;
    user.contactNo = contactNo;
    user.assignedStations = assignedStations;
    await updateSMUserApi(user);
    closeDialog("editSMUserDialog");
    showToast("SM User updated successfully");
    render();
  }
}

async function deleteSMUser(userId) {
  if (confirm("Are you sure you want to delete this SM user?")) {
    const user = state.smUsers.find(u => u.id === userId);
    await deleteSMUserApi(userId, user?.airtableRecordId);
    state.smUsers = state.smUsers.filter(u => u.id !== userId);
    showToast("SM User deleted");
    render();
  }
}

function renderControllerDashboard() {
  const station = state.stations.find(s => s.id === state.selectedStation);
  
  if (!station) {
    return `
      <main class="main-content">
        <div class="main-overlay"></div>
        <div class="content-wrapper">
          <div class="card">
            <div class="empty-state">
              <h3 class="empty-state-title">Station Not Found</h3>
              <p class="empty-state-text">Please log in again to select a station.</p>
            </div>
          </div>
        </div>
      </main>
    `;
  }
  
  const currentDate = formatISTDate();
  // Station user dashboard: hide Closed entries from station view (they remain visible to SM/COO)
  const allStationEntries = state.entries.filter(e => e.stationId === station.id && e.status !== 'Closed');
  const shiftInfo = state.selectedShift ? SHIFTS[state.selectedShift] : null;
  
  const existingReport = state.shiftReports.find(r => 
    r.stationId === station.id && 
    r.date === currentDate && 
    r.shift === state.selectedShift
  );
  
  const todaysEntries = allStationEntries.filter(e => e.createdDate === currentDate);
  
  // Get instructions for this user (COO + assigned SM)
  const userInstructions = getInstructionsForController();
  
  return `
    <main class="main-content">
      <div class="main-overlay"></div>
      <div class="content-wrapper">
        <div class="controller-header">
          <div class="station-info-card">
            <h2>${station.name}</h2>
            <div class="station-meta">
              <span class="meta-item">${icons.clock} ${shiftInfo ? shiftInfo.name : 'No Shift'} (${shiftInfo ? shiftInfo.label : ''})</span>
              <span class="meta-item">${icons.clipboard} Date: ${currentDate}</span>
            </div>
          </div>
        </div>
        
        <div class="controller-tabs">
          <button class="controller-tab active" onclick="switchControllerTab('hazard')" id="ctrlTabHazard">
            ${icons.alertTriangle}
            Hazard Entries
          </button>
          <button class="controller-tab" onclick="switchControllerTab('shift')" id="ctrlTabShift">
            ${icons.clipboard}
            Shift Report
          </button>
          <button class="controller-tab" onclick="switchControllerTab('instructions')" id="ctrlTabInstructions">
            ${icons.info}
            Instructions
          </button>
        </div>
        
        <div id="hazardEntriesContent">
          <div class="page-header">
            <h1 class="page-title">PUNERI METRO Entries</h1>
            <div class="flex gap-3 items-center flex-wrap">
              <button class="btn btn-accent" onclick="debounceClick('addEntry', () => openAddEntryDialog('${station.id}'))">
                ${icons.plus}
                Add Entry
              </button>
            </div>
          </div>
          <div class="card">
            <div class="entries-summary">
              <span>All entries for: <strong>${station.name}</strong></span>
              <span class="entry-count-badge">${allStationEntries.length} entries</span>
            </div>
            <div class="table-container">
              <div class="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      ${station.columns.filter(c => !c.isDefault).map(col => `<th>${col.name}</th>`).join("")}
                      <th>SC Name</th>
                      <th>Entry Time</th>
                      <th>Date</th>
                      <th>Edited By</th>
                      <th>Status</th>
                      <th style="text-align: right;">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${allStationEntries.length === 0 ? `
                      <tr>
                        <td colspan="${station.columns.filter(c => !c.isDefault).length + 7}" style="text-align: center; padding: 2rem;">
                          No entries found
                        </td>
                      </tr>
                    ` : allStationEntries.map((entry, index) => {
                      const canEdit = entry.createdBy === state.loggedInUser?.odId;
                      const currentStatus = entry.status || 'Open';
                      return `
                      <tr>
                        <td>${index + 1}</td>
                        ${station.columns.filter(c => !c.isDefault).map(col => `
                          <td>
                            ${col.type === "file" && entry.data[col.id] ? `
                              <div class="flex items-center gap-2">
                                <img src="${entry.data[col.id]}" alt="Thumbnail" class="image-thumbnail" onclick="openImagePreview('${entry.id}', '${col.id}')" />
                                <button class="btn btn-outline btn-sm" onclick="openImagePreview('${entry.id}', '${col.id}')">
                                  ${icons.eye}
                                </button>
                              </div>
                            ` : col.type === "date" && entry.data[col.id] ? `
                              <span>${new Date(entry.data[col.id]).toLocaleDateString()}</span>
                            ` : col.type === "levels" ? `
                              <span class="levels-badge">${entry.data[col.id] || "-"}</span>
                            ` : `
                              <span>${entry.data[col.id] || "-"}</span>
                            `}
                          </td>
                        `).join("")}
                        <td>${entry.data['sc_name'] || getUserNameByOdId(entry.createdBy)}</td>
                        <td>${entry.data['entry_time'] || '-'}</td>
                        <td>${entry.createdDate || '-'}</td>
                        <td>${entry.editedBy ? `${getUserNameByOdId(entry.editedBy)} (${entry.editedDate || ''})` : '-'}</td>
                        <td>
                          <select class="status-select" onchange="handleControllerStatusChange('${entry.id}', this.value, this)">
                            <option value="Open" ${currentStatus === 'Open' ? 'selected' : ''}>Open</option>
                            <option value="In Progress" ${currentStatus === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Closed" ${currentStatus === 'Closed' ? 'selected' : ''}>Closed</option>
                          </select>
                        </td>
                        <td>
                          <div class="actions-cell">
                            ${canEdit ? `
                              <button class="btn btn-ghost" onclick="debounceClick('editEntry${entry.id}', () => openEditEntryDialogController('${entry.id}'))" title="Edit your entry">
                                ${icons.edit}
                              </button>
                            ` : `
                              <span class="no-edit-badge" title="You can only edit your own entries">View Only</span>
                            `}
                          </div>
                        </td>
                      </tr>
                    `}).join("")}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div id="shiftReportContent" style="display: none;">
          ${renderShiftReportForm(station, existingReport, todaysEntries)}
        </div>
        
        <div id="instructionsContent" style="display: none;">
          ${renderControllerInstructionsTab(userInstructions)}
        </div>
      </div>
    </main>
  `;
}

function filterEntriesByDate(dateValue) {
  state.entryDateFilter = dateValue;
  render();
}

function switchControllerTab(tab) {
  document.querySelectorAll('.controller-tab').forEach(t => t.classList.remove('active'));
  const tabId = `ctrlTab${tab.charAt(0).toUpperCase() + tab.slice(1)}`;
  const tabEl = document.getElementById(tabId);
  if (tabEl) tabEl.classList.add('active');
  
  document.getElementById('hazardEntriesContent').style.display = tab === 'hazard' ? 'block' : 'none';
  document.getElementById('shiftReportContent').style.display = tab === 'shift' ? 'block' : 'none';
  const instrContent = document.getElementById('instructionsContent');
  if (instrContent) instrContent.style.display = tab === 'instructions' ? 'block' : 'none';
}

// Get instructions relevant to the current station user
function getInstructionsForController() {
  const user = state.loggedInUser;
  if (!user) return [];
  
  // COO instructions always visible
  const cooInstructions = state.instructions.filter(i => i.createdBySM === 'COO');
  
  // SM instructions - only from the SM who manages this user's stations
  let smInstructions = [];
  if (user.assignedStations && user.assignedStations.length > 0) {
    const smNames = [];
    for (const sm of state.smUsers) {
      if (sm.assignedStations && sm.assignedStations.length > 0) {
        const overlap = sm.assignedStations.some(sid => user.assignedStations.includes(sid));
        if (overlap) smNames.push(sm.name);
      }
    }
    if (smNames.length > 0) {
      smInstructions = state.instructions.filter(inst => inst.createdBySM !== 'COO' && smNames.includes(inst.createdBySM));
    }
  } else {
    smInstructions = state.instructions.filter(i => i.createdBySM !== 'COO');
  }
  
  return [...cooInstructions, ...smInstructions];
}

// Render controller instructions tab
function renderControllerInstructionsTab(instructions) {
  const cooInstructions = instructions.filter(i => i.createdBySM === 'COO');
  const smInstructions = instructions.filter(i => i.createdBySM !== 'COO');
  
  return `
    <div class="page-header">
      <h1 class="page-title">Instructions</h1>
    </div>
    <div class="card">
      ${cooInstructions.length > 0 ? `
        <h4 style="padding: 1rem 1rem 0; color: #DAA520; font-weight: bold;">⭐ COO Instructions</h4>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Instruction</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              ${cooInstructions.map((inst, idx) => `
                <tr style="background: rgba(218, 165, 32, 0.1);">
                  <td>${idx + 1}</td>
                  <td style="color: #DAA520; font-weight: bold;">${inst.text}</td>
                  <td>${inst.createdDate || '-'}</td>
                  <td>${inst.createdTime || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}
      ${smInstructions.length > 0 ? `
        <h4 style="padding: 1rem 1rem 0;">SM Instructions</h4>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Instruction</th>
                <th>By SM</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              ${smInstructions.map((inst, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${inst.text}</td>
                  <td>${inst.createdBySM || '-'}</td>
                  <td>${inst.createdDate || '-'}</td>
                  <td>${inst.createdTime || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}
      ${instructions.length === 0 ? '<p style="padding: 2rem; text-align: center;">No instructions available.</p>' : ''}
    </div>
  `;
}

// =====================================================
// SHIFT REPORT FORM
// =====================================================
let shiftReportData = {
  stationStaff: [{ type: '', company: '', count: '', persons: [] }],
  equipment: [{ name: '', status: '', remark: '' }],
  ptw: [{ ptwNo: '', contractor: '', picName: '', persons: '', nature: '', impact: '', startTime: '', endTime: '', closureRemark: '' }],
  workInProgress: '',
  mockDrillDetails: '',
  riskObserved: '',
  vipVisit: '',
  suggestImprovements: '',
  attachmentImage: '',
  hazardEntries: []
};

function renderShiftReportForm(station, existingReport, todaysEntries) {
  const shiftInfo = state.selectedShift ? SHIFTS[state.selectedShift] : null;
  const reportData = existingReport ? existingReport.data : {};
  
  if (existingReport && existingReport.data) {
    shiftReportData = { ...shiftReportData, ...existingReport.data };
  } else {
    shiftReportData = {
      stationStaff: [{ type: '', company: '', count: '', persons: [] }],
      equipment: [{ name: '', status: '', remark: '' }],
      ptw: [{ ptwNo: '', contractor: '', picName: '', persons: '', nature: '', impact: '', startTime: '', endTime: '', closureRemark: '' }],
      workInProgress: '',
      mockDrillDetails: '',
      riskObserved: '',
      vipVisit: '',
      suggestImprovements: '',
      attachmentImage: '',
      hazardEntries: []
    };
  }
  
  return `
    <div class="page-header">
      <h1 class="page-title">Shift Report - ${shiftInfo ? shiftInfo.name : ''}</h1>
      <button class="btn btn-primary" onclick="debounceClick('saveReport', saveShiftReport)">
        ${icons.clipboard}
        ${existingReport ? 'Update Report' : 'Submit Report'}
      </button>
    </div>
    
    <div class="shift-report-form">
      <!-- i) Station Staff Section -->
      <div class="report-section">
        <h3 class="section-title">${icons.users} i) Station Staff</h3>
        <div id="stationStaffContainer">
          ${renderStaffEntries(reportData.stationStaff || [{ type: '', company: '', count: '', persons: [] }])}
        </div>
        <button class="btn btn-outline btn-sm" onclick="debounceClick('addStaff', addStaffEntry)" style="margin-top: 0.5rem;">
          ${icons.plus} Add Staff Entry
        </button>
      </div>
      
      <!-- ii) PTW Section -->
      <div class="report-section">
        <h3 class="section-title">${icons.fileText} ii) PTW (Permit to Work)</h3>
        <div id="ptwContainer">
          ${renderPTWEntries(reportData.ptw || [{ ptwNo: '', contractor: '', picName: '', persons: '', nature: '', impact: '', startTime: '', endTime: '', closureRemark: '' }])}
        </div>
        <button class="btn btn-outline btn-sm" onclick="debounceClick('addPTW', addPTWEntry)" style="margin-top: 0.5rem;">
          ${icons.plus} Add PTW Entry
        </button>
      </div>
      
      <!-- iii) Work in Progress Activities -->
      <div class="report-section">
        <h3 class="section-title">${icons.clipboard} iii) Work in Progress Activities</h3>
        <textarea class="form-input form-textarea" id="workInProgressInput" placeholder="Enter work in progress activities details...">${reportData.workInProgress || ''}</textarea>
      </div>
      
      <!-- iv) Essential Equipment Section -->
      <div class="report-section">
        <h3 class="section-title">${icons.building} iv) Essential Equipment</h3>
        <div id="equipmentContainer">
          ${renderEquipmentEntries(reportData.equipment || [{ name: '', status: '', remark: '' }])}
        </div>
        <button class="btn btn-outline btn-sm" onclick="debounceClick('addEquipment', addEquipmentEntry)" style="margin-top: 0.5rem;">
          ${icons.plus} Add Equipment
        </button>
      </div>
      
      <!-- v) Performed Mock Drill Details -->
      <div class="report-section">
        <h3 class="section-title">${icons.alertTriangle} v) Performed Mock Drill Details</h3>
        <textarea class="form-input form-textarea" id="mockDrillInput" placeholder="Enter performed mock drill details...">${reportData.mockDrillDetails || ''}</textarea>
      </div>
      
      <!-- vi) Risk Observed -->
      <div class="report-section">
        <h3 class="section-title">${icons.alertTriangle} vi) Risk Observed</h3>
        <textarea class="form-input form-textarea" id="riskObservedInput" placeholder="Enter risk observed details...">${reportData.riskObserved || ''}</textarea>
      </div>
      
      <!-- vii) VIP/Others Visit at Station -->
      <div class="report-section">
        <h3 class="section-title">${icons.users} vii) VIP/Others Visit at Station</h3>
        <textarea class="form-input form-textarea" id="vipVisitInput" placeholder="Enter VIP/Others visit details...">${reportData.vipVisit || ''}</textarea>
      </div>
      
      <!-- viii) Today's Hazard Entries Summary -->
      <div class="report-section">
        <h3 class="section-title">${icons.alertTriangle} viii) Today's Hazard Entries (${todaysEntries.length})</h3>
        <div class="hazard-entries-summary">
          ${todaysEntries.length === 0 ? '<p class="no-entries-msg">No hazard entries added today</p>' : `
            <table class="table-custom" style="width:100%;border-collapse:collapse;font-size:0.85rem;">
              <thead>
                <tr>
                  <th style="border:1px solid #ddd;padding:6px;background:#003366;color:#fff;">Sr No</th>
                  ${station.columns.filter(c => !c.isDefault).map(col => `<th style="border:1px solid #ddd;padding:6px;background:#003366;color:#fff;">${col.name}</th>`).join('')}
                  <th style="border:1px solid #ddd;padding:6px;background:#003366;color:#fff;">Created By</th>
                </tr>
              </thead>
              <tbody>
                ${todaysEntries.map((entry, idx) => `
                  <tr>
                    <td style="border:1px solid #ddd;padding:6px;text-align:center;">${idx + 1}</td>
                    ${station.columns.filter(c => !c.isDefault).map(col => `<td style="border:1px solid #ddd;padding:6px;">${col.type === 'file' && entry.data[col.id] ? '<em>[Image]</em>' : (entry.data[col.id] || '-')}</td>`).join('')}
                    <td style="border:1px solid #ddd;padding:6px;">${getUserNameByOdId(entry.createdBy)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>
      </div>
      
      <!-- ix) Suggest Improvements -->
      <div class="report-section">
        <h3 class="section-title">${icons.info} Suggest Improvements in Station Operations (Ideas)</h3>
        <textarea class="form-input form-textarea" id="suggestImprovementsInput" placeholder="Enter suggestions for improvement...">${reportData.suggestImprovements || ''}</textarea>
      </div>
      
      <!-- ix) Attachment (Image) -->
      <div class="report-section">
        <h3 class="section-title">${icons.paperclip} ix) Attachment (Image)</h3>
        <input type="file" class="form-input" accept="image/*" onchange="handleReportAttachment(this)">
        <div id="reportAttachmentStatus" style="margin-top: 0.25rem; font-size: 0.75rem; color: var(--muted-foreground);"></div>
        ${(reportData.attachmentImage || shiftReportData.attachmentImage) ? `
          <img src="${reportData.attachmentImage || shiftReportData.attachmentImage}" alt="Attachment Preview" style="width: 200px; height: 200px; object-fit: cover; border-radius: 0.5rem; margin-top: 0.5rem; border: 1px solid var(--border); cursor: pointer;" onclick="openReportImagePreview()">
        ` : ''}
      </div>
    </div>
  `;
}

function handleReportAttachment(input) {
  const file = input.files?.[0];
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    showToast("Please upload an image file", "error");
    return;
  }
  
  const statusEl = document.getElementById('reportAttachmentStatus');
  if (statusEl) statusEl.textContent = "Processing image...";
  
  compressImage(file, (compressedBase64) => {
    if (compressedBase64.length > MAX_IMAGE_SIZE) {
      showToast("Image too large. Please use a smaller image.", "error");
      if (statusEl) statusEl.textContent = "Image too large!";
      return;
    }
    
    shiftReportData.attachmentImage = compressedBase64;
    if (statusEl) statusEl.textContent = "Image ready!";
  });
}

function openReportImagePreview() {
  const imgSrc = shiftReportData.attachmentImage;
  if (imgSrc) {
    document.getElementById("previewImage").src = imgSrc;
    openDialog("imagePreviewDialog");
  }
}

function renderStaffEntries(entries) {
  return entries.map((entry, index) => {
    const count = parseInt(entry.count) || 0;
    // Ensure persons array matches count
    if (!entry.persons) entry.persons = [];
    while (entry.persons.length < count) {
      entry.persons.push({ name: '', contactNo: '', location: '' });
    }
    
    return `
    <div class="staff-entry-block" data-index="${index}">
      <div class="staff-entry">
        <select class="form-select" onchange="updateStaffEntry(${index}, 'type', this.value)">
          <option value="">Select Type</option>
          <option value="Security" ${entry.type === 'Security' ? 'selected' : ''}>Security</option>
          <option value="HK" ${entry.type === 'HK' ? 'selected' : ''}>HK</option>
          <option value="Other Contractor" ${entry.type === 'Other Contractor' ? 'selected' : ''}>Other Contractor</option>
        </select>
        <input type="text" class="form-input" placeholder="Company Name" value="${entry.company || ''}" onchange="updateStaffEntry(${index}, 'company', this.value)">
        <input type="number" class="form-input" placeholder="Count" value="${entry.count || ''}" min="0" max="50" onchange="updateStaffCount(${index}, this.value)">
        ${index > 0 ? `<button class="btn btn-ghost text-destructive" onclick="removeStaffEntry(${index})">${icons.trash}</button>` : ''}
      </div>
      ${count > 0 ? `
        <div class="staff-persons-container">
          <div class="staff-persons-header">
            <span>Person Details (${count})</span>
          </div>
          <table class="mini-table staff-persons-table">
            <thead>
              <tr><th>#</th><th>Person Name</th><th>Contact Number</th><th>Location</th></tr>
            </thead>
            <tbody>
              ${entry.persons.slice(0, count).map((p, pIdx) => `
                <tr>
                  <td>${pIdx + 1}</td>
                  <td><input type="text" class="form-input form-input-sm" placeholder="Name" value="${p.name || ''}" onchange="updateStaffPerson(${index}, ${pIdx}, 'name', this.value)"></td>
                  <td><input type="text" class="form-input form-input-sm" placeholder="Contact No" value="${p.contactNo || ''}" onchange="updateStaffPerson(${index}, ${pIdx}, 'contactNo', this.value)"></td>
                  <td><input type="text" class="form-input form-input-sm" placeholder="Location" value="${p.location || ''}" onchange="updateStaffPerson(${index}, ${pIdx}, 'location', this.value)"></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}
    </div>
  `}).join('');
}

function renderEquipmentEntries(entries) {
  return entries.map((entry, index) => `
    <div class="equipment-entry" data-index="${index}">
      <input type="text" class="form-input" placeholder="Equipment Name" value="${entry.name || ''}" onchange="updateEquipmentEntry(${index}, 'name', this.value)">
      <select class="form-select" onchange="updateEquipmentEntry(${index}, 'status', this.value)">
        <option value="">Select Status</option>
        ${EQUIPMENT_STATUS_OPTIONS.map(opt => `<option value="${opt}" ${entry.status === opt ? 'selected' : ''}>${opt}</option>`).join('')}
      </select>
      <input type="text" class="form-input" placeholder="Remark" value="${entry.remark || ''}" onchange="updateEquipmentEntry(${index}, 'remark', this.value)">
      ${index > 0 ? `<button class="btn btn-ghost text-destructive" onclick="removeEquipmentEntry(${index})">${icons.trash}</button>` : ''}
    </div>
  `).join('');
}

function renderPTWEntries(entries) {
  return entries.map((entry, index) => `
    <div class="ptw-entry" data-index="${index}">
      <div class="ptw-row">
        <input type="text" class="form-input" placeholder="PTW No" value="${entry.ptwNo || ''}" onchange="updatePTWEntry(${index}, 'ptwNo', this.value)">
        <input type="text" class="form-input" placeholder="Contractor" value="${entry.contractor || ''}" onchange="updatePTWEntry(${index}, 'contractor', this.value)">
        <input type="text" class="form-input" placeholder="PIC Name" value="${entry.picName || ''}" onchange="updatePTWEntry(${index}, 'picName', this.value)">
        <input type="number" class="form-input" placeholder="Persons" value="${entry.persons || ''}" onchange="updatePTWEntry(${index}, 'persons', this.value)">
      </div>
      <div class="ptw-row">
        <input type="text" class="form-input" placeholder="Nature of Work" value="${entry.nature || ''}" onchange="updatePTWEntry(${index}, 'nature', this.value)">
        <input type="text" class="form-input" placeholder="Impact" value="${entry.impact || ''}" onchange="updatePTWEntry(${index}, 'impact', this.value)">
        <input type="time" class="form-input" placeholder="Start Time" value="${entry.startTime || ''}" onchange="updatePTWEntry(${index}, 'startTime', this.value)">
        <input type="time" class="form-input" placeholder="End Time" value="${entry.endTime || ''}" onchange="updatePTWEntry(${index}, 'endTime', this.value)">
      </div>
      <div class="ptw-row">
        <textarea class="form-input form-textarea-sm" placeholder="Closure Remark" onchange="updatePTWEntry(${index}, 'closureRemark', this.value)">${entry.closureRemark || ''}</textarea>
        ${index > 0 ? `<button class="btn btn-ghost text-destructive" onclick="removePTWEntry(${index})">${icons.trash}</button>` : ''}
      </div>
    </div>
  `).join('');
}

// Staff entry handlers
function addStaffEntry() {
  shiftReportData.stationStaff.push({ type: '', company: '', count: '', persons: [] });
  document.getElementById('stationStaffContainer').innerHTML = renderStaffEntries(shiftReportData.stationStaff);
}

function updateStaffEntry(index, field, value) {
  shiftReportData.stationStaff[index][field] = value;
}

function updateStaffCount(index, value) {
  const count = parseInt(value) || 0;
  shiftReportData.stationStaff[index].count = value;
  if (!shiftReportData.stationStaff[index].persons) {
    shiftReportData.stationStaff[index].persons = [];
  }
  // Ensure persons array matches count
  while (shiftReportData.stationStaff[index].persons.length < count) {
    shiftReportData.stationStaff[index].persons.push({ name: '', contactNo: '', location: '' });
  }
  document.getElementById('stationStaffContainer').innerHTML = renderStaffEntries(shiftReportData.stationStaff);
}

function updateStaffPerson(staffIndex, personIndex, field, value) {
  if (!shiftReportData.stationStaff[staffIndex].persons) {
    shiftReportData.stationStaff[staffIndex].persons = [];
  }
  if (!shiftReportData.stationStaff[staffIndex].persons[personIndex]) {
    shiftReportData.stationStaff[staffIndex].persons[personIndex] = { name: '', contactNo: '', location: '' };
  }
  shiftReportData.stationStaff[staffIndex].persons[personIndex][field] = value;
}

function removeStaffEntry(index) {
  shiftReportData.stationStaff.splice(index, 1);
  document.getElementById('stationStaffContainer').innerHTML = renderStaffEntries(shiftReportData.stationStaff);
}

// Equipment entry handlers
function addEquipmentEntry() {
  shiftReportData.equipment.push({ name: '', status: '', remark: '' });
  document.getElementById('equipmentContainer').innerHTML = renderEquipmentEntries(shiftReportData.equipment);
}

function updateEquipmentEntry(index, field, value) {
  shiftReportData.equipment[index][field] = value;
}

function removeEquipmentEntry(index) {
  shiftReportData.equipment.splice(index, 1);
  document.getElementById('equipmentContainer').innerHTML = renderEquipmentEntries(shiftReportData.equipment);
}

// PTW entry handlers
function addPTWEntry() {
  shiftReportData.ptw.push({ ptwNo: '', contractor: '', picName: '', persons: '', nature: '', impact: '', startTime: '', endTime: '', closureRemark: '' });
  document.getElementById('ptwContainer').innerHTML = renderPTWEntries(shiftReportData.ptw);
}

function updatePTWEntry(index, field, value) {
  shiftReportData.ptw[index][field] = value;
}

function removePTWEntry(index) {
  shiftReportData.ptw.splice(index, 1);
  document.getElementById('ptwContainer').innerHTML = renderPTWEntries(shiftReportData.ptw);
}

// Save shift report
async function saveShiftReport() {
  const workInProgressInput = document.getElementById('workInProgressInput');
  const mockDrillInput = document.getElementById('mockDrillInput');
  const riskObservedInput = document.getElementById('riskObservedInput');
  const vipVisitInput = document.getElementById('vipVisitInput');
  const suggestImprovementsInput = document.getElementById('suggestImprovementsInput');
  
  shiftReportData.workInProgress = workInProgressInput ? workInProgressInput.value : '';
  shiftReportData.mockDrillDetails = mockDrillInput ? mockDrillInput.value : '';
  shiftReportData.riskObserved = riskObservedInput ? riskObservedInput.value : '';
  shiftReportData.vipVisit = vipVisitInput ? vipVisitInput.value : '';
  shiftReportData.suggestImprovements = suggestImprovementsInput ? suggestImprovementsInput.value : '';
  
  const currentDate = formatISTDate();
  const station = state.stations.find(s => s.id === state.selectedStation);
  const todaysEntries = state.entries.filter(e => e.stationId === state.selectedStation && e.createdDate === currentDate);
  
  // Include hazard entries with shift info and column definitions
  const hazardColumns = station ? station.columns.filter(c => !c.isDefault) : [];
  shiftReportData.hazardColumns = hazardColumns.map(c => ({ id: c.id, name: c.name, type: c.type }));
  shiftReportData.hazardEntries = todaysEntries.map(entry => ({
    id: entry.id,
    data: entry.data,
    createdBy: entry.createdBy,
    createdByName: getUserNameByOdId(entry.createdBy),
    editedBy: entry.editedBy,
    editedByName: entry.editedBy ? getUserNameByOdId(entry.editedBy) : '',
    editedDate: entry.editedDate,
    shift: state.selectedShift
  }));
  
  const existingReport = state.shiftReports.find(r => 
    r.stationId === state.selectedStation && 
    r.date === currentDate && 
    r.shift === state.selectedShift
  );
  
  if (existingReport) {
    existingReport.data = { ...shiftReportData };
    await updateShiftReportApi(existingReport);
    showToast("Shift report updated successfully");
  } else {
    const newReport = {
      id: generateId(),
      stationId: state.selectedStation,
      date: currentDate,
      shift: state.selectedShift,
      scName: state.loggedInUser.name,
      scEmpId: state.loggedInUser.empId,
      data: { ...shiftReportData }
    };
    
    const created = await createShiftReportApi(newReport);
    if (created) {
      state.shiftReports.push(created);
      showToast("Shift report submitted successfully");
    }
  }
}

// View shift report
function viewShiftReport(reportId) {
  const report = state.shiftReports.find(r => r.id === reportId);
  if (!report) return;
  
  const station = state.stations.find(s => s.id === report.stationId);
  const shiftInfo = SHIFTS[report.shift];
  
  const content = `
    <div class="report-view">
      <h3>Shift Report Details</h3>
      <div class="report-meta">
        <p><strong>Station:</strong> ${station ? station.name : 'Unknown'}</p>
        <p><strong>Date:</strong> ${report.date}</p>
        <p><strong>Shift:</strong> ${shiftInfo ? shiftInfo.name : report.shift} (${shiftInfo ? shiftInfo.label : ''})</p>
        <p><strong>SC Name:</strong> ${report.scName}</p>
        <p><strong>SC EMP ID:</strong> ${report.scEmpId}</p>
      </div>
      
      <h4>i) Station Staff</h4>
      <table class="mini-table">
        <thead><tr><th>Type</th><th>Company</th><th>Count</th></tr></thead>
        <tbody>
          ${(report.data.stationStaff || []).map(s => `
            <tr><td>${s.type}</td><td>${s.company}</td><td>${s.count}</td></tr>
            ${s.persons && s.persons.length > 0 ? `
              <tr><td colspan="3">
                <table class="mini-table" style="margin: 0.25rem 0;">
                  <thead><tr><th>#</th><th>Name</th><th>Contact</th><th>Location</th></tr></thead>
                  <tbody>${s.persons.filter(p => p.name).map((p, i) => `<tr><td>${i+1}</td><td>${p.name}</td><td>${p.contactNo || '-'}</td><td>${p.location || '-'}</td></tr>`).join('')}</tbody>
                </table>
              </td></tr>
            ` : ''}`).join('')}
        </tbody>
      </table>
      
      <h4>ii) PTW (Permit to Work)</h4>
      <table class="mini-table">
        <thead><tr><th>PTW No</th><th>Contractor</th><th>PIC</th><th>Persons</th><th>Nature</th><th>Impact</th><th>Start</th><th>End</th><th>Closure</th></tr></thead>
        <tbody>
          ${(report.data.ptw || []).map(p => `<tr><td>${p.ptwNo}</td><td>${p.contractor}</td><td>${p.picName}</td><td>${p.persons}</td><td>${p.nature}</td><td>${p.impact}</td><td>${p.startTime}</td><td>${p.endTime}</td><td>${p.closureRemark}</td></tr>`).join('')}
        </tbody>
      </table>
      
      <h4>iii) Work in Progress Activities</h4>
      <p>${report.data.workInProgress || 'No data'}</p>
      
      <h4>iv) Essential Equipment</h4>
      <table class="mini-table">
        <thead><tr><th>Name</th><th>Status</th><th>Remark</th></tr></thead>
        <tbody>
          ${(report.data.equipment || []).map(e => `<tr><td>${e.name}</td><td>${e.status}</td><td>${e.remark}</td></tr>`).join('')}
        </tbody>
      </table>
      
      <h4>v) Performed Mock Drill Details</h4>
      <p>${report.data.mockDrillDetails || 'No data'}</p>
      
      <h4>vi) Risk Observed</h4>
      <p>${report.data.riskObserved || 'No data'}</p>
      
      <h4>vii) VIP/Others Visit at Station</h4>
      <p>${report.data.vipVisit || 'No data'}</p>
      
      ${report.data.hazardEntries && report.data.hazardEntries.length > 0 ? `
        <h4>viii) Hazard Entries (${report.data.hazardEntries.length})</h4>
        <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
          <thead>
            <tr>
              <th style="border:1px solid #ddd;padding:6px;background:#003366;color:#fff;">Sr No</th>
              ${(report.data.hazardColumns || []).map(col => `<th style="border:1px solid #ddd;padding:6px;background:#003366;color:#fff;">${col.name}</th>`).join('')}
              <th style="border:1px solid #ddd;padding:6px;background:#003366;color:#fff;">Created By</th>
            </tr>
          </thead>
          <tbody>
            ${report.data.hazardEntries.map((entry, idx) => `
              <tr>
                <td style="border:1px solid #ddd;padding:6px;text-align:center;">${idx + 1}</td>
                ${(report.data.hazardColumns || []).map(col => `<td style="border:1px solid #ddd;padding:6px;">${col.type === 'file' && entry.data[col.id] ? '<em>[Image]</em>' : (entry.data[col.id] || '-')}</td>`).join('')}
                <td style="border:1px solid #ddd;padding:6px;">${entry.createdByName || entry.createdBy || 'Unknown'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<h4>viii) Hazard Entries</h4><p>No hazard entries</p>'}
      
      <h4>Suggest Improvements</h4>
      <p>${report.data.suggestImprovements || 'No data'}</p>
      
      <h4>ix) Attachment</h4>
      ${report.data.attachmentImage ? `<img src="${report.data.attachmentImage}" alt="Attachment" style="max-width: 300px; border-radius: 0.5rem; border: 1px solid #ddd;">` : '<p>No attachment</p>'}
    </div>
  `;
  
  document.getElementById('viewReportContent').innerHTML = content;
  openDialog('viewReportDialog');
}

async function deleteShiftReport(reportId) {
  if (confirm("Are you sure you want to delete this shift report?")) {
    const report = state.shiftReports.find(r => r.id === reportId);
    await deleteShiftReportApi(reportId, report?.airtableRecordId);
    state.shiftReports = state.shiftReports.filter(r => r.id !== reportId);
    showToast("Shift report deleted");
    render();
  }
}

// Export shift report to Excel
async function exportShiftReportExcel(reportId) {
  const report = state.shiftReports.find(r => r.id === reportId);
  if (!report) return;
  
  const station = state.stations.find(s => s.id === report.stationId);
  const shiftInfo = SHIFTS[report.shift];
  
  showToast("Generating Excel...");
  
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Shift Report');
    
    worksheet.addRow(['SHIFT REPORT']).font = { bold: true, size: 16 };
    worksheet.addRow([station ? station.name : 'Unknown Station']).font = { bold: true, size: 14 };
    worksheet.addRow([]);
    worksheet.addRow(['Date:', report.date]);
    worksheet.addRow(['Shift:', `${shiftInfo ? shiftInfo.name : report.shift} (${shiftInfo ? shiftInfo.label : ''})`]);
    worksheet.addRow(['SC Name:', report.scName]);
    worksheet.addRow(['SC EMP ID:', report.scEmpId]);
    worksheet.addRow([]);
    
    // i) Station Staff
    worksheet.addRow(['i) STATION STAFF']).font = { bold: true };
    worksheet.addRow(['Type', 'Company', 'Count']);
    (report.data.stationStaff || []).forEach(s => {
      worksheet.addRow([s.type, s.company, s.count]);
      if (s.persons && s.persons.length > 0) {
        worksheet.addRow(['', 'Name', 'Contact No', 'Location']).font = { italic: true };
        s.persons.filter(p => p.name).forEach((p, i) => {
          worksheet.addRow(['', p.name, p.contactNo || '-', p.location || '-']);
        });
      }
    });
    worksheet.addRow([]);
    
    // ii) PTW
    worksheet.addRow(['ii) PTW (PERMIT TO WORK)']).font = { bold: true };
    worksheet.addRow(['PTW No', 'Contractor', 'PIC Name', 'Persons', 'Nature', 'Impact', 'Start', 'End', 'Closure']);
    (report.data.ptw || []).forEach(p => {
      worksheet.addRow([p.ptwNo, p.contractor, p.picName, p.persons, p.nature, p.impact, p.startTime, p.endTime, p.closureRemark]);
    });
    worksheet.addRow([]);
    
    // iii) Work in Progress
    worksheet.addRow(['iii) WORK IN PROGRESS ACTIVITIES']).font = { bold: true };
    worksheet.addRow([report.data.workInProgress || 'No data']);
    worksheet.addRow([]);
    
    // iv) Essential Equipment
    worksheet.addRow(['iv) ESSENTIAL EQUIPMENT']).font = { bold: true };
    worksheet.addRow(['Name', 'Status', 'Remark']);
    (report.data.equipment || []).forEach(e => {
      worksheet.addRow([e.name, e.status, e.remark]);
    });
    worksheet.addRow([]);
    
    // v) Mock Drill
    worksheet.addRow(['v) PERFORMED MOCK DRILL DETAILS']).font = { bold: true };
    worksheet.addRow([report.data.mockDrillDetails || 'No data']);
    worksheet.addRow([]);
    
    // vi) Risk Observed
    worksheet.addRow(['vi) RISK OBSERVED']).font = { bold: true };
    worksheet.addRow([report.data.riskObserved || 'No data']);
    worksheet.addRow([]);
    
    // vii) VIP Visit
    worksheet.addRow(['vii) VIP/OTHERS VISIT AT STATION']).font = { bold: true };
    worksheet.addRow([report.data.vipVisit || 'No data']);
    worksheet.addRow([]);
    
    // viii) Hazard Entries
    if (report.data.hazardEntries && report.data.hazardEntries.length > 0) {
      worksheet.addRow(['viii) HAZARD ENTRIES']).font = { bold: true };
      const hazCols = report.data.hazardColumns || [];
      const headerRow = worksheet.addRow(['SR NO', ...hazCols.map(c => c.name.toUpperCase()), 'CREATED BY']);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.eachCell(cell => { cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } }; cell.alignment = { horizontal: 'center', vertical: 'middle' }; cell.border = { top: {style:'thin'}, bottom: {style:'thin'}, left: {style:'thin'}, right: {style:'thin'} }; });
      report.data.hazardEntries.forEach((entry, idx) => {
        const dataRow = worksheet.addRow([idx + 1, ...hazCols.map(c => c.type === 'file' && entry.data[c.id] ? '[Image]' : (entry.data[c.id] || '-')), entry.createdByName || entry.createdBy || 'Unknown']);
        dataRow.eachCell(cell => { cell.alignment = { horizontal: 'center', vertical: 'middle' }; cell.border = { top: {style:'thin'}, bottom: {style:'thin'}, left: {style:'thin'}, right: {style:'thin'} }; });
      });
      worksheet.addRow([]);
    }
    
    // Suggest Improvements
    worksheet.addRow(['SUGGEST IMPROVEMENTS']).font = { bold: true };
    worksheet.addRow([report.data.suggestImprovements || 'No data']);
    worksheet.addRow([]);
    
    // ix) Attachment
    worksheet.addRow(['ix) ATTACHMENT']).font = { bold: true };
    if (report.data.attachmentImage) {
      worksheet.addRow(['[Image attached - see report]']);
    } else {
      worksheet.addRow(['No attachment']);
    }
    
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ShiftReport_${station ? station.name : 'Unknown'}_${report.date}_${report.shift}.xlsx`;
    link.click();
    
    showToast("Excel exported successfully!");
  } catch (error) {
    console.error("Export error:", error);
    showToast("Export failed", "error");
  }
}

// Export shift report to PDF
function exportShiftReportPDF(reportId) {
  const report = state.shiftReports.find(r => r.id === reportId);
  if (!report) return;
  
  const station = state.stations.find(s => s.id === report.stationId);
  const shiftInfo = SHIFTS[report.shift];
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Shift Report - ${station ? station.name : 'Unknown'}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #003366; }
        h2 { color: #666; }
        h3 { margin-top: 20px; border-bottom: 2px solid #003366; padding-bottom: 5px; }
        h4 { margin-top: 15px; color: #003366; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #003366; color: white; }
        .meta { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .hazard-entry { background: #fff3cd; padding: 10px; margin: 5px 0; border-radius: 4px; }
        .edited-info { font-style: italic; color: #666; font-size: 0.9em; }
        .long-text { background: #f9f9f9; padding: 10px; border-radius: 4px; margin: 5px 0; white-space: pre-wrap; }
        .attachment-img { max-width: 300px; border-radius: 5px; border: 1px solid #ddd; margin-top: 10px; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>
      <h1>SHIFT REPORT</h1>
      <h2>${station ? station.name : 'Unknown'}</h2>
      
      <div class="meta">
        <p><strong>Date:</strong> ${report.date}</p>
        <p><strong>Shift:</strong> ${shiftInfo ? shiftInfo.name : report.shift} (${shiftInfo ? shiftInfo.label : ''})</p>
        <p><strong>SC Name:</strong> ${report.scName}</p>
        <p><strong>SC EMP ID:</strong> ${report.scEmpId}</p>
      </div>
      
      <h3>i) Station Staff</h3>
      <table>
        <tr><th>Type</th><th>Company</th><th>Count</th></tr>
        ${(report.data.stationStaff || []).map(s => {
          let rows = `<tr><td>${s.type}</td><td>${s.company}</td><td>${s.count}</td></tr>`;
          if (s.persons && s.persons.filter(p => p.name).length > 0) {
            rows += `<tr><td colspan="3"><table style="width:100%"><tr><th>#</th><th>Name</th><th>Contact</th><th>Location</th></tr>`;
            rows += s.persons.filter(p => p.name).map((p, i) => `<tr><td>${i+1}</td><td>${p.name}</td><td>${p.contactNo || '-'}</td><td>${p.location || '-'}</td></tr>`).join('');
            rows += `</table></td></tr>`;
          }
          return rows;
        }).join('')}
      </table>
      
      <h3>ii) PTW (Permit to Work)</h3>
      <table>
        <tr><th>PTW No</th><th>Contractor</th><th>PIC Name</th><th>Persons</th><th>Nature</th><th>Impact</th><th>Start</th><th>End</th><th>Closure</th></tr>
        ${(report.data.ptw || []).map(p => `<tr><td>${p.ptwNo}</td><td>${p.contractor}</td><td>${p.picName}</td><td>${p.persons}</td><td>${p.nature}</td><td>${p.impact}</td><td>${p.startTime}</td><td>${p.endTime}</td><td>${p.closureRemark}</td></tr>`).join('')}
      </table>
      
      <h3>iii) Work in Progress Activities</h3>
      <div class="long-text">${report.data.workInProgress || 'No data'}</div>
      
      <h3>iv) Essential Equipment</h3>
      <table>
        <tr><th>Name</th><th>Status</th><th>Remark</th></tr>
        ${(report.data.equipment || []).map(e => `<tr><td>${e.name}</td><td>${e.status}</td><td>${e.remark}</td></tr>`).join('')}
      </table>
      
      <h3>v) Performed Mock Drill Details</h3>
      <div class="long-text">${report.data.mockDrillDetails || 'No data'}</div>
      
      <h3>vi) Risk Observed</h3>
      <div class="long-text">${report.data.riskObserved || 'No data'}</div>
      
      <h3>vii) VIP/Others Visit at Station</h3>
      <div class="long-text">${report.data.vipVisit || 'No data'}</div>
      
      ${report.data.hazardEntries && report.data.hazardEntries.length > 0 ? `
        <h3>viii) Hazard Entries (${report.data.hazardEntries.length})</h3>
        <table>
          <thead>
            <tr>
              <th>Sr No</th>
              ${(report.data.hazardColumns || []).map(col => `<th>${col.name}</th>`).join('')}
              <th>Created By</th>
            </tr>
          </thead>
          <tbody>
            ${report.data.hazardEntries.map((entry, idx) => `
              <tr>
                <td style="text-align:center;">${idx + 1}</td>
                ${(report.data.hazardColumns || []).map(col => `<td>${col.type === 'file' && entry.data[col.id] ? '<em>[Image]</em>' : (entry.data[col.id] || '-')}</td>`).join('')}
                <td>${entry.createdByName || entry.createdBy || 'Unknown'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<h3>viii) Hazard Entries</h3><p>No hazard entries</p>'}
      
      <h3>Suggest Improvements</h3>
      <div class="long-text">${report.data.suggestImprovements || 'No data'}</div>
      
      <h3>ix) Attachment</h3>
      ${report.data.attachmentImage ? `<img class="attachment-img" src="${report.data.attachmentImage}" alt="Attachment">` : '<p>No attachment</p>'}
      
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

function renderStationCard(station, index, isAdmin) {
  const entryCount = state.entries.filter(e => e.stationId === station.id).length;
  return `
    <div class="card card-interactive" onclick="selectStation('${station.id}')" style="animation-delay: ${index * 100}ms">
      <div class="card-header">
        <div class="card-title">
          <div style="flex: 1;">
            <div class="flex items-center gap-3 mb-2">
              <div class="station-icon">${icons.building}</div>
              <span class="station-name">${station.name}</span>
            </div>
            <p style="color: var(--muted-foreground); font-size: 0.875rem;">${entryCount} entries</p>
          </div>
          ${isAdmin ? `
            <div class="station-actions" onclick="event.stopPropagation();">
              <button class="btn btn-ghost" onclick="debounceClick('duplicate${station.id}', () => duplicateStation('${station.id}'))" title="Duplicate Station">
                ${icons.copy}
              </button>
              <button class="btn btn-ghost ${station.enabled ? 'text-success' : 'text-destructive'}" 
                onclick="debounceClick('toggle${station.id}', () => toggleStationStatus('${station.id}'))" title="${station.enabled ? 'Disable' : 'Enable'}">
                ${icons.power}
              </button>
              <button class="btn btn-ghost text-destructive" onclick="debounceClick('delete${station.id}', () => deleteStation('${station.id}'))" title="Delete">
                ${icons.trash}
              </button>
            </div>
          ` : ''}
        </div>
      </div>
      <div class="card-content">
        <div class="flex items-center gap-2">
          <div class="status-badge ${station.enabled ? 'status-active' : 'status-disabled'}">
            <span class="status-dot ${station.enabled ? 'active' : 'disabled'}"></span>
            ${station.enabled ? 'Active' : 'Disabled'}
          </div>
          <span style="font-size: 0.75rem; color: var(--muted-foreground);">
            ${station.columns.filter(c => !c.isDefault).length} columns
          </span>
        </div>
      </div>
    </div>
  `;
}

function renderDialogs() {
  return `
    <!-- Add User Dialog -->
    <div id="addUserDialog" class="dialog-overlay">
      <div class="dialog dialog-station">
        <div class="dialog-header">
          <div class="dialog-title">${icons.users} Register Station User</div>
          <p class="dialog-description">Add a new user who can access the station dashboard.</p>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label class="form-label">User ID (Login ID - Case Sensitive)</label>
            <input type="text" class="form-input" id="newUserOdId" placeholder="Enter User ID for login">
          </div>
          <div class="form-group">
            <label class="form-label">Employee ID</label>
            <input type="text" class="form-input" id="newUserEmpId" placeholder="Enter Employee ID">
          </div>
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-input" id="newUserName" placeholder="Enter full name">
          </div>
          <div class="form-group">
            <label class="form-label">Designation</label>
            <input type="text" class="form-input" id="newUserDesignation" placeholder="Enter designation">
          </div>
          <div class="form-group">
            <label class="form-label">Contact No</label>
            <input type="text" class="form-input" id="newUserContactNo" placeholder="Enter contact number">
          </div>
          <div class="form-group">
            <label class="form-label">Assigned Stations</label>
            <div class="station-checkbox-list" id="newUserStationsList">
              ${(state.isAdmin ? getSMAvailableStationsForUserAssignment() : state.stations).map(s => `
                <label class="station-checkbox-item">
                  <input type="checkbox" value="${s.id}" class="new-user-station-cb">
                  <span>${s.name}</span>
                </label>
              `).join('')}
            </div>
            <p class="form-hint">Leave unchecked to allow access to all stations.</p>
          </div>
          <div class="info-box">
            <strong>Note:</strong> User ID is case-sensitive and will be used for login. No password required.
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-outline" onclick="closeDialog('addUserDialog')">Cancel</button>
          <button class="btn btn-primary" onclick="debounceClick('createUser', createUser)">Register User</button>
        </div>
      </div>
    </div>
    
    <!-- Edit User Dialog -->
    <div id="editUserDialog" class="dialog-overlay">
      <div class="dialog dialog-station">
        <div class="dialog-header">
          <div class="dialog-title">${icons.edit} Edit User</div>
          <p class="dialog-description">Update user details.</p>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label class="form-label">User ID (Login ID - Case Sensitive)</label>
            <input type="text" class="form-input" id="editUserOdId" placeholder="Enter User ID for login">
          </div>
          <div class="form-group">
            <label class="form-label">Employee ID</label>
            <input type="text" class="form-input" id="editUserEmpId" placeholder="Enter Employee ID">
          </div>
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-input" id="editUserName" placeholder="Enter full name">
          </div>
          <div class="form-group">
            <label class="form-label">Designation</label>
            <input type="text" class="form-input" id="editUserDesignation" placeholder="Enter designation">
          </div>
          <div class="form-group">
            <label class="form-label">Contact No</label>
            <input type="text" class="form-input" id="editUserContactNo" placeholder="Enter contact number">
          </div>
          <div class="form-group">
            <label class="form-label">Assigned Stations</label>
            <div class="station-checkbox-list" id="editUserStationsList"></div>
            <p class="form-hint">Leave unchecked to allow access to all stations.</p>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-outline" onclick="closeDialog('editUserDialog')">Cancel</button>
          <button class="btn btn-primary" onclick="debounceClick('saveUser', saveUserEdit)">Save Changes</button>
        </div>
      </div>
    </div>
    
    <!-- Add Instruction Dialog -->
    <div id="addInstructionDialog" class="dialog-overlay">
      <div class="dialog dialog-user">
        <div class="dialog-header">
          <div class="dialog-title">${icons.info} Add Instruction</div>
          <p class="dialog-description">Add a new instruction for station users to read before login.</p>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label class="form-label">Instruction Text</label>
            <textarea class="form-input form-textarea" id="newInstructionText" placeholder="Enter instruction text..."></textarea>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-outline" onclick="closeDialog('addInstructionDialog')">Cancel</button>
          <button class="btn btn-primary" onclick="debounceClick('createInstruction', createInstruction)">Add Instruction</button>
        </div>
      </div>
    </div>
    
    <!-- View Report Dialog -->
    <div id="viewReportDialog" class="dialog-overlay">
      <div class="dialog dialog-report">
        <button class="dialog-close" onclick="closeDialog('viewReportDialog')">${icons.x}</button>
        <div class="dialog-body" id="viewReportContent">
        </div>
      </div>
    </div>
    
    <!-- Add Station Dialog -->
    <div id="addStationDialog" class="dialog-overlay">
      <div class="dialog dialog-station">
        <div class="dialog-header">
          <div class="dialog-title">${icons.building} Create New Station</div>
          <p class="dialog-description">Configure your station with custom columns. SC Name and Entry Time are added automatically.</p>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label class="form-label">Station Name</label>
            <input type="text" class="form-input" id="newStationName" placeholder="Enter station name">
          </div>
          <div class="form-group">
            <label class="form-label">Columns (Drag to reorder)</label>
            <p class="form-hint">SC Name and Entry Time columns are added automatically and will not be shown here.</p>
            <div class="columns-horizontal-container" id="newColumnsContainer"></div>
            <button class="btn btn-outline btn-sm" style="margin-top: 0.5rem;" onclick="addNewColumn()">
              ${icons.plus} Add Column
            </button>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-outline" onclick="closeDialog('addStationDialog')">Cancel</button>
          <button class="btn btn-primary" onclick="debounceClick('createStation', createStation)">Create Station</button>
        </div>
      </div>
    </div>
    
    <!-- Edit Station Dialog -->
    <div id="editStationDialog" class="dialog-overlay">
      <div class="dialog dialog-station">
        <div class="dialog-header">
          <div class="dialog-title" id="editStationTitle">${icons.edit} Edit Station</div>
          <p class="dialog-description">Modify station columns. Drag to reorder.</p>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label class="form-label">Station Name</label>
            <input type="text" class="form-input" id="editStationName" placeholder="Enter station name">
          </div>
          <div class="form-group">
            <label class="form-label">Columns</label>
            <div class="columns-horizontal-container" id="editColumnsContainer"></div>
            <button class="btn btn-outline btn-sm" style="margin-top: 0.5rem;" onclick="addEditColumn()">
              ${icons.plus} Add Column
            </button>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-outline" onclick="closeDialog('editStationDialog')">Cancel</button>
          <button class="btn btn-primary" onclick="debounceClick('saveStation', saveStationEdit)">Save Changes</button>
        </div>
      </div>
    </div>
    
    <!-- Entry Dialog -->
    <div id="entryDialog" class="dialog-overlay">
      <div class="dialog dialog-station">
        <div class="dialog-header">
          <div class="dialog-title" id="entryDialogTitle">${icons.document} Add Entry</div>
          <p class="dialog-description" id="entryDialogDesc">Fill in the details below.</p>
        </div>
        <div class="dialog-body" id="entryFormContainer">
        </div>
        <div class="dialog-footer">
          <button class="btn btn-outline" onclick="closeDialog('entryDialog')">Cancel</button>
          <button class="btn btn-primary" onclick="debounceClick('saveEntry', saveEntry)">Save Entry</button>
        </div>
      </div>
    </div>
    
    <!-- Closure Remark Dialog -->
    <div id="closureRemarkDialog" class="dialog-overlay">
      <div class="dialog dialog-user">
        <div class="dialog-header">
          <div class="dialog-title">${icons.alertTriangle} Closure Remark Required</div>
          <p class="dialog-description">You are closing this entry. Please provide a closure remark — this will be visible to SM and COO.</p>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label class="form-label">Closure Remark <span style="color: var(--destructive);">*</span></label>
            <textarea id="closureRemarkText" class="form-input form-textarea" rows="4" placeholder="Describe the resolution, action taken, and any relevant details..."></textarea>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-outline" onclick="cancelClosureRemark()">Cancel</button>
          <button class="btn btn-primary" onclick="debounceClick('saveClosureRemark', saveClosureRemark)">Close Entry</button>
        </div>
      </div>
    </div>
    
    <div id="mergeStationDialog" class="dialog-overlay">
      <div class="dialog dialog-merge">
        <div class="dialog-header">
          <div class="dialog-title">${icons.merge} Merge Stations</div>
          <p class="dialog-description">Select stations to merge and export as a single Excel file.</p>
        </div>
        <div class="dialog-body">
          <div class="station-checkbox-list" id="mergeStationList">
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-outline" onclick="closeDialog('mergeStationDialog')">Cancel</button>
          <button class="btn btn-merge" onclick="debounceClick('exportMerge', exportMergedStations)">
            ${icons.download}
            Export Merged Excel
          </button>
        </div>
      </div>
    </div>
    
    <!-- Image Preview Dialog -->
    <div id="imagePreviewDialog" class="dialog-overlay">
      <div class="dialog image-preview-dialog" style="position: relative;">
        <button class="dialog-close" onclick="closeDialog('imagePreviewDialog')">${icons.x}</button>
        <div class="image-preview-container">
          <img id="previewImage" src="" alt="Preview">
        </div>
      </div>
    </div>
    
    <!-- Add SM User Dialog -->
    <div id="addSMUserDialog" class="dialog-overlay">
      <div class="dialog dialog-station">
        <div class="dialog-header">
          <div class="dialog-title">${icons.users} Register SM User</div>
          <p class="dialog-description">Add a new SM user who can access the SM panel.</p>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label class="form-label">SM User ID (Login ID - Case Sensitive)</label>
            <input type="text" class="form-input" id="newSMUserOdId" placeholder="Enter SM User ID">
          </div>
          <div class="form-group">
            <label class="form-label">Employee ID</label>
            <input type="text" class="form-input" id="newSMUserEmpId" placeholder="Enter Employee ID">
          </div>
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-input" id="newSMUserName" placeholder="Enter full name">
          </div>
          <div class="form-group">
            <label class="form-label">Designation</label>
            <input type="text" class="form-input" id="newSMUserDesignation" placeholder="Enter designation">
          </div>
          <div class="form-group">
            <label class="form-label">Contact No</label>
            <input type="text" class="form-input" id="newSMUserContactNo" placeholder="Enter contact number">
          </div>
          <div class="form-group">
            <label class="form-label">Assigned Stations</label>
            <div class="station-checkbox-list">
              ${state.stations.map(s => `
                <label class="station-checkbox-item">
                  <input type="checkbox" value="${s.id}" class="new-sm-user-station-cb">
                  <span>${s.name}</span>
                </label>
              `).join('')}
            </div>
            <p class="form-hint">Assign stations to limit SM access to specific stations.</p>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-outline" onclick="closeDialog('addSMUserDialog')">Cancel</button>
          <button class="btn btn-primary" onclick="debounceClick('createSMUser', createSMUser)">Register SM User</button>
        </div>
      </div>
    </div>
    
    <!-- Edit SM User Dialog -->
    <div id="editSMUserDialog" class="dialog-overlay">
      <div class="dialog dialog-station">
        <div class="dialog-header">
          <div class="dialog-title">${icons.edit} Edit SM User</div>
          <p class="dialog-description">Update SM user details.</p>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label class="form-label">SM User ID (Login ID - Case Sensitive)</label>
            <input type="text" class="form-input" id="editSMUserOdId" placeholder="Enter SM User ID">
          </div>
          <div class="form-group">
            <label class="form-label">Employee ID</label>
            <input type="text" class="form-input" id="editSMUserEmpId" placeholder="Enter Employee ID">
          </div>
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-input" id="editSMUserName" placeholder="Enter full name">
          </div>
          <div class="form-group">
            <label class="form-label">Designation</label>
            <input type="text" class="form-input" id="editSMUserDesignation" placeholder="Enter designation">
          </div>
          <div class="form-group">
            <label class="form-label">Contact No</label>
            <input type="text" class="form-input" id="editSMUserContactNo" placeholder="Enter contact number">
          </div>
          <div class="form-group">
            <label class="form-label">Assigned Stations</label>
            <div class="station-checkbox-list" id="editSMUserStationsList"></div>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-outline" onclick="closeDialog('editSMUserDialog')">Cancel</button>
          <button class="btn btn-primary" onclick="debounceClick('saveSMUser', saveSMUserEdit)">Save Changes</button>
        </div>
      </div>
    </div>
    
    <!-- Instruction Popup Dialog (real-time) -->
    <div id="instructionPopupDialog" class="dialog-overlay">
      <div class="dialog dialog-station">
        <div class="dialog-header">
          <div class="dialog-title" style="color: #DAA520;">⭐ New Instruction Received</div>
          <p class="dialog-description">A new instruction has been added. Please read and acknowledge.</p>
        </div>
        <div class="dialog-body" id="instructionPopupContent">
        </div>
        <div class="dialog-footer">
          <label class="declaration-checkbox" style="flex: 1;">
            <input type="checkbox" id="popupAcknowledgeCheckbox" onchange="handlePopupAcknowledge(this.checked)">
            <span>I have read and understood this instruction</span>
          </label>
          <button class="btn btn-primary" id="popupAcknowledgeBtn" disabled onclick="debounceClick('ackPopup', acknowledgePopupInstruction)">Acknowledge</button>
        </div>
      </div>
    </div>
  `;
}

// =====================================================
// EVENT HANDLERS
// =====================================================
function attachEventListeners() {
  // Dialogs should NOT close when clicking overlay
}

function openDialog(id) {
  state.dialogOpen = true;
  document.getElementById(id).classList.add("open");
  document.body.classList.add("dialog-active");
}

function closeDialog(id) {
  state.dialogOpen = false;
  document.getElementById(id).classList.remove("open");
  document.body.classList.remove("dialog-active");
}

// Auth handlers
function handleLogout() {
  stopInstructionPolling();
  state.isAdmin = false;
  state.isCOO = false;
  state.currentView = "login";
  state.loggedInUser = null;
  state.loggedInSM = null;
  state.selectedStation = null;
  state.selectedShift = null;
  state.selectedStationForLogin = null;
  state.entryDateFilter = null;
  state.adminEntryDateFilter = null;
  state.instructionAcknowledged = false;
  clearSession();
  showToast("Logged out successfully");
  render();
}

// Navigation
function selectStation(stationId) {
  state.selectedStation = stationId;
  render();
}

function goBackAdmin() {
  state.selectedStation = null;
  render();
}

function goBackController() {
  state.selectedStation = null;
  render();
}

// =====================================================
// USER MANAGEMENT
// =====================================================
let editingUserId = null;

function openAddUserDialog() {
  // Re-render dialogs to get fresh station list
  render();
  setTimeout(() => {
    document.getElementById("newUserOdId").value = "";
    document.getElementById("newUserEmpId").value = "";
    document.getElementById("newUserName").value = "";
    document.getElementById("newUserDesignation").value = "";
    document.getElementById("newUserContactNo").value = "";
    document.querySelectorAll('.new-user-station-cb').forEach(cb => cb.checked = false);
    openDialog("addUserDialog");
  }, 50);
}

async function createUser() {
  const odId = document.getElementById("newUserOdId").value.trim();
  const empId = document.getElementById("newUserEmpId").value.trim();
  const name = document.getElementById("newUserName").value.trim();
  const designation = document.getElementById("newUserDesignation").value.trim();
  const contactNo = document.getElementById("newUserContactNo").value.trim();
  
  const assignedStations = Array.from(document.querySelectorAll('.new-user-station-cb:checked')).map(cb => cb.value);
  
  if (!odId || !name || !designation) {
    showToast("Please fill User ID, Name and Designation", "error");
    return;
  }
  
  if (state.stationUsers.find(u => u.odId === odId)) {
    showToast("User ID already exists", "error");
    return;
  }
  
  const smName = state.loggedInSM ? state.loggedInSM.name : (state.isCOO ? 'COO' : 'Admin');
  const user = {
    id: generateId(),
    odId: odId,
    empId: empId,
    name: name,
    designation: designation,
    contactNo: contactNo,
    assignedStations: assignedStations,
    registeredBySM: smName
  };
  
  const created = await createStationUserApi(user);
  if (created) {
    state.stationUsers.push(created);
    closeDialog("addUserDialog");
    showToast("User registered successfully");
    render();
  }
}

function openEditUserDialog(userId) {
  const user = state.stationUsers.find(u => u.id === userId);
  if (!user) return;
  
  editingUserId = userId;
  document.getElementById("editUserOdId").value = user.odId || '';
  document.getElementById("editUserEmpId").value = user.empId || '';
  document.getElementById("editUserName").value = user.name;
  document.getElementById("editUserDesignation").value = user.designation;
  document.getElementById("editUserContactNo").value = user.contactNo || '';
  
  // Render station checkboxes for edit
  const listEl = document.getElementById("editUserStationsList");
  if (listEl) {
    const availableStations = getSMAvailableStationsForUserAssignment();
    listEl.innerHTML = availableStations.map(s => `
      <label class="station-checkbox-item">
        <input type="checkbox" value="${s.id}" class="edit-user-station-cb" ${(user.assignedStations || []).includes(s.id) ? 'checked' : ''}>
        <span>${s.name}</span>
      </label>
    `).join('');
  }
  
  openDialog("editUserDialog");
}

async function saveUserEdit() {
  const odId = document.getElementById("editUserOdId").value.trim();
  const empId = document.getElementById("editUserEmpId").value.trim();
  const name = document.getElementById("editUserName").value.trim();
  const designation = document.getElementById("editUserDesignation").value.trim();
  const contactNo = document.getElementById("editUserContactNo").value.trim();
  const assignedStations = Array.from(document.querySelectorAll('.edit-user-station-cb:checked')).map(cb => cb.value);
  
  if (!odId || !name || !designation) {
    showToast("Please fill User ID, Name and Designation", "error");
    return;
  }
  
  const user = state.stationUsers.find(u => u.id === editingUserId);
  if (user) {
    user.odId = odId;
    user.empId = empId;
    user.name = name;
    user.designation = designation;
    user.contactNo = contactNo;
    user.assignedStations = assignedStations;
    await updateStationUserApi(user);
    closeDialog("editUserDialog");
    showToast("User updated successfully");
    render();
  }
}

async function deleteUser(userId) {
  if (confirm("Are you sure you want to delete this user?")) {
    const user = state.stationUsers.find(u => u.id === userId);
    await deleteStationUserApi(userId, user?.airtableRecordId);
    state.stationUsers = state.stationUsers.filter(u => u.id !== userId);
    showToast("User deleted");
    render();
  }
}

// =====================================================
// STATION MANAGEMENT
// =====================================================
let newColumns = [];
let draggedColumnIndex = null;

function openAddStationDialog() {
  // Default columns are added internally, not shown in UI
  newColumns = [];
  document.getElementById("newStationName").value = "";
  renderNewColumns();
  openDialog("addStationDialog");
}

function addNewColumn() {
  newColumns.push({
    id: generateId(),
    name: "New Column",
    type: "text"
  });
  renderNewColumns();
}

function renderNewColumns() {
  const container = document.getElementById("newColumnsContainer");
  if (newColumns.length === 0) {
    container.innerHTML = '<p class="no-columns-msg">No custom columns added yet. Click "Add Column" to add columns.</p>';
    return;
  }
  container.innerHTML = newColumns.map((col, index) => `
    <div class="column-card" draggable="true" ondragstart="handleDragStart(event, ${index}, 'new')" ondragover="handleDragOver(event)" ondrop="handleDrop(event, ${index}, 'new')" ondragend="handleDragEnd(event)">
      <div class="column-drag-handle">${icons.grip}</div>
      <div class="column-card-content">
        <input type="text" class="form-input column-name-input" value="${col.name}" onchange="updateNewColumnName(${index}, this.value)" placeholder="Column name">
        <select class="form-select column-type-select" onchange="updateNewColumnType(${index}, this.value)">
          <option value="text" ${col.type === 'text' ? 'selected' : ''}>Text</option>
          <option value="number" ${col.type === 'number' ? 'selected' : ''}>Number</option>
          <option value="file" ${col.type === 'file' ? 'selected' : ''}>File</option>
          <option value="date" ${col.type === 'date' ? 'selected' : ''}>Date</option>
          <option value="levels" ${col.type === 'levels' ? 'selected' : ''}>Levels</option>
          <option value="informs" ${col.type === 'informs' ? 'selected' : ''}>Inform To</option>
        </select>
        <button class="btn btn-ghost text-destructive" onclick="removeNewColumn(${index})">${icons.trash}</button>
      </div>
    </div>
  `).join("");
}

function updateNewColumnName(index, name) {
  newColumns[index].name = name;
}

function updateNewColumnType(index, type) {
  newColumns[index].type = type;
}

function removeNewColumn(index) {
  newColumns.splice(index, 1);
  renderNewColumns();
}

// Drag and drop for columns
function handleDragStart(event, index, mode) {
  draggedColumnIndex = index;
  event.dataTransfer.effectAllowed = 'move';
  event.target.classList.add('dragging');
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  event.currentTarget.classList.add('drag-over');
}

function handleDrop(event, dropIndex, mode) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');
  
  if (draggedColumnIndex === null || draggedColumnIndex === dropIndex) return;
  
  const columns = mode === 'new' ? newColumns : editColumns;
  const dragged = columns.splice(draggedColumnIndex, 1)[0];
  columns.splice(dropIndex, 0, dragged);
  
  if (mode === 'new') {
    renderNewColumns();
  } else {
    renderEditColumns();
  }
  
  draggedColumnIndex = null;
}

function handleDragEnd(event) {
  event.target.classList.remove('dragging');
  document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
}

async function createStation() {
  const name = document.getElementById("newStationName").value.trim();
  
  if (!name) {
    showToast("Please enter a station name", "error");
    return;
  }
  
  // Add default columns internally
  const defaultColumns = [
    { id: 'sc_name', name: 'SC Name', type: 'text', isDefault: true },
    { id: 'entry_time', name: 'Entry Time', type: 'text', isDefault: true }
  ];
  
  const station = {
    id: generateId(),
    name: name,
    columns: [...defaultColumns, ...newColumns],
    enabled: true,
    editedByAdmin: false
  };
  
  const created = await createStationApi(station);
  if (created) {
    state.stations.push(created);
    closeDialog("addStationDialog");
    showToast("Station created successfully");
    render();
  }
}

async function duplicateStation(stationId) {
  const original = state.stations.find(s => s.id === stationId);
  if (!original) return;
  
  const newStation = {
    id: generateId(),
    name: `${original.name} (Copy)`,
    columns: [...original.columns],
    enabled: true,
    editedByAdmin: false
  };
  
  const created = await createStationApi(newStation);
  if (created) {
    state.stations.push(created);
    showToast("Station duplicated");
    render();
  }
}

async function toggleStationStatus(stationId) {
  const station = state.stations.find(s => s.id === stationId);
  if (!station) return;
  
  station.enabled = !station.enabled;
  await updateStationApi(station);
  showToast(`Station ${station.enabled ? 'enabled' : 'disabled'}`);
  render();
}

async function deleteStation(stationId) {
  if (confirm("Are you sure you want to delete this station and all its entries?")) {
    const station = state.stations.find(s => s.id === stationId);
    if (!station) return;
    
    // Delete all entries for this station
    const stationEntries = state.entries.filter(e => e.stationId === stationId);
    for (const entry of stationEntries) {
      await deleteEntryApi(entry.id, entry.airtableRecordId);
    }
    
    await deleteStationApi(stationId, station.airtableRecordId);
    state.stations = state.stations.filter(s => s.id !== stationId);
    state.entries = state.entries.filter(e => e.stationId !== stationId);
    showToast("Station deleted");
    render();
  }
}

// Edit station
let editColumns = [];
let editingStationId = null;

function openEditStationDialog(stationId) {
  const station = state.stations.find(s => s.id === stationId);
  if (!station) return;
  
  editingStationId = stationId;
  document.getElementById("editStationName").value = station.name;
  
  // Only show non-default columns for editing
  editColumns = station.columns.filter(c => !c.isDefault).map(c => ({...c}));
  renderEditColumns();
  openDialog("editStationDialog");
}

function addEditColumn() {
  editColumns.push({
    id: generateId(),
    name: "New Column",
    type: "text"
  });
  renderEditColumns();
}

function renderEditColumns() {
  const container = document.getElementById("editColumnsContainer");
  if (editColumns.length === 0) {
    container.innerHTML = '<p class="no-columns-msg">No custom columns. Click "Add Column" to add columns.</p>';
    return;
  }
  container.innerHTML = editColumns.map((col, index) => `
    <div class="column-card" draggable="true" ondragstart="handleDragStart(event, ${index}, 'edit')" ondragover="handleDragOver(event)" ondrop="handleDrop(event, ${index}, 'edit')" ondragend="handleDragEnd(event)">
      <div class="column-drag-handle">${icons.grip}</div>
      <div class="column-card-content">
        <input type="text" class="form-input column-name-input" value="${col.name}" onchange="updateEditColumnName(${index}, this.value)" placeholder="Column name">
        <select class="form-select column-type-select" onchange="updateEditColumnType(${index}, this.value)">
          <option value="text" ${col.type === 'text' ? 'selected' : ''}>Text</option>
          <option value="number" ${col.type === 'number' ? 'selected' : ''}>Number</option>
          <option value="file" ${col.type === 'file' ? 'selected' : ''}>File</option>
          <option value="date" ${col.type === 'date' ? 'selected' : ''}>Date</option>
          <option value="levels" ${col.type === 'levels' ? 'selected' : ''}>Levels</option>
          <option value="informs" ${col.type === 'informs' ? 'selected' : ''}>Inform To</option>
        </select>
        <button class="btn btn-ghost text-destructive" onclick="removeEditColumn(${index})">${icons.trash}</button>
      </div>
    </div>
  `).join("");
}

function updateEditColumnName(index, name) {
  editColumns[index].name = name;
}

function updateEditColumnType(index, type) {
  editColumns[index].type = type;
}

function removeEditColumn(index) {
  editColumns.splice(index, 1);
  renderEditColumns();
}

async function saveStationEdit() {
  const newName = document.getElementById("editStationName").value.trim();
  if (!newName) {
    showToast("Please enter a station name", "error");
    return;
  }
  
  const station = state.stations.find(s => s.id === editingStationId);
  if (station) {
    // Preserve default columns and add edited custom columns
    const defaultColumns = station.columns.filter(c => c.isDefault);
    station.name = newName;
    station.columns = [...defaultColumns, ...editColumns];
    station.editedByAdmin = true;
    await updateStationApi(station);
    
    const stationEntries = state.entries.filter(e => e.stationId === editingStationId);
    for (const entry of stationEntries) {
      if (entry.editedByController) {
        entry.editedByController = false;
        await updateEntryApi(entry);
      }
    }
    
    closeDialog("editStationDialog");
    showToast("Station updated. Controllers can now edit entries again.");
    render();
  }
}

// =====================================================
// MERGE STATIONS
// =====================================================
function openMergeStationDialog() {
  const listContainer = document.getElementById("mergeStationList");
  if (listContainer) {
    listContainer.innerHTML = state.stations.map(station => {
      const entryCount = state.entries.filter(e => e.stationId === station.id).length;
      return `
        <label class="station-checkbox-item">
          <input type="checkbox" value="${station.id}" class="merge-station-checkbox">
          <span>${station.name}</span>
          <span class="entry-count">${entryCount} entries</span>
        </label>
      `;
    }).join("");
  }
  openDialog("mergeStationDialog");
}

async function exportMergedStations() {
  const checkboxes = document.querySelectorAll('.merge-station-checkbox:checked');
  const selectedStationIds = Array.from(checkboxes).map(cb => cb.value);
  
  if (selectedStationIds.length === 0) {
    showToast("Please select at least one station", "error");
    return;
  }
  
  showToast("Generating merged Excel file...");
  
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'PUNERI METRO Portal';
    workbook.created = new Date();
    
    for (const stationId of selectedStationIds) {
      const station = state.stations.find(s => s.id === stationId);
      if (!station) continue;
      
      const entries = state.entries.filter(e => e.stationId === stationId);
      
      const worksheet = workbook.addWorksheet(station.name.substring(0, 31), {
        views: [{ state: 'frozen', ySplit: 1 }]
      });
      
      const visibleColumns = station.columns.filter(c => !c.isDefault);
      const headers = ["SR NO", ...visibleColumns.map(c => c.name.toUpperCase()), "SC NAME", "ENTRY TIME", "CREATED BY", "EDITED BY"];
      const imageColumns = visibleColumns.map((col, idx) => col.type === "file" ? idx + 2 : -1).filter(i => i > -1);
      
      const headerRow = worksheet.addRow(headers);
      headerRow.height = 30;
      headerRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };
      });
      
      const CM_TO_WIDTH = 4.5;
      worksheet.columns = headers.map((header, idx) => {
        if (imageColumns.includes(idx + 1)) {
          return { width: 5 * CM_TO_WIDTH };
        }
        return { width: Math.max(header.length + 5, 15) };
      });
      
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const rowData = [i + 1];
        const rowImageData = [];
        
        for (let colIdx = 0; colIdx < visibleColumns.length; colIdx++) {
          const col = visibleColumns[colIdx];
          
          if (col.type === "file" && entry.data[col.id]) {
            rowData.push("");
            rowImageData.push({ colIndex: colIdx + 2, imageData: entry.data[col.id] });
          } else if (col.type === "date" && entry.data[col.id]) {
            rowData.push(new Date(entry.data[col.id]).toLocaleDateString());
          } else {
            rowData.push(entry.data[col.id] || "");
          }
        }
        
        rowData.push(entry.data['sc_name'] || getUserNameByOdId(entry.createdBy));
        rowData.push(entry.data['entry_time'] || '-');
        rowData.push(entry.createdDate || '-');
        rowData.push(entry.editedBy ? `${getUserNameByOdId(entry.editedBy)} (${entry.editedDate})` : '-');
        
        const row = worksheet.addRow(rowData);
        
        const hasImages = rowImageData.length > 0;
        if (hasImages) {
          row.height = 142;
        } else {
          row.height = 25;
        }
        
        row.eachCell((cell, colNumber) => {
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
            left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
            bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
            right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
          };
          if (i % 2 === 0) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F9FA' } };
          }
        });
        
        for (const imgData of rowImageData) {
          try {
            const base64Match = imgData.imageData.match(/^data:image\/(png|jpeg|jpg|gif);base64,(.+)$/);
            if (base64Match) {
              const extension = base64Match[1] === 'jpg' ? 'jpeg' : base64Match[1];
              const base64String = base64Match[2];
              
              const imageId = workbook.addImage({ base64: base64String, extension: extension });
              
              worksheet.addImage(imageId, {
                tl: { col: imgData.colIndex - 1 + 0.1, row: row.number - 1 + 0.1 },
                ext: { width: 170, height: 170 }
              });
            }
          } catch (imgError) {
            console.error("Error adding image:", imgError);
          }
        }
      }
    }
    
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Merged_Stations_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    
    closeDialog("mergeStationDialog");
    showToast("Merged Excel exported successfully!");
  } catch (error) {
    console.error("Export error:", error);
    showToast("Export failed. Please try again.", "error");
  }
}

// =====================================================
// ENTRY MANAGEMENT
// =====================================================
let entryData = {};
let editingEntryId = null;
let entryStationId = null;
let pendingClosureEntryId = null;
let pendingClosurePrevStatus = 'Open';

// Render colored status pill
function renderStatusPill(status) {
  const s = status || 'Open';
  if (s === 'Closed') return '<span class="status-pill status-pill-closed">● Closed</span>';
  if (s === 'In Progress') return '<span class="status-pill status-pill-progress">● In Progress</span>';
  return '<span class="status-pill status-pill-open">● Open</span>';
}

// Station user changing entry status from dropdown
async function handleControllerStatusChange(entryId, newStatus, selectEl) {
  const entry = state.entries.find(e => e.id === entryId);
  if (!entry) return;
  const prevStatus = entry.status || 'Open';
  if (newStatus === prevStatus) return;
  
  if (newStatus === 'Closed') {
    // Open closure remark dialog — defer the actual change
    pendingClosureEntryId = entryId;
    pendingClosurePrevStatus = prevStatus;
    document.getElementById('closureRemarkText').value = '';
    openDialog('closureRemarkDialog');
    return;
  }
  
  // Direct update for Open / In Progress
  entry.status = newStatus;
  entry.closureRemark = '';
  entry.closedBy = '';
  entry.closedDate = '';
  try {
    await updateEntryApi(entry);
    showToast(`Status updated to ${newStatus}`);
    render();
  } catch (e) {
    console.error(e);
    showToast('Failed to update status', 'error');
    if (selectEl) selectEl.value = prevStatus;
  }
}

// Cancel closure dialog — revert select
function cancelClosureRemark() {
  closeDialog('closureRemarkDialog');
  pendingClosureEntryId = null;
  render();
}

// Save closure remark
async function saveClosureRemark() {
  const remark = (document.getElementById('closureRemarkText').value || '').trim();
  if (!remark) {
    showToast('Please enter a closure remark', 'error');
    return;
  }
  const entry = state.entries.find(e => e.id === pendingClosureEntryId);
  if (!entry) {
    closeDialog('closureRemarkDialog');
    return;
  }
  entry.status = 'Closed';
  entry.closureRemark = remark;
  entry.closedBy = state.loggedInUser ? state.loggedInUser.odId : (state.isCOO ? 'COO' : (state.loggedInSM ? state.loggedInSM.odId : 'Admin'));
  entry.closedDate = formatISTDate();
  try {
    await updateEntryApi(entry);
    showToast('Entry closed successfully');
  } catch (e) {
    console.error(e);
    showToast('Failed to close entry', 'error');
  }
  closeDialog('closureRemarkDialog');
  pendingClosureEntryId = null;
  render();
}


let isControllerEdit = false;

function openAddEntryDialog(stationId) {
  entryStationId = stationId;
  editingEntryId = null;
  entryData = {};
  isControllerEdit = false;
  
  document.getElementById("entryDialogTitle").textContent = "Add New Entry";
  document.getElementById("entryDialogDesc").textContent = "Fill in the details below to add a new entry to this station.";
  
  renderEntryForm(stationId);
  openDialog("entryDialog");
}

function openEditEntryDialog(entryId) {
  const entry = state.entries.find(e => e.id === entryId);
  if (!entry) return;
  
  editingEntryId = entryId;
  entryStationId = entry.stationId;
  entryData = {...entry.data};
  isControllerEdit = false;
  
  document.getElementById("entryDialogTitle").textContent = "Edit Entry";
  document.getElementById("entryDialogDesc").textContent = "Update the entry details for this station.";
  
  renderEntryForm(entry.stationId);
  openDialog("entryDialog");
}

function openEditEntryDialogController(entryId) {
  const entry = state.entries.find(e => e.id === entryId);
  if (!entry) return;
  
  if (entry.createdBy !== state.loggedInUser?.odId) {
    showToast("You can only edit your own entries", "error");
    return;
  }
  
  editingEntryId = entryId;
  entryStationId = entry.stationId;
  entryData = {...entry.data};
  isControllerEdit = true;
  
  document.getElementById("entryDialogTitle").textContent = "Edit Entry";
  document.getElementById("entryDialogDesc").textContent = "Update the entry details.";
  
  renderEntryForm(entry.stationId);
  openDialog("entryDialog");
}

function renderEntryForm(stationId) {
  const station = state.stations.find(s => s.id === stationId);
  if (!station) return;
  
  const today = new Date().toISOString().split('T')[0];
  const currentTime = formatISTTimeForEntry();
  const scName = state.loggedInUser ? state.loggedInUser.name : (state.isCOO ? 'COO' : (state.loggedInSM ? state.loggedInSM.name : 'Admin'));
  
  // Auto-fill SC Name and Entry Time for new entries
  if (!editingEntryId) {
    entryData['sc_name'] = scName;
    entryData['entry_time'] = currentTime;
  }
  
  // Filter out default columns - they are auto-filled
  const visibleColumns = station.columns.filter(c => !c.isDefault);
  
  const container = document.getElementById("entryFormContainer");
  container.innerHTML = visibleColumns.map(col => {
    let currentValue = entryData[col.id] || '';
    
    const isOtherSelected = col.type === "informs" && currentValue && !INFORM_TO_OPTIONS.slice(0, -1).includes(currentValue);
    
    return `
    <div class="form-group">
      <label class="form-label">${col.name}</label>
      ${col.type === "text" ? `
        <input type="text" class="form-input" value="${currentValue}" onchange="updateEntryData('${col.id}', this.value)" placeholder="Enter ${col.name.toLowerCase()}">
      ` : col.type === "number" ? `
        <input type="number" class="form-input" value="${currentValue}" onchange="updateEntryData('${col.id}', this.value)" placeholder="Enter ${col.name.toLowerCase()}" maxlength="10" oninput="if(this.value.length > 10) this.value = this.value.slice(0, 10)">
      ` : col.type === "date" ? `
        <input type="date" class="form-input" value="${currentValue}" max="${today}" onchange="updateEntryData('${col.id}', this.value)">
      ` : col.type === "levels" ? `
        <select class="form-select" onchange="updateEntryData('${col.id}', this.value)">
          <option value="">Select Level</option>
          ${LEVELS_OPTIONS.map(level => `<option value="${level}" ${currentValue === level ? 'selected' : ''}>${level}</option>`).join("")}
        </select>
      ` : col.type === "informs" ? `
        <select class="form-select" onchange="handleInformToChange('${col.id}', this.value)">
          <option value="">Select Department</option>
          ${INFORM_TO_OPTIONS.map(opt => `<option value="${opt}" ${(opt === "Other" && isOtherSelected) || currentValue === opt ? 'selected' : ''}>${opt}</option>`).join("")}
        </select>
        <div id="other-${col.id}" class="other-input-container" style="display: ${isOtherSelected ? 'block' : 'none'}; margin-top: 0.5rem;">
          <input type="text" class="form-input" value="${isOtherSelected ? currentValue : ''}" onchange="updateEntryData('${col.id}', this.value)" placeholder="Enter department name">
        </div>
      ` : `
        <input type="file" class="form-input" accept="image/*" onchange="handleFileUpload('${col.id}', this)">
        <div id="upload-status-${col.id}" style="margin-top: 0.25rem; font-size: 0.75rem; color: var(--muted-foreground);"></div>
        ${currentValue ? `<img src="${currentValue}" alt="Preview" style="width: 128px; height: 128px; object-fit: cover; border-radius: 0.5rem; margin-top: 0.5rem; border: 1px solid var(--border);">` : ''}
      `}
    </div>
  `}).join("");
}

function handleInformToChange(columnId, value) {
  if (value === "Other") {
    document.getElementById(`other-${columnId}`).style.display = 'block';
    entryData[columnId] = '';
  } else {
    document.getElementById(`other-${columnId}`).style.display = 'none';
    entryData[columnId] = value;
  }
}

function updateEntryData(columnId, value) {
  entryData[columnId] = value;
}

function handleFileUpload(columnId, input) {
  const file = input.files?.[0];
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    showToast("Please upload an image file", "error");
    return;
  }
  
  const statusEl = document.getElementById(`upload-status-${columnId}`);
  if (statusEl) statusEl.textContent = "Processing image...";
  
  compressImage(file, (compressedBase64) => {
    if (compressedBase64.length > MAX_IMAGE_SIZE) {
      showToast("Image too large. Please use a smaller image.", "error");
      if (statusEl) statusEl.textContent = "Image too large!";
      return;
    }
    
    entryData[columnId] = compressedBase64;
    if (statusEl) statusEl.textContent = "Image ready!";
    renderEntryForm(entryStationId);
  });
}

function compressImage(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const maxWidth = 400;
      const maxHeight = 400;
      
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
      callback(compressedBase64);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

async function saveEntry() {
  const station = state.stations.find(s => s.id === entryStationId);
  if (!station) {
    showToast("Station not found", "error");
    return;
  }
  
  // Validate required fields
  const visibleColumns = station.columns.filter(c => !c.isDefault);
  let hasData = false;
  for (const col of visibleColumns) {
    if (entryData[col.id] && entryData[col.id].toString().trim()) {
      hasData = true;
      break;
    }
  }
  
  if (editingEntryId) {
    const entry = state.entries.find(e => e.id === editingEntryId);
    if (entry) {
      entry.data = {...entryData};
      if (isControllerEdit) {
        entry.editedByController = true;
      }
      entry.editedBy = state.loggedInUser ? state.loggedInUser.odId : (state.isCOO ? 'COO' : (state.loggedInSM ? state.loggedInSM.odId : 'Admin'));
      entry.editedDate = formatISTDate();
      await updateEntryApi(entry);
      showToast("Entry updated successfully");
    }
  } else {
    const newEntry = {
      id: generateId(),
      stationId: entryStationId,
      data: {...entryData},
      editedByController: false,
      createdBy: state.loggedInUser ? state.loggedInUser.odId : (state.isCOO ? 'COO' : (state.loggedInSM ? state.loggedInSM.odId : 'Admin')),
      createdDate: formatISTDate(),
      editedBy: '',
      editedDate: '',
      status: 'Open',
      closureRemark: '',
      closedBy: '',
      closedDate: ''
    };
    
    const created = await createEntryApi(newEntry);
    if (created) {
      state.entries.push(created);
      showToast("Entry added successfully");
    } else {
      showToast("Failed to save entry", "error");
      return;
    }
  }
  
  closeDialog("entryDialog");
  render();
}

async function deleteEntry(entryId) {
  if (confirm("Are you sure you want to delete this entry?")) {
    const entry = state.entries.find(e => e.id === entryId);
    await deleteEntryApi(entryId, entry?.airtableRecordId);
    state.entries = state.entries.filter(e => e.id !== entryId);
    showToast("Entry deleted");
    render();
  }
}

// =====================================================
// IMAGE PREVIEW
// =====================================================
function openImagePreview(entryId, columnId) {
  const entry = state.entries.find(e => e.id === entryId);
  if (entry && entry.data[columnId]) {
    document.getElementById("previewImage").src = entry.data[columnId];
    openDialog("imagePreviewDialog");
  }
}

// =====================================================
// EXPORT TO EXCEL
// =====================================================
async function exportToExcel(stationId) {
  const station = state.stations.find(s => s.id === stationId);
  if (!station) return;
  
  const entries = state.entries.filter(e => e.stationId === stationId);
  
  showToast("Generating Excel file...");
  
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'PUNERI METRO Portal';
    workbook.created = new Date();
    
    const worksheet = workbook.addWorksheet(station.name, {
      views: [{ state: 'frozen', ySplit: 1 }]
    });
    
    const visibleColumns = station.columns.filter(c => !c.isDefault);
    const headers = ["SR NO", ...visibleColumns.map(c => c.name.toUpperCase()), "SC NAME", "ENTRY TIME", "CREATED DATE", "EDITED BY"];
    const imageColumns = visibleColumns.map((col, idx) => col.type === "file" ? idx + 2 : -1).filter(i => i > -1);
    
    const headerRow = worksheet.addRow(headers);
    headerRow.height = 30;
    headerRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      };
    });
    
    const CM_TO_WIDTH = 4.5;
    worksheet.columns = headers.map((header, idx) => {
      if (imageColumns.includes(idx + 1)) {
        return { width: 5 * CM_TO_WIDTH };
      }
      return { width: Math.max(header.length + 5, 15) };
    });
    
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const rowData = [i + 1];
      const rowImageData = [];
      
      for (let colIdx = 0; colIdx < visibleColumns.length; colIdx++) {
        const col = visibleColumns[colIdx];
        
        if (col.type === "file" && entry.data[col.id]) {
          rowData.push("");
          rowImageData.push({ colIndex: colIdx + 2, imageData: entry.data[col.id] });
        } else if (col.type === "date" && entry.data[col.id]) {
          rowData.push(new Date(entry.data[col.id]).toLocaleDateString());
        } else {
          rowData.push(entry.data[col.id] || "");
        }
      }
      
      rowData.push(entry.data['sc_name'] || getUserNameByOdId(entry.createdBy));
      rowData.push(entry.data['entry_time'] || '-');
      rowData.push(entry.createdDate || '-');
      rowData.push(entry.editedBy ? `${getUserNameByOdId(entry.editedBy)} (${entry.editedDate})` : '-');
      
      const row = worksheet.addRow(rowData);
      
      const hasImages = rowImageData.length > 0;
      if (hasImages) {
        row.height = 142;
      } else {
        row.height = 25;
      }
      
      row.eachCell((cell, colNumber) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
        };
        if (i % 2 === 0) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F9FA' } };
        }
      });
      
      for (const imgData of rowImageData) {
        try {
          const base64Match = imgData.imageData.match(/^data:image\/(png|jpeg|jpg|gif);base64,(.+)$/);
          if (base64Match) {
            const extension = base64Match[1] === 'jpg' ? 'jpeg' : base64Match[1];
            const base64String = base64Match[2];
            
            const imageId = workbook.addImage({ base64: base64String, extension: extension });
            
            worksheet.addImage(imageId, {
              tl: { col: imgData.colIndex - 1 + 0.1, row: row.number - 1 + 0.1 },
              ext: { width: 170, height: 170 }
            });
          }
        } catch (imgError) {
          console.error("Error adding image:", imgError);
        }
      }
    }
    
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${station.name}_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    
    showToast("Excel exported successfully!");
  } catch (error) {
    console.error("Export error:", error);
    showToast("Export failed. Please try again.", "error");
  }
}

// =====================================================
// REAL-TIME INSTRUCTION POLLING
// =====================================================
let instructionPollInterval = null;
let lastKnownInstructionCount = 0;

function startInstructionPolling() {
  if (instructionPollInterval) clearInterval(instructionPollInterval);
  lastKnownInstructionCount = state.instructions.length;
  
  instructionPollInterval = setInterval(async () => {
    // Only poll when station user is logged in
    if (state.currentView !== 'controller' || !state.loggedInUser) return;
    
    try {
      const freshInstructions = await fetchInstructions();
      if (freshInstructions.length > lastKnownInstructionCount) {
        // New instructions added
        const newOnes = freshInstructions.slice(lastKnownInstructionCount);
        state.instructions = freshInstructions;
        lastKnownInstructionCount = freshInstructions.length;
        
        // Filter for relevant instructions (COO + assigned SM)
        const relevantNew = newOnes.filter(inst => {
          if (inst.createdBySM === 'COO') return true;
          const user = state.loggedInUser;
          if (!user || !user.assignedStations || user.assignedStations.length === 0) return true;
          const smNames = [];
          for (const sm of state.smUsers) {
            if (sm.assignedStations && sm.assignedStations.length > 0) {
              const overlap = sm.assignedStations.some(sid => user.assignedStations.includes(sid));
              if (overlap) smNames.push(sm.name);
            }
          }
          return smNames.includes(inst.createdBySM);
        });
        
        if (relevantNew.length > 0) {
          showInstructionPopup(relevantNew);
        }
      }
    } catch (e) {
      console.error("Instruction poll error:", e);
    }
  }, 30000); // Poll every 30 seconds
}

function stopInstructionPolling() {
  if (instructionPollInterval) {
    clearInterval(instructionPollInterval);
    instructionPollInterval = null;
  }
}

function showInstructionPopup(newInstructions) {
  const content = document.getElementById('instructionPopupContent');
  if (!content) return;
  
  content.innerHTML = `
    <div class="instructions-list">
      ${newInstructions.map((inst, idx) => `
        <div class="instruction-item ${inst.createdBySM === 'COO' ? 'instruction-coo-priority' : ''}">
          <span class="instruction-number" ${inst.createdBySM === 'COO' ? 'style="color: #DAA520; font-weight: bold;"' : ''}>${idx + 1}.</span>
          <span class="instruction-text" ${inst.createdBySM === 'COO' ? 'style="color: #DAA520; font-weight: bold;"' : ''}>
            ${inst.createdBySM === 'COO' ? '⭐ [COO] ' : `[${inst.createdBySM}] `}${inst.text}
          </span>
        </div>
      `).join('')}
    </div>
  `;
  
  const ackCb = document.getElementById('popupAcknowledgeCheckbox');
  const ackBtn = document.getElementById('popupAcknowledgeBtn');
  if (ackCb) ackCb.checked = false;
  if (ackBtn) ackBtn.disabled = true;
  
  openDialog('instructionPopupDialog');
}

function handlePopupAcknowledge(checked) {
  const btn = document.getElementById('popupAcknowledgeBtn');
  if (btn) btn.disabled = !checked;
}

function acknowledgePopupInstruction() {
  closeDialog('instructionPopupDialog');
  showToast("Instruction acknowledged");
  // Refresh the instructions tab if visible
  render();
}

// =====================================================
// SM STATION ASSIGNMENT - Only from COO-assigned stations  
// =====================================================
function getSMAvailableStationsForUserAssignment() {
  // SM can only assign stations that COO gave them
  if (state.loggedInSM && state.loggedInSM.assignedStations && state.loggedInSM.assignedStations.length > 0) {
    return state.stations.filter(s => state.loggedInSM.assignedStations.includes(s.id));
  }
  return state.stations;
}

// =====================================================
// INITIALIZATION
// =====================================================
async function init() {
  // Check for saved session
  const savedSession = loadSession();
  if (savedSession && savedSession.currentView !== 'login') {
    // Restore session
    state.currentView = savedSession.currentView;
    state.isAdmin = savedSession.isAdmin;
    state.isCOO = savedSession.isCOO || false;
    state.loggedInUser = savedSession.loggedInUser;
    state.loggedInSM = savedSession.loggedInSM || null;
    state.selectedShift = savedSession.selectedShift;
    state.selectedStationForLogin = savedSession.selectedStationForLogin;
    state.selectedStation = savedSession.selectedStation;
    state.entryDateFilter = savedSession.entryDateFilter;
    state.adminEntryDateFilter = savedSession.adminEntryDateFilter;
    state.instructionAcknowledged = savedSession.instructionAcknowledged || false;
    
    // Refresh data for restored session
    await refreshData();
  } else {
    // Fresh load
    await loadData();
  }
  
  render();
  
  // Start instruction polling for station users
  if (state.currentView === 'controller' && state.loggedInUser) {
    startInstructionPolling();
  }
}

// Start the app
init();
