// Global Variables
let currentUser = null;
let currentRole = null;
let loginTime = null;
let loginTimer = null;
let breakTimers = {
    first: null,
    second: null,
    bio: null
};
let breakDurations = {
    first: 0,
    second: 0,
    bio: 0
};
let slotTimers = { // These are likely for manager-specific time tracking
    supervisor: null,
    audit: null
};
let slotDurations = { // These are likely for manager-specific time tracking
    supervisor: 0,
    audit: 0
};

// Sales data array (for current employee session)
let sales = [
    { type: 'Fiber', count: 0 },
    { type: 'Mobile', count: 0 },
    { type: 'Video', count: 0 }
];

// --- Call Tracking Logic (for current employee session) ---
let currentCall = null;
let callHistory = [];
let callStartTime = null;
let callEndTime = null;

// APM (Manager) to Employee mapping
const apmEmployeeMap = {
  "Bhavin Visaria": [
    "Affan Kasim Mulla", "Anisha Anthony Dsouza", "Aquib Malik Masood", "Atharv Shevale", "Biswajit Periala", "Dhaval Morabia", "Dinesh Kalade", "Gabriel Hudson Joseph", "Impreetkaut Khungura", "Mohammadumair Shaikh", "Priyesh Jagdish Gohil", "Shen Subramenian Iyer", "Tushar Singh"
  ],
  "Dinesh Nihalani": [
    "Abhijeet Bhuyer", "Abhishek Shaik Mandlik", "Aditya Mishke", "Bhavesh Anand Madave", "Heena Bhakta", "Komal Gosavi", "Mohammad Bilal Khan", "Priya Patil", "Rushi Rajendra Dhere", "Satyajit Jadhav", "Tanvi Sevkar", "Tushar More", "Viral Mane"
  ],
  "Rajendra Bajpai": [
    "Abdulla Shaikh", "Ashmita Suryawanshi", "Gavin Carvalho", "Karma Rinchen Tamang", "Mohit Prajapat", "Nagesh Sathe", "Nitesh Kshirsagar", "Pawan Raut", "Sampat Balasaheb Chavan"
  ],
  "Ameeruddin Salmani": [
    "Aarti Ashok Dhavani", "Ajaysh Ravindranath Yadav", "Chandan Mandal Singh", "Diksha Govind Makija", "Hitesh Israni", "Irfan Shaikh", "Lalit Sreekumar Nair", "Maryam Aysar Alee Tambe", "Rohit Bhise", "Roshan Raul", "Shivam Ramesh Yadav"
  ],
  "Vishal Pandey": [
    "Ajmal Shaikh", "Arya Anil", "Gandharv Singh", "Gaurav Sugare", "Girish Suresh Kumar Dubey", "Hitesh Jaisinghani", "Mimansha Subhadarshini", "Mohammad Shahid Rawabali Khan", "Om Sanjay Rajput", "Subhasree Atharthi", "Tatveer Singh", "Vikas Havale"
  ],
  "Lukas Chetty": [
    "Alfisa Ahlat", "Arjun Jog", "Ayush Ashok Bakal", "Harsh Jadhav", "Namrata Pandey", "Nisha Rati", "Piyush Tiwari", "Prabodh Kumar Bunker", "Prithviraj Gurupasad Nadkarni", "Simran Kaur Heera Singh Sandhu", "Vivek Jiaram Chudasama", "Yogesh Komre"
  ],
  "Faheem Khan": [], // Empty for now, can be populated
  "Nikita Jawkar": [], // Empty for now, can be populated
  "Ritesh Sherigar": [
    "Shagufa Abdul Salam Arai", // Corrected typo
    "MohdSiddique Shaikh",
    "Dheeraj Deepak Mhatre",
    "Sudeep Menon",
    "Raj Kataria",
    "Darshan Chaudhari",
    "Chirag Kedar",
    "Akshay Prasad",
    "Saiprasad Redkar",
    "Sushmit Palan",
    "Jagruti Shinde",
    "Vikrant Pal",
    "Honey Rawat",
    "Vikaskumar Yadav"
  ],
  "Mahesh Ghadge": [
    "Achal Gautam Vishwakarma", "Akansha Sunil Sable", "Fardeen Shakil Shaikh", "Mahak Chanderlal Wadhwani", "Mayur Maniyar", "Naznin Nadir Ahmed Sayed", "Saurabh More", "Siddhant Jayprakash Pathak", "Tahir Mohammed Khan", "Vivekraj Vinod Ghadge"
  ],
  "Melvyn Shinde": [
    "Ashutosh Waghmare", "Jatin Ajay Parab", "Kaushal Chandrashekhar Vishwakarma", "Mohammed Kaseeb Asif Ansari", "Sameer Satish Vhatkar", "Shweta Rakesh Rajoriya", "Vedant Dinesh Latke"
  ],
  "Kamala Ramanathan": [
    "Aman Indori Giri", "Hemant Kumar", "Neelak Bahubao Ghogale", "Priyanka Bandre", "Sanket Chandrakant Kharmbale", "Sanket Padwal", "Sankita Anjali Ambatti", "Sumit Subhash Patil"
  ],
  "Abdulrahim Khan": [
    "Aman Indori Giri", "Hemant Kumar", "Neelak Bahubao Ghogale", "Priyanka Bandre", "Sanket Chandrakant Kharmbale", "Sanket Padwal", "Sankita Anjali Ambatti", "Sumit Subhash Patil"
  ],
  "Craig Miranda": [
    "Meyhesh Rajaram Naik", "Mitesh Pramod Tupe", "Mohd. Faruk Jamaluddin Ansari", "Mohd. Kaushal Kumar", "Mohsin Sadiq Shaikh", "Sumit Desai", "Suresh Mendki", "Yash Jayeshwar Sathe"
  ],
  "SPM": [
    "Saumya Shetty", "Ara Khan", "Priyanka Naidu", "Siddharth Chaturvedi", "Ajay Kamti"
  ],
  "APJM": [ // Added APJM as a separate role, but will map to SPM dashboard for now
    "Ankit Sarangi" , "Gaurav Sawant"
  ],
};

// Username-password mapping (auto-generated, example passwords)
const userPasswords = {
  "Bhavin Visaria": "bv@2024!",
  "Dinesh Nihalani": "dn@2024!",
  "Rajendra Bajpai": "rb@2024!",
  "Ameeruddin Salmani": "as@2024!",
  "Vishal Pandey": "vp@2024!",
  "Lukas Chetty": "lc@2024!",
  "Faheem Khan": "fk@2024!",
  "Nikita Jawkar": "nj@2024!",
  "Ritesh Sherigar": "rs@2024!",
  "Mahesh Ghadge": "mg@2024!",
  "Melvyn Shinde": "ms@2024!",
  "Kamala Ramanathan": "kr@2024!",
  "Abdulrahim Khan": "ak@2024!",
  "Craig Miranda": "cm@2024!",
  "SPM": "spm@2024!",
  "APJM": "apjm@2024!", // Added APJM password
  "Saumya Shetty": "ss@2024!",
  "Ara Khan": "ak@2024!",
  "Priyanka Naidu": "pn@2024!",
  "Siddharth Chaturvedi": "sc@2024!",
  "Ajay Kamti": "ajk@2024!",
  "Ankit Sarangi": "ankit2024",
  "Gaurav Sawant": "gaurav2024",
  // Employees (examples, you can randomize or use a pattern)
  "Affan Kasim Mulla": "affan2024",
  "Anisha Anthony Dsouza": "anisha2024",
  "Aquib Malik Masood": "aquib2024",
  "Atharv Shevale": "atharv2024",
  "Biswajit Periala": "biswajit2024",
  "Dhaval Morabia": "dhaval2024",
  "Dinesh Kalade": "dinesh2024",
  "Gabriel Hudson Joseph": "gabriel2024",
  "Impreetkaut Khungura": "impreet2024",
  "Mohammadumair Shaikh": "umair2024",
  "Priyesh Jagdish Gohil": "priyesh2024",
  "Shen Subramenian Iyer": "shen2024",
  "Tushar Singh": "tushar2024",
  "Shagufa Abdul Salam Arai": "shagufa2024", // Corrected name to match map
  "MohdSiddique Shaikh": "mohdsiddique2024",
  "Dheeraj Deepak Mhatre": "dheeraj2024",
  "Sudeep Menon": "sudeep2024",
  "Raj Kataria": "rajkataria2024",
  "Darshan Chaudhari": "darshan2024",
  "Chirag Kedar": "chirag2024",
  "Akshay Prasad": "akshay2024",
  "Saiprasad Redkar": "saiprasad2024",
  "Sushmit Palan": "sushmit2024",
  "Jagruti Shinde": "jagruti2024",
  "Vikrant Pal": "vikrant2024",
  "Honey Rawat": "honey2024",
  "Vikaskumar Yadav": "vikaskumar2024",
  "Abhijeet Bhuyer": "abhijeet2024",
  "Abhishek Shaik Mandlik": "abhishek2024",
  "Aditya Mishke": "aditya2024",
  "Bhavesh Anand Madave": "bhavesh2024",
  "Heena Bhakta": "heena2024",
  "Komal Gosavi": "komal2024",
  "Mohammad Bilal Khan": "bilal2024",
  "Priya Patil": "priya2024",
  "Rushi Rajendra Dhere": "rushi2024",
  "Satyajit Jadhav": "satyajit2024",
  "Tanvi Sevkar": "tanvi2024",
  "Tushar More": "tusharmore2024",
  "Viral Mane": "viral2024",
  "Abdulla Shaikh": "abdulla2024",
  "Ashmita Suryawanshi": "ashmita2024",
  "Gavin Carvalho": "gavin2024",
  "Karma Rinchen Tamang": "karma2024",
  "Mohit Prajapat": "mohit2024",
  "Nagesh Sathe": "nagesh2024",
  "Nitesh Kshirsagar": "nitesh2024",
  "Pawan Raut": "pawan2024",
  "Sampat Balasaheb Chavan": "sampat2024",
  "Aarti Ashok Dhavani": "aarti2024",
  "Ajaysh Ravindranath Yadav": "ajaysh2024",
  "Chandan Mandal Singh": "chandan2024",
  "Diksha Govind Makija": "diksha2024",
  "Hitesh Israni": "hitesh2024",
  "Irfan Shaikh": "irfan2024",
  "Lalit Sreekumar Nair": "lalit2024",
  "Maryam Aysar Alee Tambe": "maryam2024",
  "Rohit Bhise": "rohit2024",
  "Roshan Raul": "roshan2024",
  "Shivam Ramesh Yadav": "shivam2024",
  "Ajmal Shaikh": "ajmal2024",
  "Arya Anil": "arya2024",
  "Gandharv Singh": "gandharv2024",
  "Gaurav Sugare": "gauravs2024",
  "Girish Suresh Kumar Dubey": "girish2024",
  "Hitesh Jaisinghani": "hiteshj2024",
  "Mimansha Subhadarshini": "mimansha2024",
  "Mohammad Shahid Rawabali Khan": "shahid2024",
  "Om Sanjay Rajput": "om2024",
  "Subhasree Atharthi": "subhasree2024",
  "Tatveer Singh": "tatveer2024",
  "Vikas Havale": "vikash2024",
  "Alfisa Ahlat": "alfisa2024",
  "Arjun Jog": "arjun2024",
  "Ayush Ashok Bakal": "ayush2024",
  "Harsh Jadhav": "harsh2024",
  "Namrata Pandey": "namrata2024",
  "Nisha Rati": "nisha2024",
  "Piyush Tiwari": "piyush2024",
  "Prabodh Kumar Bunker": "prabodh2024",
  "Prithviraj Gurupasad Nadkarni": "prithviraj2024",
  "Simran Kaur Heera Singh Sandhu": "simran2024",
  "Vivek Jiaram Chudasama": "vivek2024",
  "Yogesh Komre": "yogesh2024",
  "Achal Gautam Vishwakarma": "achal2024",
  "Akansha Sunil Sable": "akansha2024",
  "Fardeen Shakil Shaikh": "fardeen2024",
  "Mahak Chanderlal Wadhwani": "mahak2024",
  "Mayur Maniyar": "mayur2024",
  "Naznin Nadir Ahmed Sayed": "naznin2024",
  "Saurabh More": "saurabh2024",
  "Siddhant Jayprakash Pathak": "siddhant2024",
  "Tahir Mohammed Khan": "tahir2024",
  "Vivekraj Vinod Ghadge": "vivekraj2024",
  "Ashutosh Waghmare": "ashutosh2024",
  "Jatin Ajay Parab": "jatin2024",
  "Kaushal Chandrashekhar Vishwakarma": "kaushal2024",
  "Mohammed Kaseeb Asif Ansari": "kaseeb2024",
  "Sameer Satish Vhatkar": "sameer2024",
  "Shweta Rakesh Rajoriya": "shweta2024",
  "Vedant Dinesh Latke": "vedant2024",
  "Aman Indori Giri": "aman2024",
  "Hemant Kumar": "hemant2024",
  "Neelak Bahubao Ghogale": "neelak2024",
  "Priyanka Bandre": "priyankab2024",
  "Sanket Chandrakant Kharmbale": "sanketk2024",
  "Sanket Padwal": "sanketp2024",
  "Sankita Anjali Ambatti": "sankita2024",
  "Sumit Subhash Patil": "sumit2024",
  "Meyhesh Rajaram Naik": "meyhesh2024",
  "Mitesh Pramod Tupe": "mitesh2024",
  "Mohd. Faruk Jamaluddin Ansari": "faruk2024",
  "Mohd. Kaushal Kumar": "kaushal2024",
  "Mohsin Sadiq Shaikh": "mohsin2024",
  "Sumit Desai": "sumitd2024",
  "Suresh Mendki": "suresh2024",
  "Yash Jayeshwar Sathe": "yash2024",
};

// Initialize session on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add input validation for Sequence ID
    const sequenceIdInput = document.getElementById('sequenceId');
    if (sequenceIdInput) {
        sequenceIdInput.addEventListener('input', function(e) {
            // Remove any non-numeric characters
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        
        // Prevent paste of non-numeric content
        sequenceIdInput.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const numericOnly = pastedText.replace(/[^0-9]/g, '');
            this.value = numericOnly;
        });
    }
    
    const savedSession = localStorage.getItem('session');
    
    if (savedSession) {
        let session;
        try {
            session = JSON.parse(savedSession);
        } catch (error) {
            console.error('Error parsing session:', error);
            localStorage.removeItem('session');
            return;
        }
        
        // Check if session has expired (24 hours timeout)
        const sessionTime = new Date(session.loginTime);
        const currentTime = new Date();
        const sessionAge = currentTime - sessionTime;
        const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        if (sessionAge > maxSessionAge) {
            // Session expired, clear it
            localStorage.removeItem('session');
            localStorage.removeItem(`callHistory_${normalizeName(session.username)}`); // Clear specific history
            localStorage.removeItem(`sales_${normalizeName(session.username)}`); // Clear specific sales
            localStorage.removeItem(`employeeStatus_${normalizeName(session.username)}`); // Clear employee status
            console.log('Session expired (24 hours), cleared automatically');
            return;
        }
        
        currentUser = session.username;
        currentRole = session.role;
        loginTime = new Date(session.loginTime);
        
        // Update slot durations (timers will be restarted when user clicks start)
        if (session.slotDurations) {
            Object.assign(slotDurations, session.slotDurations);
            Object.keys(slotDurations).forEach(key => {
                updateSlotDisplay(key);
            });
        }
        
        // Show dashboard and hide login
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        
        // Show appropriate dashboard based on role
        showDashboardForRole(currentRole);
        
        // Start login timer
        startLoginTimer();
        
        // Update break display with saved values (timers will be restarted when user clicks start)
        if (session.breakDurations) {
            Object.assign(breakDurations, session.breakDurations);
            updateBreakDisplay();
        }
        
        // Update username display
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = currentUser;
        }

        // Load call history and sales for the current user
        const savedCallHistory = localStorage.getItem(`callHistory_${normalizeName(currentUser)}`);
        if (savedCallHistory) {
            callHistory = JSON.parse(savedCallHistory);
        } else {
            callHistory = [];
        }

        const savedSales = localStorage.getItem(`sales_${normalizeName(currentUser)}`);
        if (savedSales) {
            sales = JSON.parse(savedSales);
            updateSalesList();
            updateTotalSales();
        } else {
            sales = [{ type: 'Fiber', count: 0 }, { type: 'Mobile', count: 0 }, { type: 'Video', count: 0 }];
        }
        
        updateCallSummary(); // Update employee's own call summary table
        
        // Update session status and load additional data
        updateSessionStatus();
        
        // Load daily update and marquee announcement
        loadDailyUpdate(); // This now loads from global keys
        loadMarqueeAnnouncement(); // This now loads from global keys
        
        // Ensure call button event listeners are attached for restored session
        const startCallBtn = document.getElementById('startCallBtn');
        const endCallBtn = document.getElementById('endCallBtn');
        
        if (startCallBtn) {
            startCallBtn.removeEventListener('click', startCall); // Prevent duplicate listeners
            startCallBtn.addEventListener('click', startCall);
        }
        
        if (endCallBtn) {
            endCallBtn.removeEventListener('click', endCall); // Prevent duplicate listeners
            endCallBtn.addEventListener('click', endCall);
        }

        // If manager, start manager specific updates
        if (currentRole === 'manager') {
            startManagerDashboardRealtimeUpdates();
        } else if (currentRole === 'spm' || currentRole === 'apjm') { // Handle APJM as SPM
            setupSPMDashboardUpdates();
        }
    } else {
        // No session exists, ensure login page is visible and data is cleared
        document.getElementById('loginContainer').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
        callHistory = [];
        sales = [{ type: 'Fiber', count: 0 }, { type: 'Mobile', count: 0 }, { type: 'Video', count: 0 }];
        localStorage.removeItem('callHistory'); // Clear generic key if it exists
        localStorage.removeItem('sales'); // Clear generic key if it exists
        
        const tbody = document.getElementById('callSummaryTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="13" style="text-align: center; color: #FFA07A; font-style: italic;">
                        No calls recorded yet. Start a call to see details here.
                    </td>
                </tr>
            `;
        }
    }
    
    // Add event listeners for call start/end buttons (ensure they are always attached)
    const startCallBtn = document.getElementById('startCallBtn');
    const endCallBtn = document.getElementById('endCallBtn');
    if (startCallBtn) {
        startCallBtn.removeEventListener('click', startCall); // Remove existing to prevent duplicates
        startCallBtn.addEventListener('click', startCall);
    }
    if (endCallBtn) {
        endCallBtn.removeEventListener('click', endCall); // Remove existing to prevent duplicates
        endCallBtn.addEventListener('click', endCall);
    }
    
    // Add test button event listener
    const testCallBtn = document.getElementById('testCallBtn');
    if (testCallBtn) {
        testCallBtn.addEventListener('click', addTestCall);
    }
    
    // Update call data when sales change (re-attach if needed)
    const cpcDropdown = document.getElementById('cpcDropdown');
    if (cpcDropdown) {
        cpcDropdown.removeEventListener('change', updateCurrentCallData);
        cpcDropdown.addEventListener('change', updateCurrentCallData);
    }
    
    document.querySelectorAll('.call-step, .preferred-contact-method').forEach(cb => {
        cb.removeEventListener('change', updateCurrentCallData);
        cb.addEventListener('change', updateCurrentCallData);
    });

    // Add event listener for Pull Call Steps to Summary button
    const pullStepsBtn = document.getElementById('pullStepsBtn');
    if (pullStepsBtn) {
        pullStepsBtn.removeEventListener('click', updateCheckedStepsSummary);
        pullStepsBtn.addEventListener('click', updateCheckedStepsSummary);
    }

    // Password visibility toggle
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword && passwordInput) {
        togglePassword.removeEventListener('click', togglePasswordVisibility); // Prevent duplicates
        togglePassword.addEventListener('click', togglePasswordVisibility);
    }
    
    // Load daily update for all users (only if elements exist)
    loadDailyUpdate();
    loadMarqueeAnnouncement();
    
    // Initialize call summary table (employee's own)
    updateCallSummary();
    
    // Update session status periodically
    setInterval(updateSessionStatus, 60000); // Update every minute

    // Initial display of call status section based on role
    const callStatusSection = document.getElementById('callStatusSection');
    if (callStatusSection) {
        if (currentRole === 'employee') {
            callStatusSection.style.display = 'block';
        } else {
            callStatusSection.style.display = 'none';
        }
    }

    // Attach event listeners for manager publish buttons if manager dashboard elements exist
    const managerMarqueeInput = document.getElementById('managerMarqueeInput');
    const publishMarqueeBtn = document.getElementById('publishMarqueeBtn');
    if (managerMarqueeInput && publishMarqueeBtn) {
        publishMarqueeBtn.removeEventListener('click', publishMarquee); // Prevent duplicates
        publishMarqueeBtn.addEventListener('click', publishMarquee);
    }

    const managerDailyUpdateInput = document.getElementById('managerDailyUpdateInput');
    const publishDailyUpdateBtn = document.getElementById('publishDailyUpdateBtn');
    if (managerDailyUpdateInput && publishDailyUpdateBtn) {
        publishDailyUpdateBtn.removeEventListener('click', publishDailyUpdate); // Prevent duplicates
        publishDailyUpdateBtn.addEventListener('click', publishDailyUpdate);
    }
    updateMarqueeDisplays(); // Ensure manager's own dashboard shows latest published content
});

// Password visibility toggle function
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    
    if (passwordInput && togglePassword) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePassword.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            togglePassword.textContent = '👁️';
        }
    }
}

// Update session status display
function updateSessionStatus() {
    const sessionStatus = document.getElementById('sessionStatus');
    if (sessionStatus && currentUser) {
        const savedSession = localStorage.getItem('session');
        if (savedSession) {
            const session = JSON.parse(savedSession);
            const sessionTime = new Date(session.loginTime);
            const currentTime = new Date();
            const sessionAge = currentTime - sessionTime;
            const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
            
            if (sessionAge > maxSessionAge) {
                sessionStatus.textContent = 'Session: Expired';
                sessionStatus.style.color = '#ff6b6b';
            } else {
                const remainingHours = Math.max(0, 24 - Math.floor(sessionAge / (60 * 60 * 1000)));
                sessionStatus.textContent = `Session: Persistent (${remainingHours}h remaining)`;
                sessionStatus.style.color = '#90EE90';
            }
        }
    }
}

// Login/Logout Functions
function handleLogin() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const roleSelect = document.getElementById('userRole');

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const role = roleSelect.value;
    
    // Basic validation
    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    // Check password
    if (userPasswords[username] !== password) {
        alert('Incorrect username or password.');
        return;
    }

    let foundUser = false;
    let assignedManager = null;

    // Determine the user's actual role and if they are authorized
    if (role === 'employee') {
        for (const [apm, employees] of Object.entries(apmEmployeeMap)) {
            if (employees.includes(username)) {
                foundUser = true;
                assignedManager = apm;
                break;
            }
        }
        if (!foundUser) {
            alert('Employee name not found or not assigned to a manager. Please check your name.');
            return;
        }
    } else if (role === 'manager') {
        if (!apmEmployeeMap[username] || apmEmployeeMap[username].length === 0) { // Managers must exist in the map
            alert('Manager name not found. Please enter your exact name.');
            return;
        }
        foundUser = true;
    } else if (role === 'spm' || role === 'apjm') { // Treat APJM as SPM for dashboard logic
        const spmTeam = apmEmployeeMap['SPM'] || [];
        const apjmTeam = apmEmployeeMap['APJM'] || [];
        if (!spmTeam.includes(username) && !apjmTeam.includes(username)) {
            alert('SPM/APJM access is restricted. Please use the correct credentials.');
            return;
        }
        foundUser = true;
    }

    if (!foundUser) {
        alert('Authentication failed. Please check your credentials and role.');
        return;
    }

    currentUser = username;
    currentRole = role;
    loginTime = new Date();
    
    saveSession(); // Save session to localStorage
    
    // Set employee status to online
    if (currentRole === 'employee') {
        handleEmployeeLogin(currentUser);
        localStorage.setItem('employeeManager', assignedManager); // Store manager for this employee
    }

    // Show dashboard and hide login
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    
    // Display correct dashboard based on role
    showDashboardForRole(currentRole);
    
    // Update username display
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = currentUser;
    }

    // Start login timer
    startLoginTimer();
    
    // Load data specific to the user's role
    if (currentRole === 'employee') {
        const savedCallHistory = localStorage.getItem(`callHistory_${normalizeName(currentUser)}`);
        if (savedCallHistory) {
            callHistory = JSON.parse(savedCallHistory);
        } else {
            callHistory = [];
        }

        const savedSales = localStorage.getItem(`sales_${normalizeName(currentUser)}`);
        if (savedSales) {
            sales = JSON.parse(savedSales);
            updateSalesList();
            updateTotalSales();
        } else {
            sales = [{ type: 'Fiber', count: 0 }, { type: 'Mobile', count: 0 }, { type: 'Video', count: 0 }];
        }
        updateCallSummary();
    } else if (currentRole === 'manager') {
        startManagerDashboardRealtimeUpdates(); // Start manager real-time updates
    } else if (currentRole === 'spm' || currentRole === 'apjm') {
        updateSPMDashboard();
        setupSPMDashboardUpdates();
    }

    loadDailyUpdate();
    loadMarqueeAnnouncement();
    updateSessionStatus();
}

function saveSession() {
    const session = {
        username: currentUser,
        role: currentRole,
        loginTime: loginTime.toISOString(),
        breakDurations: breakDurations,
        slotDurations: slotDurations
    };
    localStorage.setItem('session', JSON.stringify(session));
}

function forceLogout() {
    // Clear all session data immediately
    localStorage.clear(); // Clear all localStorage for a fresh start

    // Clear all timers
    clearInterval(loginTimer);
    Object.keys(breakTimers).forEach(key => {
        if (breakTimers[key]) {
            clearInterval(breakTimers[key]);
            breakTimers[key] = null;
        }
    });
    Object.keys(slotTimers).forEach(key => {
        if (slotTimers[key]) {
            clearInterval(slotTimers[key]);
            slotTimers[key] = null;
        }
    });
    if (window.managerDashboardInterval) {
        clearInterval(window.managerDashboardInterval);
        window.managerDashboardInterval = null;
    }
    if (window.spmDashboardInterval) {
        clearInterval(window.spmDashboardInterval);
        window.spmDashboardInterval = null;
    }
    
    // Reset all variables
    currentUser = null;
    currentRole = null;
    loginTime = null;
    callHistory = [];
    sales = [{ type: 'Fiber', count: 0 }, { type: 'Mobile', count: 0 }, { type: 'Video', count: 0 }];
    breakDurations = { first: 0, second: 0, bio: 0 };
    slotDurations = { supervisor: 0, audit: 0 };

    // Show login and hide dashboard
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    
    // Clear login form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('userRole').value = 'employee';
    
    // Clear display elements
    document.getElementById('loginHours').textContent = '00:00:00';
    document.getElementById('userName').textContent = '';
    updateBreakDisplay();
    updateSalesList();
    updateTotalSales();
    updateCallSummary(); // Clear employee's table
    
    // Reset manager/SPM specific displays
    const managerMarqueeInput = document.getElementById('managerMarqueeInput');
    if (managerMarqueeInput) managerMarqueeInput.value = '';
    const managerDailyUpdateInput = document.getElementById('managerDailyUpdateInput');
    if (managerDailyUpdateInput) managerDailyUpdateInput.value = '';
    const managerMarqueeContent = document.getElementById('managerMarqueeContent');
    if (managerMarqueeContent) managerMarqueeContent.textContent = '';
    const managerDailyUpdateContent = document.getElementById('managerDailyUpdateContent');
    if (managerDailyUpdateContent) managerDailyUpdateContent.textContent = '';
    const spmDailyUpdate = document.getElementById('spmDailyUpdate');
    if (spmDailyUpdate) spmDailyUpdate.value = '';
    const spmMarquee = document.getElementById('spmMarquee');
    if (spmMarquee) spmMarquee.value = '';

    // Hide all dashboards
    showDashboardForRole('none'); 

    alert('Force logout completed. All session data cleared.');
}

function handleLogout() {
    clearInterval(loginTimer);
    
    // Clear slot timers and reset durations
    Object.keys(slotTimers).forEach(key => {
        if (slotTimers[key]) {
            clearInterval(slotTimers[key]);
            slotTimers[key] = null;
            slotDurations[key] = 0;
            const button = document.querySelector(`button[onclick*="${key}"]`);
            if (button) button.textContent = `Start ${key.charAt(0).toUpperCase() + key.slice(1)}`;
            const durationEl = document.getElementById(`${key}Duration`);
            if (durationEl) durationEl.textContent = '00:00';
            const summaryEl = document.getElementById(`summary${key.charAt(0).toUpperCase() + key.slice(1)}`);
            if (summaryEl) summaryEl.textContent = '00:00';
        }
    });
    
    // Hide manager summary
    const managerSummary = document.querySelector('.manager-summary');
    if (managerSummary) managerSummary.style.display = 'none';
    
    // Clear current user's specific localStorage data
    if (currentUser) {
        localStorage.removeItem(`session`);
        localStorage.removeItem(`callHistory_${normalizeName(currentUser)}`);
        localStorage.removeItem(`sales_${normalizeName(currentUser)}`);
        localStorage.removeItem(`employeeStatus_${normalizeName(currentUser)}`);
    }
    
    currentUser = null;
    currentRole = null;
    loginTime = null;
    
    // Reset all inputs
    document.getElementById('username').value = '';
    document.getElementById('password').value = ''; // Clear password field on logout
    document.getElementById('userRole').value = 'employee';
    
    // Reset break display
    breakDurations = { first: 0, second: 0, bio: 0 };
    updateBreakDisplay();
    
    // Reset manager dashboard specific intervals
    if (window.managerDashboardInterval) {
        clearInterval(window.managerDashboardInterval);
        window.managerDashboardInterval = null;
    }
    if (window.spmDashboardInterval) {
        clearInterval(window.spmDashboardInterval);
        window.spmDashboardInterval = null;
    }

    // Show login and hide dashboard
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    
    // Clear call summary table and call history for the current view
    callHistory = [];
    sales = [{ type: 'Fiber', count: 0 }, { type: 'Mobile', count: 0 }, { type: 'Video', count: 0 }];
    updateCallSummary(); // This will show the "No calls recorded" message
    updateSalesList();
    updateTotalSales();

    // Clear progress report display if it was visible
    const salesDonutChart = document.getElementById('salesDonutChart');
    if (salesDonutChart) {
        const ctx = salesDonutChart.getContext('2d');
        ctx.clearRect(0, 0, salesDonutChart.width, salesDonutChart.height);
    }
    const callCodingMetrics = document.getElementById('callCodingMetrics');
    if (callCodingMetrics) {
        callCodingMetrics.innerHTML = `
            <div class="metric">
                <span class="metric-label">Total DXST:</span>
                <span class="metric-value">0</span>
            </div>
            <div class="metric">
                <span class="metric-label">Total Sequence ID:</span>
                <span class="metric-value">0</span>
            </div>
            <div class="metric">
                <span class="metric-label">Call Coding Ratio:</span>
                <span class="metric-value">0%</span>
            </div>
        `;
    }
    
    // Update employee status to offline
    if (currentUser) { // Use the currentUser from before it was nulled
        handleEmployeeLogout(currentUser);
    }
    
    // Hide all dashboards explicitly
    showDashboardForRole('none');
}

// Break Tracking Functions
function toggleBreak(type) {
    const button = document.querySelector(`button[onclick*="${type}"]`);
    
    if (breakTimers[type]) {
        clearInterval(breakTimers[type]);
        breakTimers[type] = null;
        button.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} Break`;
        handleEmployeeBreak(currentUser, 'none'); // Employee ends break
    } else {
        // Ensure only one break is active at a time
        Object.keys(breakTimers).forEach(key => {
            if (breakTimers[key]) {
                clearInterval(breakTimers[key]);
                breakTimers[key] = null;
                const otherButton = document.querySelector(`button[onclick*="${key}"]`);
                if (otherButton) otherButton.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)} Break`;
            }
        });

        breakTimers[type] = setInterval(() => {
            breakDurations[type] += 1;
            updateBreakDisplay();
            saveSession(); // Save session frequently during break
        }, 1000);
        button.textContent = `End ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        handleEmployeeBreak(currentUser, type); // Employee starts break
    }
    saveSession(); // Save break state
}

function updateBreakDisplay() {
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const firstBreakEl = document.getElementById('firstBreak');
    if (firstBreakEl) firstBreakEl.textContent = formatTime(breakDurations.first);
    const secondBreakEl = document.getElementById('secondBreak');
    if (secondBreakEl) secondBreakEl.textContent = formatTime(breakDurations.second);
    const bioBreakEl = document.getElementById('bioBreak');
    if (bioBreakEl) bioBreakEl.textContent = formatTime(breakDurations.bio);
    
    // Calculate total break time
    const totalBreakSeconds = breakDurations.first + breakDurations.second + breakDurations.bio;
    const totalBreakEl = document.getElementById('totalBreak');
    if (totalBreakEl) totalBreakEl.textContent = formatTime(totalBreakSeconds);
    const summaryBreakEl = document.getElementById('summaryBreak');
    if (summaryBreakEl) summaryBreakEl.textContent = formatTime(totalBreakSeconds);
}

// Sales Tracking Functions
function addSale() {
    const fiberInput = document.getElementById('Fiber');
    const mobileInput = document.getElementById('Mobile');
    const videoInput = document.getElementById('Video');

    const fiberCount = parseInt(fiberInput ? fiberInput.value : '0') || 0;
    const mobileCount = parseInt(mobileInput ? mobileInput.value : '0') || 0;
    const videoCount = parseInt(videoInput ? videoInput.value : '0') || 0;

    if (fiberCount < 0 || mobileCount < 0 || videoCount < 0) {
        alert('Please enter valid (non-negative) numbers for sales.');
        return;
    }

    // Update sales array
    sales.find(s => s.type === 'Fiber').count += fiberCount;
    sales.find(s => s.type === 'Mobile').count += mobileCount;
    sales.find(s => s.type === 'Video').count += videoCount;

    updateSalesList();
    updateTotalSales();
    localStorage.setItem(`sales_${normalizeName(currentUser)}`, JSON.stringify(sales)); // Save sales specific to user

    // Clear inputs
    if (fiberInput) fiberInput.value = '';
    if (mobileInput) mobileInput.value = '';
    if (videoInput) videoInput.value = '';

    // Update current call's sales data if a call is active
    if (currentCall) {
        currentCall.sales = {
            Fiber: sales.find(s => s.type === 'Fiber').count,
            Mobile: sales.find(s => s.type === 'Mobile').count,
            Video: sales.find(s => s.type === 'Video').count
        };
        updateCallSummary(); // Refresh summary to show updated sales
    }
}

function updateSalesList() {
    const salesList = document.getElementById('salesItems');
    if (!salesList) return;
    salesList.innerHTML = '';
    sales.forEach(sale => {
        if (sale.count > 0) {
            const li = document.createElement('li');
            li.innerHTML = `<span>${sale.type}</span><span>Count: ${sale.count}</span>`;
            salesList.appendChild(li);
        }
    });
}

function updateTotalSales() {
    const total = sales.reduce((sum, sale) => sum + sale.count, 0);
    const totalSalesEl = document.getElementById('totalSales');
    if (totalSalesEl) totalSalesEl.textContent = total;
    const summarySalesEl = document.getElementById('summarySales');
    if (summarySalesEl) summarySalesEl.textContent = total;
}

// Email Function
function sendEmail() {
    const totalBreak = document.getElementById('summaryBreak')?.textContent || '00:00';
    const totalSales = document.getElementById('summarySales')?.textContent || '0';
    const loginHours = document.getElementById('loginHours')?.textContent || '00:00:00';
    const checked = Array.from(document.querySelectorAll('.call-step:checked')).map(cb => cb.value);
    const userName = document.getElementById('userName')?.textContent || currentUser || 'Unknown';
    const cpcValue = document.getElementById('cpcDropdown')?.value || 'None';
    const preferred = Array.from(document.querySelectorAll('.preferred-contact-method:checked')).map(cb => cb.value);
    const latestCallDetails = document.getElementById('summaryCallDetails')?.textContent || 'No active call';

    let emailBody = `Employee Summary:\n\n` +
        `Login Person: ${userName}\n` +
        `Login Hours: ${loginHours}\n` +
        `Total Break Time: ${totalBreak}\n` +
        `Total Sales: ${totalSales}\n` +
        `Checked Call Steps: ${checked.length ? checked.join(', ') : 'None'}\n` +
        `CPC: ${cpcValue}\n` +
        `Preferred Contact: ${preferred.length ? preferred.join(', ') : 'None'}\n` +
        `Latest Call Details: ${latestCallDetails}\n\n`;

    if (currentRole === 'manager') {
        emailBody += `Manager Summary:\n`;
        Object.keys(slotDurations).forEach(type => {
            const time = document.getElementById(`${type}Duration`)?.textContent || '00:00';
            emailBody += `${type.charAt(0).toUpperCase() + type.slice(1)} Time: ${time}\n`;
        });
    }
    
    // Use a custom message box instead of alert
    const message = `Email draft generated. You can now send it to your manager.`;
    const emailLink = `mailto:manager@example.com?subject=Employee%20Summary%20for%20${encodeURIComponent(userName)}&body=${encodeURIComponent(emailBody)}`;
    
    showCustomMessageBox(message, () => {
        window.location.href = emailLink;
    });

    // Clear sales history after sending summary
    sales.forEach(sale => sale.count = 0);
    updateSalesList();
    updateTotalSales();
    localStorage.setItem(`sales_${normalizeName(currentUser)}`, JSON.stringify(sales));

    // Clear all checkboxes after sending summary
    document.querySelectorAll('.call-step').forEach(cb => cb.checked = false);
    updateCheckedStepsSummary();
    // Clear CPC and preferred contact fields after sending
    const cpcDropdown = document.getElementById('cpcDropdown');
    if (cpcDropdown) cpcDropdown.value = '';
    document.querySelectorAll('.preferred-contact-method').forEach(cb => cb.checked = false);
    updateCPCAndPreferredContactSummary();

    // Clear call status checkboxes
    [
        'goodCallYes', 'goodCallNo', 'issueResolvedYes', 'issueResolvedNo',
        'surveyPitchYes', 'surveyPitchNo', 'promoterCallYes', 'promoterCallNo'
    ].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.checked = false;
    });
}

// Custom Message Box (instead of alert)
function showCustomMessageBox(message, callback = null) {
    let messageBox = document.getElementById('customMessageBox');
    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.id = 'customMessageBox';
        messageBox.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(3, 5, 91, 0.95);
            border: 2px solid #FFA07A;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 0 20px rgba(255, 160, 122, 0.5);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            color: #fff;
            font-size: 1.1em;
            text-align: center;
            max-width: 80%;
        `;
        const messageText = document.createElement('p');
        messageText.id = 'messageBoxText';
        messageText.style.marginBottom = '10px';
        messageBox.appendChild(messageText);

        const closeButton = document.createElement('button');
        closeButton.textContent = 'OK';
        closeButton.className = 'neon-btn';
        closeButton.onclick = () => {
            messageBox.style.display = 'none';
            if (callback) callback();
        };
        messageBox.appendChild(closeButton);
        document.body.appendChild(messageBox);
    } else {
        messageBox.style.display = 'flex';
    }
    document.getElementById('messageBoxText').textContent = message;
}


// Login/Logout Functions
function startLoginTimer() {
    if (loginTimer) clearInterval(loginTimer); // Clear any existing timer
    loginTimer = setInterval(updateLoginHours, 1000);
}

function updateLoginHours() {
    if (loginTime) {
        const currentTime = new Date();
        const sessionDuration = currentTime - loginTime;
        
        // Convert milliseconds to hours:minutes:seconds
        const hours = Math.floor(sessionDuration / (1000 * 60 * 60));
        const minutes = Math.floor((sessionDuration % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((sessionDuration % (1000 * 60)) / 1000);
        
        // Format duration
        const formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update login hours display
        const loginHoursElement = document.getElementById('loginHours');
        if (loginHoursElement) {
            loginHoursElement.textContent = formattedDuration;
        }
        // Update employee status with current login duration
        if (currentUser && currentRole === 'employee') {
            const status = getEmployeeStatus(currentUser) || {};
            status.loginDuration = sessionDuration; // Store in milliseconds
            setEmployeeStatus(currentUser, status);
        }
    }
}

// Slot Functions (for manager's own time tracking)
function toggleSlot(type) {
    const button = document.querySelector(`button[onclick*="${type}"]`);
    
    if (slotTimers[type]) {
        clearInterval(slotTimers[type]);
        slotTimers[type] = null;
        button.textContent = `Start ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    } else {
        slotTimers[type] = setInterval(() => {
            slotDurations[type] += 1;
            updateSlotDisplay(type);
            updateManagerSummary(); // Update summary when slot changes
        }, 1000);
        button.textContent = `End ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    }
    saveSession(); // Save slot state
}

function updateSlotDisplay(type) {
    const seconds = slotDurations[type];
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    
    // Only update if the element exists
    const durationElement = document.getElementById(`${type}Duration`);
    if (durationElement) {
        durationElement.textContent = formattedTime;
    }
    
    // Update summary if manager and element exists
    if (currentRole === 'manager') {
        const summaryElement = document.getElementById(`summary${type.charAt(0).toUpperCase() + type.slice(1)}`);
        if (summaryElement) {
            summaryElement.textContent = formattedTime;
        }
    }
}

function updateManagerSummary() {
    if (currentRole === 'manager') {
        const managerSummary = document.querySelector('.manager-summary');
        if (managerSummary) {
            managerSummary.style.display = 'block';
        }
        
        Object.keys(slotDurations).forEach(type => {
            const seconds = slotDurations[type];
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            
            const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
            const summaryElement = document.getElementById(`summary${type.charAt(0).toUpperCase() + type.slice(1)}`);
            if (summaryElement) {
                summaryElement.textContent = formattedTime;
            }
        });
    }
}

// Function to update the checked steps summary
function updateCheckedStepsSummary() {
    const checked = Array.from(document.querySelectorAll('.call-step:checked')).map(cb => cb.value);
    const checkedStepsEl = document.getElementById('checkedSteps');
    if (checkedStepsEl) checkedStepsEl.textContent = checked.length ? checked.join(', ') : 'None';
}

// Attach event listeners and initialize summary on page load
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.call-step').forEach(cb => {
        cb.removeEventListener('change', updateCheckedStepsSummary); // Prevent duplicates
        cb.addEventListener('change', updateCheckedStepsSummary);
    });
    updateCheckedStepsSummary();
});

// Add a button to pull call handling steps into summary (ensure it's not duplicated)
if (!document.getElementById('pullStepsBtn')) {
    const btn = document.createElement('button');
    btn.id = 'pullStepsBtn';
    btn.className = 'neon-btn';
    btn.textContent = 'Pull Call Steps to Summary';
    btn.onclick = updateCheckedStepsSummary;
    const checkboxSection = document.getElementById('checkboxSection');
    if (checkboxSection) checkboxSection.appendChild(btn);
}

// --- CPC and Preferred Contact Logic ---
function updateCPCAndPreferredContactSummary() {
    const cpcDropdown = document.getElementById('cpcDropdown');
    const cpcValue = cpcDropdown ? cpcDropdown.value : '';
    const summaryCPCEl = document.getElementById('summaryCPC');
    if (summaryCPCEl) summaryCPCEl.textContent = cpcValue || 'None';
    
    const preferred = Array.from(document.querySelectorAll('.preferred-contact-method:checked')).map(cb => cb.value);
    const summaryPreferredContactEl = document.getElementById('summaryPreferredContact');
    if (summaryPreferredContactEl) summaryPreferredContactEl.textContent = preferred.length ? preferred.join(', ') : 'None';
}
document.getElementById('cpcDropdown')?.addEventListener('change', updateCPCAndPreferredContactSummary);
document.querySelectorAll('.preferred-contact-method').forEach(cb => {
    cb.addEventListener('change', updateCPCAndPreferredContactSummary);
});
window.addEventListener('DOMContentLoaded', updateCPCAndPreferredContactSummary);

// --- Call Tracking Logic ---
function startCall() {
    const sequenceIdInput = document.getElementById('sequenceId');
    if (!sequenceIdInput) {
        showCustomMessageBox('Sequence ID input not found. Please refresh the page.');
        return;
    }
    
    const sequenceId = sequenceIdInput.value.trim();
    
    if (!sequenceId) {
        showCustomMessageBox('Please enter Sequence ID to start a call.');
        return;
    }
    
    currentCall = {
        id: Date.now(),
        sequenceId,
        dxstNumber: '', // Will be set before ending call
        sales: { Fiber: sales.find(s => s.type === 'Fiber').count, Mobile: sales.find(s => s.type === 'Mobile').count, Video: sales.find(s => s.type === 'Video').count },
        cpc: '',
        callSteps: [],
        preferredContact: [],
        goodCall: '',
        issueResolved: '',
        surveyPitch: '',
        promoterCall: '',
        startTime: new Date().toISOString(),
        endTime: '',
        duration: 0
    };
    callStartTime = new Date();
    
    // Clear sequence ID input after starting call
    sequenceIdInput.value = '';
    
    // Show end call button and hide start call button
    const startCallBtn = document.getElementById('startCallBtn');
    const endCallBtn = document.getElementById('endCallBtn');
    if (startCallBtn) startCallBtn.style.display = 'none';
    if (endCallBtn) endCallBtn.style.display = 'inline-block';
    
    updateCallSummary();
    showCustomMessageBox('Call started! Complete the call steps, add DXST Number, and add sales, then end the call.');
}

function endCall() {
    if (!currentCall) {
        showCustomMessageBox('No active call to end.');
        return;
    }
    
    // Get DXST Number from input field
    const dxstInput = document.getElementById('dxstNumber');
    let dxstNumber = dxstInput ? dxstInput.value.trim() : '';
    
    // If DXST is 'NA', empty, or null, store as -1
    if (dxstNumber === '' || dxstNumber.toUpperCase() === 'NA' || dxstNumber === null) {
        dxstNumber = 'N/A'; // Store as 'N/A' for clearer display
    }
    
    // Update current call with DXST Number
    currentCall.dxstNumber = dxstNumber;
    
    // Capture current state of sales, CPC, call steps, etc.
    currentCall.sales = {
        Fiber: sales.find(s => s.type === 'Fiber').count,
        Mobile: sales.find(s => s.type === 'Mobile').count,
        Video: sales.find(s => s.type === 'Video').count
    };
    currentCall.cpc = document.getElementById('cpcDropdown')?.value || '';
    currentCall.callSteps = Array.from(document.querySelectorAll('.call-step:checked')).map(cb => cb.value);
    currentCall.preferredContact = Array.from(document.querySelectorAll('.preferred-contact-method:checked')).map(cb => cb.value);

    // Set Call Status values
    currentCall.goodCall = document.getElementById('goodCallYes')?.checked ? 'Yes' : (document.getElementById('goodCallNo')?.checked ? 'No' : '');
    currentCall.issueResolved = document.getElementById('issueResolvedYes')?.checked ? 'Yes' : (document.getElementById('issueResolvedNo')?.checked ? 'No' : '');
    currentCall.surveyPitch = document.getElementById('surveyPitchYes')?.checked ? 'Yes' : (document.getElementById('surveyPitchNo')?.checked ? 'No' : '');
    currentCall.promoterCall = document.getElementById('promoterCallYes')?.checked ? 'Yes' : (document.getElementById('promoterCallNo')?.checked ? 'No' : '');
    
    callEndTime = new Date();
    if (callStartTime) {
        currentCall.endTime = callEndTime.toISOString();
        currentCall.duration = Math.floor((callEndTime - new Date(currentCall.startTime)) / 1000);
    }

    // Add to history and save to user-specific localStorage
    callHistory.push({...currentCall});
    localStorage.setItem(`callHistory_${normalizeName(currentUser)}`, JSON.stringify(callHistory));
    
    currentCall = null; // Clear active call

    // Show start call button and hide end call button
    const startCallBtn = document.getElementById('startCallBtn');
    const endCallBtn = document.getElementById('endCallBtn');
    if (startCallBtn) startCallBtn.style.display = 'inline-block';
    if (endCallBtn) endCallBtn.style.display = 'none';
    
    // Clear all inputs and reset states
    if (dxstInput) dxstInput.value = '';
    document.querySelectorAll('.call-step, .preferred-contact-method').forEach(cb => cb.checked = false);
    updateCheckedStepsSummary();
    updateCPCAndPreferredContactSummary();
    if (document.getElementById('cpcDropdown')) document.getElementById('cpcDropdown').value = '';
    if (document.getElementById('Fiber')) document.getElementById('Fiber').value = '';
    if (document.getElementById('Mobile')) document.getElementById('Mobile').value = '';
    if (document.getElementById('Video')) document.getElementById('Video').value = '';
    
    // Reset sales data for next call
    sales.forEach(s => s.count = 0);
    updateSalesList();
    updateTotalSales();
    localStorage.setItem(`sales_${normalizeName(currentUser)}`, JSON.stringify(sales)); // Save reset sales

    // Clear Call Status checkboxes
    [
      'goodCallYes','goodCallNo','issueResolvedYes','issueResolvedNo','surveyPitchYes','surveyPitchNo','promoterCallYes','promoterCallNo'
    ].forEach(id => { const el = document.getElementById(id); if (el) el.checked = false; });

    updateCallSummary(); // Update employee's own call summary table
    sendToManagerDashboard(); // Send updated data to manager
    
    showCustomMessageBox('Call ended and saved to history!');
    callStartTime = null;
    callEndTime = null;
}

function updateCallSummary() {
    const tbody = document.getElementById('callSummaryTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Add current call if active
    if (currentCall) {
        const tr = document.createElement('tr');
        tr.style.backgroundColor = 'rgba(255, 160, 122, 0.2)';
        const dxstDisplay = currentCall.dxstNumber || 'Pending DXST';
        const startTime = currentCall.startTime ? new Date(currentCall.startTime).toLocaleTimeString() : '';
        const endTime = currentCall.endTime ? new Date(currentCall.endTime).toLocaleTimeString() : '';
        const duration = currentCall.duration ? formatDuration(currentCall.duration) : '';
        tr.innerHTML = `
            <td>Active</td>
            <td>${currentCall.sequenceId}</td>
            <td>${dxstDisplay}</td>
            <td>${currentCall.sales.Fiber}/${currentCall.sales.Mobile}/${currentCall.sales.Video}</td>
            <td>${currentCall.cpc || 'Pending'}</td>
            <td>${currentCall.callSteps.length ? currentCall.callSteps.join(', ') : 'N/A'}</td>
            <td>${currentCall.goodCall}</td>
            <td>${currentCall.issueResolved}</td>
            <td>${currentCall.surveyPitch}</td>
            <td>${currentCall.promoterCall}</td>
            <td>${startTime}</td>
            <td>${endTime}</td>
            <td>${duration}</td>
        `;
        tbody.appendChild(tr);
    }
    
    // Add completed calls
    callHistory.slice().reverse().forEach((call, idx) => { // Display newest first
        const tr = document.createElement('tr');
        const startTime = call.startTime ? new Date(call.startTime).toLocaleTimeString() : '';
        const endTime = call.endTime ? new Date(call.endTime).toLocaleTimeString() : '';
        const duration = call.duration ? formatDuration(call.duration) : '';
        tr.innerHTML = `
            <td>${callHistory.length - idx}</td>
            <td>${call.sequenceId}</td>
            <td>${call.dxstNumber || 'N/A'}</td>
            <td>${call.sales.Fiber}/${call.sales.Mobile}/${call.sales.Video}</td>
            <td>${call.cpc || 'N/A'}</td>
            <td>${call.callSteps.join(', ')}</td>
            <td>${call.goodCall}</td>
            <td>${call.issueResolved}</td>
            <td>${call.surveyPitch}</td>
            <td>${call.promoterCall}</td>
            <td>${startTime}</td>
            <td>${endTime}</td>
            <td>${duration}</td>
        `;
        tbody.appendChild(tr);
    });
    
    // If no calls exist, add a message
    if (!currentCall && callHistory.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="13" style="text-align: center; color: #FFA07A; font-style: italic;">
                No calls recorded yet. Start a call to see details here.
            </td>
        `;
        tbody.appendChild(tr);
    }

    // Update summary with latest call details
    const summaryCallDetailsEl = document.getElementById('summaryCallDetails');
    if (summaryCallDetailsEl) {
        if (currentCall) {
            const dxstDisplay = currentCall.dxstNumber || 'Pending DXST';
            summaryCallDetailsEl.textContent = `${currentCall.sequenceId} / ${dxstDisplay}`;
        } else if (callHistory.length > 0) {
            const latestCall = callHistory[callHistory.length - 1]; // Get the actual latest call
            summaryCallDetailsEl.textContent = `${latestCall.sequenceId} / ${latestCall.dxstNumber || 'N/A'}`;
        } else {
            summaryCallDetailsEl.textContent = 'No active call';
        }
    }
    
    sendToManagerDashboard(); // Send updated data to manager
}

// Update call summary when sales, CPC, or call steps change
function updateCurrentCallData() {
    if (currentCall) {
        // Update currentCall object with latest data from inputs
        currentCall.sales = {
            Fiber: sales.find(s => s.type === 'Fiber').count,
            Mobile: sales.find(s => s.type === 'Mobile').count,
            Video: sales.find(s => s.type === 'Video').count
        };
        currentCall.cpc = document.getElementById('cpcDropdown')?.value || '';
        currentCall.callSteps = Array.from(document.querySelectorAll('.call-step:checked')).map(cb => cb.value);
        currentCall.preferredContact = Array.from(document.querySelectorAll('.preferred-contact-method:checked')).map(cb => cb.value);
        currentCall.dxstNumber = document.getElementById('dxstNumber')?.value.trim() || ''; // Update DXST in real-time
        
        updateCallSummary(); // Refresh the display
    }
}

// Test function to add a sample call for debugging
function addTestCall() {
    const testCall = {
        id: Date.now(),
        sequenceId: 'TEST' + Math.floor(Math.random() * 1000),
        dxstNumber: 'DXST' + Math.floor(Math.random() * 100),
        sales: { Fiber: Math.floor(Math.random() * 3), Mobile: Math.floor(Math.random() * 3), Video: Math.floor(Math.random() * 3) },
        cpc: ['Yes', 'No', 'NA'][Math.floor(Math.random() * 3)],
        callSteps: ['Greeting', 'Authentication', 'Problem Resolution', 'Closing'].filter(() => Math.random() > 0.5),
        preferredContact: ['Preferred Number', 'Preferred Text', 'Preferred Email'].filter(() => Math.random() > 0.5),
        goodCall: Math.random() > 0.5 ? 'Yes' : 'No',
        issueResolved: Math.random() > 0.5 ? 'Yes' : 'No',
        surveyPitch: Math.random() > 0.5 ? 'Yes' : 'No',
        promoterCall: Math.random() > 0.5 ? 'Yes' : 'No',
        startTime: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Random start time within last hour
        endTime: new Date().toISOString(),
        duration: Math.floor(Math.random() * 600) // Random duration up to 10 minutes
    };
    
    callHistory.push(testCall);
    localStorage.setItem(`callHistory_${normalizeName(currentUser)}`, JSON.stringify(callHistory));
    updateCallSummary();
    sendToManagerDashboard(); // Send updated data to manager
    showCustomMessageBox('Test call added to verify call summary table functionality');
}

// Send call summary to manager dashboard
function sendToManagerDashboard() {
    if (!currentUser || currentRole === 'manager' || currentRole === 'spm' || currentRole === 'apjm') {
        // Only employees send data to manager dashboard
        return;
    }

    const loginHoursElement = document.getElementById('loginHours');
    const loginDurationSeconds = loginHoursElement ? timeToSeconds(loginHoursElement.textContent) : 0;

    const managerData = {
        employeeName: currentUser,
        timestamp: new Date().toISOString(),
        currentCall: currentCall,
        callHistory: callHistory,
        totalCalls: callHistory.length + (currentCall ? 1 : 0),
        todayCalls: getTodayCalls(),
        salesSummary: getSalesSummary(),
        cpcSummary: getCPCSummary(),
        loginDuration: loginDurationSeconds, // in seconds
        breakDurations: breakDurations, // current break durations
        status: getEmployeeStatus(currentUser) // current live status
    };
    
    // Save to localStorage for manager access (normalized key)
    localStorage.setItem(`managerData_${normalizeName(currentUser)}`, JSON.stringify(managerData));
    
    // Also update the global 'allManagerData' object
    const allManagerData = JSON.parse(localStorage.getItem('allManagerData') || '{}');
    allManagerData[normalizeName(currentUser)] = managerData;
    localStorage.setItem('allManagerData', JSON.stringify(allManagerData));
}

// Helper to convert HH:MM:SS to seconds
function timeToSeconds(timeStr) {
    const parts = timeStr.split(':');
    if (parts.length === 3) {
        return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    } else if (parts.length === 2) { // For MM:SS format
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
}

// Get today's calls count
function getTodayCalls() {
    const today = new Date().toDateString();
    return callHistory.filter(call => {
        const callDate = new Date(call.startTime || call.id).toDateString(); // Use startTime if available
        return callDate === today;
    }).length;
}

// Get sales summary
function getSalesSummary() {
    const summary = { Fiber: 0, Mobile: 0, Video: 0, Total: 0 };
    
    callHistory.forEach(call => {
        summary.Fiber += call.sales.Fiber || 0;
        summary.Mobile += call.sales.Mobile || 0;
        summary.Video += call.sales.Video || 0;
    });
    
    if (currentCall) {
        summary.Fiber += currentCall.sales.Fiber || 0;
        summary.Mobile += currentCall.sales.Mobile || 0;
        summary.Video += currentCall.sales.Video || 0;
    }
    
    summary.Total = summary.Fiber + summary.Mobile + summary.Video;
    return summary;
}

// Get CPC summary
function getCPCSummary() {
    const summary = { Yes: 0, No: 0, NA: 0, Pending: 0 };
    
    callHistory.forEach(call => {
        if (call.cpc) {
            summary[call.cpc] = (summary[call.cpc] || 0) + 1;
        } else {
            summary.NA += 1;
        }
    });
    
    if (currentCall && currentCall.cpc) {
        summary[currentCall.cpc] = (summary[currentCall.cpc] || 0) + 1;
    } else if (currentCall) {
        summary.Pending += 1;
    }
    
    return summary;
}

// Update manager dashboard with real-time data
function updateManagerDashboard() {
    if (currentRole !== 'manager') {
        return;
    }
    
    const managerDashboardGrid = document.getElementById('managerDashboardGrid');
    if (!managerDashboardGrid || managerDashboardGrid.style.display === 'none') {
        return; // Only update if manager dashboard is visible
    }

    const allManagerData = JSON.parse(localStorage.getItem('allManagerData') || '{}');
    let employeeList = [];
    try {
        employeeList = apmEmployeeMap[currentUser] ? apmEmployeeMap[currentUser].map(normalizeName) : [];
    } catch (e) {
        console.error("Error getting manager's employee list:", e);
    }
    
    // Update Live Employees Panel
    updateEmployeeStatusPanel(employeeList); // Pass the specific employee list

    // Update Marquee and Daily Update inputs with global values
    const managerMarqueeInput = document.getElementById('managerMarqueeInput');
    const managerDailyUpdateInput = document.getElementById('managerDailyUpdateInput');
    
    const globalMarquee = JSON.parse(localStorage.getItem('globalMarquee') || '{}');
    if (managerMarqueeInput) {
        managerMarqueeInput.value = globalMarquee.content || '';
    }
    const managerMarqueeContent = document.getElementById('managerMarqueeContent');
    if (managerMarqueeContent) {
        managerMarqueeContent.textContent = globalMarquee.content || '';
    }
    
    const globalDailyUpdate = JSON.parse(localStorage.getItem('globalDailyUpdate') || '{}');
    if (managerDailyUpdateInput) {
        managerDailyUpdateInput.value = globalDailyUpdate.content || '';
    }
    const managerDailyUpdateContent = document.getElementById('managerDailyUpdateContent');
    if (managerDailyUpdateContent) {
        managerDailyUpdateContent.textContent = globalDailyUpdate.content || '';
    }

    // Update Progress Report Section
    updateProgressReport(employeeList, allManagerData);

    // Update Comprehensive Call Summary Table
    const comprehensiveCallTableDiv = document.getElementById('managerCallSummaryTableContent');
    if (comprehensiveCallTableDiv) {
        comprehensiveCallTableDiv.innerHTML = generateComprehensiveCallTable(employeeList, allManagerData);
    }
}

// Set up automatic updates for manager dashboard
function startManagerDashboardRealtimeUpdates() {
    if (currentRole === 'manager') {
        // Initial update
        updateManagerDashboard();
        
        // Clear any existing interval to prevent duplicates
        if (window.managerDashboardInterval) {
            clearInterval(window.managerDashboardInterval);
        }
        // Update every 5 seconds
        window.managerDashboardInterval = setInterval(() => {
            updateManagerDashboard();
        }, 5000); // Update every 5 seconds for real-time feel
        
        // Also update when localStorage changes (for real-time updates across tabs)
        window.removeEventListener('storage', handleStorageChangeForManager); // Prevent duplicates
        window.addEventListener('storage', handleStorageChangeForManager);
    }
}

function handleStorageChangeForManager(e) {
    // Only react to changes in employee data or global announcements
    if (e.key && (e.key.startsWith('managerData_') || e.key.startsWith('employeeStatus_') || e.key === 'globalMarquee' || e.key === 'globalDailyUpdate')) {
        updateManagerDashboard();
    }
}

// Generate comprehensive call summary table for all employees
function generateComprehensiveCallTable(employeeList, allManagerData) {
    if (!employeeList || employeeList.length === 0) {
        return '<p style="color: #FFA07A; text-align: center;">No employees assigned to this manager.</p>';
    }
    
    let allCalls = [];
    employeeList.forEach(employeeNameNormalized => {
        const data = allManagerData[employeeNameNormalized];
        if (data && data.callHistory && data.callHistory.length > 0) {
            data.callHistory.forEach(call => {
                allCalls.push({
                    employeeName: data.employeeName,
                    ...call
                });
            });
        }
        // Include active call if present
        if (data && data.currentCall && data.currentCall.sequenceId) {
             allCalls.push({
                employeeName: data.employeeName,
                ...data.currentCall,
                status: 'Active' // Mark as active for display
            });
        }
    });

    // Sort calls by start time (newest first)
    allCalls.sort((a, b) => new Date(b.startTime || b.timestamp) - new Date(a.startTime || a.timestamp));

    if (allCalls.length === 0) {
        return '<p style="color: #FFA07A; text-align: center;">No calls recorded by your employees yet.</p>';
    }

    let tableHTML = `
        <div style="overflow-x: auto; max-height: 400px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <thead>
                    <tr style="background: rgba(255, 160, 122, 0.3); position: sticky; top: 0; z-index: 10;">
                        <th style="border: 1px solid #FFA07A; padding: 6px; text-align: center; min-width: 40px;">#</th>
                        <th style="border: 1px solid #FFA07A; padding: 6px; text-align: center; min-width: 100px;">Employee</th>
                        <th style="border: 1px solid #FFA07A; padding: 6px; text-align: center; min-width: 80px;">Seq ID</th>
                        <th style="border: 1px solid #FFA07A; padding: 6px; text-align: center; min-width: 80px;">DXST</th>
                        <th style="border: 1px solid #FFA07A; padding: 6px; text-align: center; min-width: 80px;">Sales (F/M/V)</th>
                        <th style="border: 1px solid #FFA07A; padding: 6px; text-align: center; min-width: 50px;">CPC</th>
                        <th style="border: 1px solid #FFA07A; padding: 6px; text-align: center; min-width: 150px;">Call Steps</th>
                        <th style="border: 1px solid #FFA07A; padding: 6px; text-align: center; min-width: 60px;">Good</th>
                        <th style="border: 1px solid #FFA07A; padding: 6px; text-align: center; min-width: 60px;">Resolved</th>
                        <th style="border: 1px solid #FFA07A; padding: 6px; text-align: center; min-width: 60px;">Survey</th>
                        <th style="border: 1px solid #FFA07A; padding: 6px; text-align: center; min-width: 60px;">Promoter</th>
                        <th style="border: 1px solid #FFA07A; padding: 6px; text-align: center; min-width: 80px;">Duration</th>
                        <th style="border: 1px solid #FFA07A; padding: 6px; text-align: center; min-width: 100px;">Time</th>
                    </tr>
                </thead>
                <tbody>
    `;
    allCalls.forEach((call, index) => {
        const rowColor = call.status === 'Active' ? 'rgba(255, 160, 122, 0.2)' : (index % 2 === 0 ? 'rgba(3, 5, 91, 0.5)' : 'rgba(3, 5, 91, 0.3)');
        const callTime = call.startTime ? new Date(call.startTime).toLocaleTimeString() : '';
        const duration = call.duration ? formatDuration(call.duration) : 'N/A';
        tableHTML += `
            <tr style="background: ${rowColor};">
                <td style="border: 1px solid #FFA07A; padding: 6px; text-align: center;">${call.status === 'Active' ? 'Live' : (allCalls.length - index)}</td>
                <td style="border: 1px solid #FFA07A; padding: 6px; text-align: center; font-weight: bold; color: ${call.status === 'Active' ? '#FFD700' : '#fff'};">${call.employeeName}</td>
                <td style="border: 1px solid #FFA07A; padding: 6px; text-align: center;">${call.sequenceId}</td>
                <td style="border: 1px solid #FFA07A; padding: 6px; text-align: center;">${call.dxstNumber || 'N/A'}</td>
                <td style="border: 1px solid #FFA07A; padding: 6px; text-align: center;">
                    <span style="color: #FF6B6B;">${call.sales.Fiber || 0}</span>/
                    <span style="color: #4ECDC4;">${call.sales.Mobile || 0}</span>/
                    <span style="color: #45B7D1;">${call.sales.Video || 0}</span>
                </td>
                <td style="border: 1px solid #FFA07A; padding: 6px; text-align: center;">${call.cpc || 'N/A'}</td>
                <td style="border: 1px solid #FFA07A; padding: 6px; text-align: center; font-size: 10px; max-width: 150px; word-wrap: break-word;">
                    ${call.callSteps ? call.callSteps.join(', ') : ''}
                </td>
                <td style="border: 1px solid #FFA07A; padding: 6px; text-align: center;">${call.goodCall || ''}</td>
                <td style="border: 1px solid #FFA07A; padding: 6px; text-align: center;">${call.issueResolved || ''}</td>
                <td style="border: 1px solid #FFA07A; padding: 6px; text-align: center;">${call.surveyPitch || ''}</td>
                <td style="border: 1px solid #FFA07A; padding: 6px; text-align: center;">${call.promoterCall || ''}</td>
                <td style="border: 1px solid #FFA07A; padding: 6px; text-align: center;">${duration}</td>
                <td style="border: 1px solid #FFA07A; padding: 6px; text-align: center; font-size: 11px;">${callTime}</td>
            </tr>
        `;
    });
    tableHTML += `
                </tbody>
            </table>
        </div>
        <div style="margin-top: 10px; text-align: center; color: #FFA07A; font-size: 12px;">
            Total Calls: ${allCalls.length} | Showing all calls from your employees only
        </div>
    `;
    return tableHTML;
}

// Helper function to format duration (seconds to mm:ss)
function formatDuration(seconds) {
    if (isNaN(seconds) || seconds === null) return 'N/A';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Save daily update from manager (accessible to all employees)
function publishDailyUpdate() {
    const preShiftContent = document.getElementById('managerDailyUpdateInput')?.value.trim();
    
    if (!preShiftContent) {
        showCustomMessageBox('Please enter content for the daily update.');
        return;
    }
    
    const dailyUpdate = {
        content: preShiftContent,
        updatedBy: currentUser,
        timestamp: new Date().toISOString(),
        date: new Date().toDateString()
    };
    
    localStorage.setItem('globalDailyUpdate', JSON.stringify(dailyUpdate));
    
    showCustomMessageBox('Daily update published successfully! All employees will see this update.');
    
    // Refresh the manager dashboard to show updated info
    updateManagerDashboard();
    // Also update employee's own display if they are logged in on the same browser
    loadDailyUpdate();
}

// Load daily update for all users
function loadDailyUpdate() {
    const savedUpdate = localStorage.getItem('globalDailyUpdate');
    
    const preShiftTextarea = document.getElementById('preShift');
    const dailyUpdateContentDiv = document.getElementById('managerDailyUpdateContent'); // For manager's display

    if (!preShiftTextarea && !dailyUpdateContentDiv) {
        return;
    }
    
    if (savedUpdate) {
        const update = JSON.parse(savedUpdate);
        const today = new Date().toDateString();
        
        if (update.date === today) {
            if (preShiftTextarea) {
                preShiftTextarea.value = update.content;
                preShiftTextarea.readOnly = true;
            }
            if (dailyUpdateContentDiv) {
                dailyUpdateContentDiv.textContent = update.content;
            }
        } else {
            // Clear old updates if not today's
            if (preShiftTextarea) {
                preShiftTextarea.value = '';
                preShiftTextarea.readOnly = true;
            }
            if (dailyUpdateContentDiv) {
                dailyUpdateContentDiv.textContent = '';
            }
        }
    } else {
        if (preShiftTextarea) {
            preShiftTextarea.value = '';
            preShiftTextarea.readOnly = true;
        }
        if (dailyUpdateContentDiv) {
            dailyUpdateContentDiv.textContent = '';
        }
    }
}

// Calculate total sales across all employees for progress report
function getTotalSalesProgress(employeeList, allManagerData) {
    let totalFiber = 0;
    let totalMobile = 0;
    let totalVideo = 0;
    let totalSalesOverall = 0;
    
    employeeList.forEach(employeeNameNormalized => {
        const data = allManagerData[employeeNameNormalized];
        if (data && data.salesSummary) {
            totalFiber += data.salesSummary.Fiber || 0;
            totalMobile += data.salesSummary.Mobile || 0;
            totalVideo += data.salesSummary.Video || 0;
            totalSalesOverall += data.salesSummary.Total || 0;
        }
    });
    
    return {
        Fiber: totalFiber,
        Mobile: totalMobile,
        Video: totalVideo,
        Total: totalSalesOverall
    };
}

// Calculate call coding metrics (DXST / Sequence ID ratio)
function getCallCodingMetrics(employeeList, allManagerData) {
    let totalDXST = 0;
    let totalSequenceID = 0;
    
    employeeList.forEach(employeeNameNormalized => {
        const data = allManagerData[employeeNameNormalized];
        if (data && data.callHistory) {
            data.callHistory.forEach(call => {
                if (call.dxstNumber && call.dxstNumber !== 'N/A' && call.dxstNumber.trim() !== '') {
                    totalDXST++;
                }
                if (call.sequenceId && call.sequenceId.trim() !== '') {
                    totalSequenceID++;
                }
            });
        }
        // Also check current call if active
        if (data && data.currentCall) {
            if (data.currentCall.dxstNumber && data.currentCall.dxstNumber !== 'N/A' && data.currentCall.dxstNumber.trim() !== '') {
                totalDXST++;
            }
            if (data.currentCall.sequenceId && data.currentCall.sequenceId.trim() !== '') {
                totalSequenceID++;
            }
        }
    });
    
    const callCodingRatio = totalSequenceID > 0 ? ((totalDXST / totalSequenceID) * 100).toFixed(1) : 0;
    
    return {
        totalDXST,
        totalSequenceID,
        callCodingRatio: parseFloat(callCodingRatio)
    };
}

// Draw sales donut chart
function drawSalesDonutChart(salesData) {
    const canvas = document.getElementById('salesDonutChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 60;
    const innerRadius = 40;
    
    // Colors for each sales type
    const colors = {
        Fiber: '#FF6B6B',
        Mobile: '#4ECDC4', 
        Video: '#45B7D1'
    };
    
    let currentAngle = -Math.PI / 2; // Start from top
    
    // Draw each segment
    Object.entries(salesData).forEach(([type, value]) => {
        if (type === 'Total' || value === 0 || salesData.Total === 0) return;
        
        const segmentAngle = (value / salesData.Total) * 2 * Math.PI;
        
        // Draw outer arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + segmentAngle);
        ctx.lineTo(centerX + (innerRadius * Math.cos(currentAngle + segmentAngle)), 
                   centerY + (innerRadius * Math.sin(currentAngle + segmentAngle)));
        
        // Draw inner arc
        ctx.arc(centerX, centerY, innerRadius, currentAngle + segmentAngle, currentAngle, true);
        ctx.closePath();
        
        // Fill segment
        ctx.fillStyle = colors[type];
        ctx.fill();
        
        currentAngle += segmentAngle;
    });
    
    // Draw center circle (donut hole)
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(3, 5, 91, 0.9)'; // Match background
    ctx.fill();
}

// Update progress report (called after manager dashboard update)
function updateProgressReport(employeeList, allManagerData) {
    const salesData = getTotalSalesProgress(employeeList, allManagerData);
    drawSalesDonutChart(salesData);

    const totalSalesEl = document.getElementById('progressTotalSales');
    if (totalSalesEl) {
        totalSalesEl.innerHTML = `Total Sales: <span style='color:#FFD700;font-size:1.2em;'>${salesData.Total}</span>`;
    }

    const callMetrics = getCallCodingMetrics(employeeList, allManagerData);
    const totalCallsEl = document.getElementById('totalCalls');
    if (totalCallsEl) totalCallsEl.textContent = callMetrics.totalSequenceID; // Total Sequence IDs
    const totalDXSTEl = document.getElementById('totalDXST');
    if (totalDXSTEl) totalDXSTEl.textContent = callMetrics.totalDXST; // Total DXSTs
    
    const callCodingRatioEl = document.getElementById('callCodingRatio'); // Assuming you add this span in HTML
    if (callCodingRatioEl) callCodingRatioEl.textContent = callMetrics.callCodingRatio;
}


// Save marquee announcement from manager (accessible to all users)
function publishMarquee() {
    const marqueeContent = document.getElementById('managerMarqueeInput')?.value.trim();
    if (!marqueeContent) {
        showCustomMessageBox('Please enter content for the marquee announcement.');
        return;
    }
    
    const marqueeUpdate = {
        content: marqueeContent,
        updatedBy: currentUser,
        timestamp: new Date().toISOString(),
        date: new Date().toDateString()
    };
    
    localStorage.setItem('globalMarquee', JSON.stringify(marqueeUpdate));
    
    showCustomMessageBox('Marquee announcement published successfully! All users will see this update.');
    
    // Refresh the manager dashboard to show updated info
    updateManagerDashboard();
    // Immediately update marquee for this user
    loadMarqueeAnnouncement();
}

// Load marquee announcement for all users
function loadMarqueeAnnouncement() {
    const scrollingText = document.querySelector('.announcement-marquee .scrolling-text');
    const managerMarqueeContent = document.getElementById('managerMarqueeContent'); // For manager's display
    const managerMarqueeInput = document.getElementById('managerMarqueeInput'); // For manager's input

    let announcement = null;

    // Prioritize SPM/APJM global announcements, then manager global announcements
    const spmMarquee = localStorage.getItem('spmMarqueeAnnouncement');
    const apjmMarquee = localStorage.getItem('apjmMarqueeAnnouncement'); // If APJM has its own marquee
    const managerMarquee = localStorage.getItem('globalMarquee');

    const today = new Date().toDateString();

    if (spmMarquee) {
        const parsed = JSON.parse(spmMarquee);
        if (parsed.date === today) {
            announcement = parsed.content;
        }
    }
    // If SPM didn't have it, check APJM
    if (!announcement && apjmMarquee) {
        const parsed = JSON.parse(apjmMarquee);
        if (parsed.date === today) {
            announcement = parsed.content;
        }
    }
    // If neither SPM nor APJM had it, check manager
    if (!announcement && managerMarquee) {
        const parsed = JSON.parse(managerMarquee);
        if (parsed.date === today) {
            announcement = parsed.content;
        }
    }

    if (scrollingText) {
        scrollingText.textContent = announcement || 'Welcome to Employee Tracking System! Stay updated with the latest announcements and updates.';
    }
    if (managerMarqueeContent) {
        managerMarqueeContent.textContent = announcement || '';
    }
    if (managerMarqueeInput) {
        managerMarqueeInput.value = announcement || '';
    }
}

// SPM Dashboard Functions
function updateSPMDashboard() {
    if (currentRole !== 'spm' && currentRole !== 'apjm') return;

    const spmDashboardEl = document.getElementById('spmDashboard');
    if (!spmDashboardEl || spmDashboardEl.style.display === 'none') return;

    const spmManagerData = document.getElementById('spmManagerData');
    const allManagerData = JSON.parse(localStorage.getItem('allManagerData') || '{}');
    let html = '<div class="manager-performance-grid">';
    
    // Get all managers from the apmEmployeeMap (all managers are overseen by SPM/APJM)
    const allManagers = Object.keys(apmEmployeeMap).filter(role => role !== 'SPM' && role !== 'APJM' && !apmEmployeeMap['SPM'].includes(role) && !apmEmployeeMap['APJM'].includes(role)); // Exclude SPM/APJM themselves and their direct reports if they are also managers

    allManagers.forEach(manager => {
        const managerData = allManagerData[normalizeName(manager)] || {};
        const employeeCount = apmEmployeeMap[manager] ? apmEmployeeMap[manager].length : 0;
        
        let activeEmployeesCount = 0;
        if (apmEmployeeMap[manager]) {
            apmEmployeeMap[manager].forEach(empName => {
                const status = getEmployeeStatus(empName);
                if (status && status.loggedIn) {
                    activeEmployeesCount++;
                }
            });
        }
        
        const totalSales = managerData.salesSummary ? 
            (managerData.salesSummary.Fiber + managerData.salesSummary.Mobile + managerData.salesSummary.Video) : 0;
        const totalCalls = managerData.totalCalls || 0;
        
        html += `
            <div class="manager-card">
                <h4>${manager}</h4>
                <div class="manager-stats">
                    <div class="stat">
                        <span class="stat-label">Team Size:</span>
                        <span class="stat-value">${employeeCount}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Active:</span>
                        <span class="stat-value">${activeEmployeesCount}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Total Sales:</span>
                        <span class="stat-value">${totalSales}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Total Calls:</span>
                        <span class="stat-value">${totalCalls}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    if (spmManagerData) spmManagerData.innerHTML = html;
    
    // Update SPM progress report
    updateSPMProgressReport(allManagers, allManagerData);

    // Update SPM daily update and marquee input fields
    const spmDailyUpdateInput = document.getElementById('spmDailyUpdate');
    const spmMarqueeInput = document.getElementById('spmMarquee');

    const spmGlobalDailyUpdate = JSON.parse(localStorage.getItem('spmDailyUpdate') || '{}');
    if (spmDailyUpdateInput) spmDailyUpdateInput.value = spmGlobalDailyUpdate.content || '';

    const spmGlobalMarquee = JSON.parse(localStorage.getItem('spmMarqueeAnnouncement') || '{}');
    if (spmMarqueeInput) spmMarqueeInput.value = spmGlobalMarquee.content || '';
}

function updateSPMProgressReport(allManagers, allManagerData) {
    const spmSalesData = getSPMTotalSalesProgress(allManagers, allManagerData);
    drawSPMSalesDonutChart(spmSalesData);
    
    const spmMetrics = getSPMCallCodingMetrics(allManagers, allManagerData);
    const spmCallCodingMetrics = document.getElementById('spmCallCodingMetrics');
    if (spmCallCodingMetrics) {
        spmCallCodingMetrics.innerHTML = `
            <div class="metric">
                <span class="metric-label">Total DXST:</span>
                <span class="metric-value">${spmMetrics.totalDXST}</span>
            </div>
            <div class="metric">
                <span class="metric-label">Total Sequence ID:</span>
                <span class="metric-value">${spmMetrics.totalSequenceID}</span>
            </div>
            <div class="metric">
                <span class="metric-label">Call Coding Ratio:</span>
                <span class="metric-value">${spmMetrics.callCodingRatio}%</span>
            </div>
        `;
    }
}

function getSPMCallCodingMetrics(allManagers, allManagerData) {
    let totalDXST = 0;
    let totalSequenceID = 0;
    
    allManagers.forEach(manager => {
        const managerData = allManagerData[normalizeName(manager)];
        if (managerData && managerData.callHistory) {
            managerData.callHistory.forEach(call => {
                if (call.dxstNumber && call.dxstNumber !== 'N/A' && call.dxstNumber.trim() !== '') {
                    totalDXST++;
                }
                if (call.sequenceId && call.sequenceId.trim() !== '') {
                    totalSequenceID++;
                }
            });
        }
        if (managerData && managerData.currentCall) {
            if (managerData.currentCall.dxstNumber && managerData.currentCall.dxstNumber !== 'N/A' && managerData.currentCall.dxstNumber.trim() !== '') {
                totalDXST++;
            }
            if (managerData.currentCall.sequenceId && managerData.currentCall.sequenceId.trim() !== '') {
                totalSequenceID++;
            }
        }
    });
    const callCodingRatio = totalSequenceID > 0 ? ((totalDXST / totalSequenceID) * 100).toFixed(1) : 0;
    return {
        totalDXST,
        totalSequenceID,
        callCodingRatio: parseFloat(callCodingRatio)
    };
}

function getSPMTotalSalesProgress(allManagers, allManagerData) {
    let totalFiber = 0;
    let totalMobile = 0;
    let totalVideo = 0;
    let totalOverall = 0;
    
    allManagers.forEach(manager => {
        const managerData = allManagerData[normalizeName(manager)];
        if (managerData && managerData.salesSummary) {
            totalFiber += managerData.salesSummary.Fiber || 0;
            totalMobile += managerData.salesSummary.Mobile || 0;
            totalVideo += managerData.salesSummary.Video || 0;
            totalOverall += managerData.salesSummary.Total || 0;
        }
    });
    
    return {
        Fiber: totalFiber,
        Mobile: totalMobile,
        Video: totalVideo,
        Total: totalOverall
    };
}

function drawSPMSalesDonutChart(salesData) {
    const canvas = document.getElementById('spmSalesDonutChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 60;
    const innerRadius = 40;
    
    const colors = {
        Fiber: '#FF6B6B',
        Mobile: '#4ECDC4', 
        Video: '#45B7D1'
    };
    
    let currentAngle = -Math.PI / 2;
    
    Object.entries(salesData).forEach(([type, value]) => {
        if (type === 'Total' || value === 0 || salesData.Total === 0) return;
        
        const segmentAngle = (value / salesData.Total) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + segmentAngle);
        ctx.lineTo(centerX + (innerRadius * Math.cos(currentAngle + segmentAngle)), 
                   centerY + (innerRadius * Math.sin(currentAngle + segmentAngle)));
        ctx.arc(centerX, centerY, innerRadius, currentAngle + segmentAngle, currentAngle, true);
        ctx.closePath();
        
        ctx.fillStyle = colors[type];
        ctx.fill();
        
        currentAngle += segmentAngle;
    });
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(3, 5, 91, 0.9)';
    ctx.fill();
}

function setupSPMDashboardUpdates() {
    if (currentRole === 'spm' || currentRole === 'apjm') {
        updateSPMDashboard(); // Initial call
        if (window.spmDashboardInterval) clearInterval(window.spmDashboardInterval);
        window.spmDashboardInterval = setInterval(() => {
            updateSPMDashboard();
        }, 10000); // Update every 10 seconds
        
        window.removeEventListener('storage', handleStorageChangeForSPM); // Prevent duplicates
        window.addEventListener('storage', handleStorageChangeForSPM);
    }
}

function handleStorageChangeForSPM(e) {
    if (e.key && (e.key.startsWith('managerData_') || e.key.startsWith('employeeStatus_') || e.key === 'globalMarquee' || e.key === 'globalDailyUpdate' || e.key === 'spmDailyUpdate' || e.key === 'spmMarqueeAnnouncement')) {
        updateSPMDashboard();
    }
}

function saveSPMDailyUpdate() {
    const dailyUpdateContent = document.getElementById('spmDailyUpdate')?.value.trim();
    if (!dailyUpdateContent) {
        showCustomMessageBox('Please enter content for the global daily update.');
        return;
    }
    
    const dailyUpdate = {
        content: dailyUpdateContent,
        updatedBy: currentUser,
        timestamp: new Date().toISOString(),
        date: new Date().toDateString()
    };
    
    localStorage.setItem('spmDailyUpdate', JSON.stringify(dailyUpdate));
    
    showCustomMessageBox('Global daily update saved successfully! All users will see this update.');
    updateSPMDashboard();
    loadDailyUpdate(); // Ensure employees see this update
}

function saveSPMMarqueeAnnouncement() {
    const marqueeContent = document.getElementById('spmMarquee')?.value.trim();
    if (!marqueeContent) {
        showCustomMessageBox('Please enter content for the global marquee announcement.');
        return;
    }
    
    const marqueeUpdate = {
        content: marqueeContent,
        updatedBy: currentUser,
        timestamp: new Date().toISOString(),
        date: new Date().toDateString()
    };
    
    localStorage.setItem('spmMarqueeAnnouncement', JSON.stringify(marqueeUpdate));
    
    showCustomMessageBox('Global marquee announcement saved successfully! All users will see this update.');
    updateSPMDashboard();
    loadMarqueeAnnouncement(); // Ensure all users see this update
}

// Senior Manager Dashboard Functions (assuming APJM is Senior Manager for now)
// These functions will largely mirror SPM functions but might aggregate data differently if needed.
// For now, they will use the same data aggregation as SPM.
function updateSeniorManagerDashboard() {
    // This function is not currently called in the login flow for 'APJM' role.
    // If 'APJM' is meant to have a distinct dashboard from 'SPM',
    // a separate 'apjmDashboard' div and corresponding logic would be needed.
    // For now, 'APJM' maps to 'spmDashboard'.
}

function updateSeniorManagerProgressReport() {
    // This function is not currently called.
}

function getSeniorManagerCallCodingMetrics() {
    // This function is not currently called.
    return { totalDXST: 0, totalSequenceID: 0, callCodingRatio: 0 };
}

function getSeniorManagerTotalSalesProgress() {
    // This function is not currently called.
    return { Fiber: 0, Mobile: 0, Video: 0, Total: 0 };
}

function drawSeniorManagerSalesDonutChart() {
    // This function is not currently called.
}

function setupSeniorManagerDashboardUpdates() {
    // This function is not currently called.
}

function saveSeniorManagerDailyUpdate() {
    // This function is not currently called.
}

function saveSeniorManagerMarqueeAnnouncement() {
    // This function is not currently called.
}

// --- Employee Status Tracking ---

// Helper: Set employee status in localStorage
function setEmployeeStatus(name, status) {
    localStorage.setItem(`employeeStatus_${normalizeName(name)}`, JSON.stringify(status));
}

// Helper: Get employee status from localStorage
function getEmployeeStatus(name) {
    const data = localStorage.getItem(`employeeStatus_${normalizeName(name)}`);
    return data ? JSON.parse(data) : null;
}

// Helper: Remove employee status from localStorage
function removeEmployeeStatus(name) {
    localStorage.removeItem(`employeeStatus_${normalizeName(name)}`);
}

// On employee login
function handleEmployeeLogin(username) {
    const now = new Date().toISOString();
    const status = {
        loggedIn: true,
        break: 'none',
        loginTime: now,
        lastActivity: now, // Track last activity for better 'online' status
        breakStart: null,
        loginDuration: 0 // In seconds
    };
    setEmployeeStatus(username, status);
}

// On employee logout
function handleEmployeeLogout(username) {
    const status = getEmployeeStatus(username) || {};
    status.loggedIn = false;
    status.break = 'none';
    status.logoutTime = new Date().toISOString();
    status.breakStart = null;
    setEmployeeStatus(username, status);
}

// On employee break change
function handleEmployeeBreak(username, breakType) {
    const status = getEmployeeStatus(username) || {};
    status.break = breakType;
    if (breakType === 'none') {
        status.breakStart = null;
    } else {
        status.breakStart = new Date().toISOString();
    }
    setEmployeeStatus(username, status);
}

// Enhanced updateEmployeeStatusPanel function for manager dashboard
function updateEmployeeStatusPanel(employeeList) {
    if (currentRole !== 'manager') return;
    
    const panel = document.getElementById('liveEmployeesList'); // This is the correct ID for the list
    if (!panel) return;
    
    const statuses = employeeList.map(name => {
        const status = getEmployeeStatus(name) || {};
        const managerData = JSON.parse(localStorage.getItem(`managerData_${name}`) || '{}');
        
        // Calculate live login duration
        let liveLoginDuration = 0;
        if (status.loggedIn && status.loginTime) {
            liveLoginDuration = Math.floor((Date.now() - new Date(status.loginTime).getTime()) / 1000);
        } else if (status.loginDuration) { // If not currently logged in but has a recorded duration
            liveLoginDuration = Math.floor(status.loginDuration / 1000); // Convert ms to seconds
        }

        // Get total calls from managerData
        const totalCalls = managerData.totalCalls || 0;

        return { 
            name: name, // Use normalized name as key, display original name if available
            displayName: managerData.employeeName || name, // Display original name for better readability
            loggedIn: status.loggedIn || false,
            break: status.break || 'none',
            breakStart: status.breakStart,
            loginTime: status.loginTime,
            lastActivity: status.lastActivity,
            logoutTime: status.logoutTime,
            liveLoginDuration: liveLoginDuration,
            totalCalls: totalCalls
        };
    });
    
    // Sort: online first, then on break, then alphabetically
    statuses.sort((a, b) => {
        if ((b.loggedIn ? 1 : 0) - (a.loggedIn ? 1 : 0) !== 0) return (b.loggedIn ? 1 : 0) - (a.loggedIn ? 1 : 0);
        if ((b.break && b.break !== 'none' ? 1 : 0) - (a.break && a.break !== 'none' ? 1 : 0) !== 0) return (b.break && a.break !== 'none' ? 1 : 0) - (a.break && b.break !== 'none' ? 1 : 0); // Corrected sorting for break
        return a.displayName.localeCompare(b.displayName);
    });
    
    let html = ``;
    
    if (statuses.length === 0) {
        html += '<div style="color: #FFA07A; text-align: center;">No employees found for your team.</div>';
    } else {
        statuses.forEach(status => {
            const isOnline = !!status.loggedIn;
            const onBreak = isOnline && status.break && status.break !== 'none';
            const breakIcon = getBreakIcon(status.break);
            const statusIcon = getStatusIcon(isOnline);
            
            // Break duration
            let breakDurationDisplay = '';
            if (onBreak && status.breakStart) {
                breakDurationDisplay = ` (${formatDuration(getDurationSeconds(status.breakStart))})`;
            }
            
            // Total logged-in time
            let loginDurationFormatted = formatDuration(status.liveLoginDuration);
            
            // Last login/logout
            let lastSeen = '';
            if (isOnline && status.loginTime) {
                lastSeen = `<span style="color:#4ECDC4; font-size:11px;">Login: ${new Date(status.loginTime).toLocaleTimeString()}</span>`;
            } else if (!isOnline && status.logoutTime) {
                lastSeen = `<span style="color:#FF6B6B; font-size:11px;">Logout: ${new Date(status.logoutTime).toLocaleTimeString()}</span>`;
            }
            
            // Color coding
            let bg = '';
            if (onBreak) bg = 'background:rgba(255,215,0,0.08);'; // Yellowish for break
            else if (isOnline) bg = 'background:rgba(78,205,196,0.08);'; // Greenish for online
            else bg = 'background:rgba(255,107,107,0.08);'; // Reddish for offline
            
            html += `<div style="margin-bottom:8px;display:flex;flex-direction:column;${bg}border-radius:6px;padding:6px 8px;">
                <div style="display:flex;align-items:center;justify-content:space-between;">
                    <span style="font-weight:bold;color:#FFD700;">${status.displayName}</span>
                    <span>${statusIcon}${onBreak ? ' ' + breakIcon : ''}</span>
                </div>
                <div style="font-size:12px;display:flex;align-items:center;justify-content:space-between;">
                    <span>${isOnline ? '<span style="color:#4ECDC4;">Online</span>' : '<span style="color:#FF6B6B;">Offline</span>'}${onBreak ? ` <span style="color:#FFD700;">On ${status.break.charAt(0).toUpperCase() + status.break.slice(1)} Break${breakDurationDisplay}</span>` : ''}</span>
                </div>
                <div style="font-size:12px;display:flex;align-items:center;justify-content:space-between;">
                    <span>Login Hrs: <span style="color:#FFD700; font-weight:bold;">${loginDurationFormatted}</span></span>
                    <span>Calls: <span style="color:#FFD700; font-weight:bold;">${status.totalCalls}</span></span>
                </div>
                <div>${lastSeen}</div>
            </div>`;
        });
    }
    
    panel.innerHTML = html;
}

// Utility to normalize names for consistent localStorage keys
function normalizeName(name) {
    return name.trim().toLowerCase().replace(/\s+/g, '-'); // Replace spaces with hyphens
}

// Helper for status icons
function getBreakIcon(breakType) {
    if (breakType === 'first') return '☕';
    if (breakType === 'second') return '🥪';
    if (breakType === 'bio') return '🚻';
    return '';
}

function getStatusIcon(loggedIn) {
    return loggedIn ? '🟢' : '🔴';
}

function getDurationSeconds(startIso) {
    if (!startIso) return 0;
    return Math.floor((Date.now() - new Date(startIso).getTime()) / 1000);
}


// --- Dashboard Visibility Logic ---
function showDashboardForRole(role) {
    const loginContainer = document.getElementById('loginContainer');
    const dashboardContainer = document.getElementById('dashboard');
    const employeeDashboardGrid = document.getElementById('employeeDashboardGrid');
    const managerDashboardGrid = document.getElementById('managerDashboardGrid');
    const spmDashboard = document.getElementById('spmDashboard');
    const callStatusSection = document.getElementById('callStatusSection');
    const summaryBox = document.getElementById('summaryBox');

    // Hide all by default
    if (loginContainer) loginContainer.style.display = 'none';
    if (dashboardContainer) dashboardContainer.style.display = 'none';
    if (employeeDashboardGrid) employeeDashboardGrid.style.display = 'none';
    if (managerDashboardGrid) managerDashboardGrid.style.display = 'none';
    if (spmDashboard) spmDashboard.style.display = 'none';
    if (callStatusSection) callStatusSection.style.display = 'none';
    if (summaryBox) summaryBox.style.display = 'none';

    if (role === 'employee') {
        if (dashboardContainer) dashboardContainer.style.display = 'block';
        if (employeeDashboardGrid) employeeDashboardGrid.style.display = 'grid';
        if (callStatusSection) callStatusSection.style.display = 'block';
        if (summaryBox) summaryBox.style.display = 'block';
    } else if (role === 'manager') {
        if (dashboardContainer) dashboardContainer.style.display = 'block';
        if (managerDashboardGrid) managerDashboardGrid.style.display = 'grid';
        // Manager specific elements are part of managerDashboardGrid, so no need to explicitly show/hide individual sections
    } else if (role === 'spm' || role === 'apjm') { // Treat APJM as SPM for dashboard display
        if (dashboardContainer) dashboardContainer.style.display = 'block';
        if (spmDashboard) spmDashboard.style.display = 'block';
    } else {
        // No role or unknown role, show login
        if (loginContainer) loginContainer.style.display = 'flex'; // Use flex for centering
    }
}

// Listen for storage events to update dashboards across tabs/windows
window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('managerData_') && currentRole === 'manager') {
        updateManagerDashboard();
    }
    if (e.key && e.key.startsWith('employeeStatus_') && currentRole === 'manager') {
        updateManagerDashboard(); // This will trigger updateEmployeeStatusPanel
    }
    if (e.key === 'globalMarquee' || e.key === 'globalDailyUpdate') {
        loadMarqueeAnnouncement();
        loadDailyUpdate();
        if (currentRole === 'manager') {
            updateManagerDashboard(); // Ensure manager's view of published content updates
        }
    }
    if ((e.key === 'spmMarqueeAnnouncement' || e.key === 'spmDailyUpdate') && (currentRole === 'spm' || currentRole === 'apjm')) {
        updateSPMDashboard();
        loadMarqueeAnnouncement(); // Ensure general marquee updates
    }
});

// Initial call to set dashboard visibility on page load
window.addEventListener('DOMContentLoaded', function() {
    let session = null;
    try {
        session = JSON.parse(localStorage.getItem('session'));
    } catch (e) {
        console.error("Error parsing session on DOMContentLoaded:", e);
    }
    if (session && session.role) {
        currentUser = session.username; // Ensure currentUser is set for initial checks
        currentRole = session.role;
        showDashboardForRole(session.role);
        // Start specific dashboard updates if role is manager or SPM
        if (currentRole === 'manager') {
            startManagerDashboardRealtimeUpdates();
        } else if (currentRole === 'spm' || currentRole === 'apjm') {
            setupSPMDashboardUpdates();
        }
    } else {
        showDashboardForRole('none'); // Show login if no valid session
    }
});

// Ensure login hours and username are displayed correctly on dashboard load
window.addEventListener('DOMContentLoaded', () => {
    const userNameElement = document.getElementById('userName');
    if (userNameElement && currentUser) {
        userNameElement.textContent = currentUser;
    }
    if (loginTime) { // Only start timer if loginTime is set (meaning a session exists)
        startLoginTimer();
    }
});
