CREATE TABLE org_field_labels (
    label_id        INT AUTO_INCREMENT PRIMARY KEY,
    
    org_id          INT,                         -- Organization-specific label (NULL means applies to all orgs)
    sector          VARCHAR(100),                -- Industry/Sector name (IT, Medical, Education, etc) | NULL means applies to all sectors
    
    module_name     VARCHAR(100) NOT NULL,       -- Module name (projects / timecard / project_schedule / employees etc.)
    field_name      VARCHAR(255) NOT NULL,       -- Database field/column name for mapping
    
    default_label   VARCHAR(255) NOT NULL,       -- Original product-level default UI label
    custom_label    VARCHAR(255),                -- Updated label based on sector or organization settings
    
    status          VARCHAR(2) DEFAULT 'A',      -- A → Active, I → Inactive
    
    created_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Audit: Record creation timestamp
    created_by      VARCHAR(255),                -- Audit: Created by
    
    last_update_date TIMESTAMP NULL,             -- Audit: Last updated timestamp
    last_updated_by VARCHAR(255) NULL            -- Audit: Updated by
);

--  it will store the  hr's history

CREATE TABLE tc_hr_assignments (
    assign_id       INT AUTO_INCREMENT PRIMARY KEY,    -- Unique ID for assignment
    emp_id              INT NOT NULL,                      -- Employee being assigned
    hr_emp_id           INT NOT NULL,                      -- HR employee responsible
    org_id              INT NOT NULL,                      -- Organization ID
    assigned_date       TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Assignment timestamp
    status              VARCHAR(2) DEFAULT 'A',           -- A → Active, I → Inactive
    effective_from      DATE NOT NULL,                     -- Start of reporting
    effective_to        DATE NULL,   
    created_by          VARCHAR(255),
    last_update_date    TIMESTAMP NULL,
    last_updated_by     VARCHAR(255)
);


CREATE TABLE tc_reporting_manager_assignments (
    assign_id       INT AUTO_INCREMENT PRIMARY KEY,    -- Unique ID for assignment
    emp_id              INT NOT NULL,                      -- Employee
    manager_emp_id      INT NOT NULL,                      -- Manager employee
    org_id              INT NOT NULL,                      -- Organization
    effective_from      DATE NOT NULL,                     -- Start of reporting
    effective_to        DATE NULL,                         -- End of reporting (NULL = current)
    status              VARCHAR(2) DEFAULT 'A',           -- A → Active, I → Inactive
    created_date        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by          VARCHAR(255),
    last_update_date    TIMESTAMP NULL,
    last_updated_by     VARCHAR(255)
);

CREATE TABLE tc_projects (
    proj_id     INT AUTO_INCREMENT PRIMARY KEY,
	proj_no			INT,
	field_name 	 VARCHAR(255),
    proj_name   VARCHAR(255) ,
    proj_code   VARCHAR(100) ,
    start_date     DATE ,
    end_date       DATE,
    hierarchy_flag VARCHAR(2),
    billable_flag  VARCHAR(2),
    support_identifier VARCHAR(100),
    client_id      INT,
    client_name    VARCHAR(255),
    summary        TEXT,
    org_id         INT ,
	mod_no		   INT,
    status         VARCHAR(2), -- A--> Active , I --> INACTIVE , S --> Saved , O --> ONHOLD , C --> CLOSED
    created_date     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by		VARCHAR(255),
	last_update_date date,
	last_updated_by varchar2(255),
	last_login_by varchar2(255)	
);

CREATE TABLE proj_tasks (
    task_id     INT AUTO_INCREMENT PRIMARY KEY,
	task_no     INT,
    proj_id     INT ,
    task_name   VARCHAR(255) ,
    task_code   VARCHAR(100),
    org_id      INT ,
	mod_no		INT,
	created_date     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    start_date,
    end_date,
    status,
	created_by		VARCHAR(255),
	last_update_date date,
	last_updated_by varchar2(255),
	last_login_by varchar2(255)	
);


CREATE TABLE proj_assignments (
    assign_id      INT AUTO_INCREMENT PRIMARY KEY,
	assign_no	   INT,
    org_id         INT ,
    proj_id        INT ,
    task_id        INT,
    emp_id         INT ,
    role_id        INT,
	desg_id        INT,
    approver_box   VARCHAR(2),
    start_date     DATE,
    end_date       DATE,
    current_status VARCHAR(2),  -- A Active, I Inactive
    status         VARCHAR(2), --A assigned, U unassigned ,C completed ,C cancelled
    contract_start_date DATE,
    contract_end_date   DATE,
	mod_no		INT,
	created_date     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by		VARCHAR(255),
	last_update_date date,
	last_updated_by varchar2(255),
	last_login_by varchar2(255)	
	);

CREATE TABLE proj_schedule (
    schedule_id      INT AUTO_INCREMENT PRIMARY KEY,
    proj_id          INT,
	assign_id		 INT,
    emp_id           INT,
    org_id           INT,
    month_year       VARCHAR(7),  -- Format: MM-YYYY

    day1   INT,
    day2   INT,
    day3   INT,
    day4   INT,
    day5   INT,
    day6   INT,
    day7   INT,
    day8   INT,
    day9   INT,
    day10  INT,
    day11  INT,
    day12  INT,
    day13  INT,
    day14  INT,
    day15  INT,
    day16  INT,
    day17  INT,
    day18  INT,
    day19  INT,
    day20  INT,
    day21  INT,
    day22  INT,
    day23  INT,
    day24  INT,
    day25  INT,
    day26  INT,
    day27  INT,
    day28  INT,
    day29  INT,
    day30  INT,
    day31  INT,

    total_hours      INT,
    status           VARCHAR(2),  -- A Active, I Inactive, S Saved
    mod_no           INT,
    created_date     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by       VARCHAR(255),
    last_update_date DATE,
    last_updated_by  VARCHAR(255),
    last_login_by    VARCHAR(255),
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE proj_hierarchy (
    hier_id   INT AUTO_INCREMENT PRIMARY KEY,
	hier_no        INT,
    org_id         INT ,
    proj_id        INT,
    emp_id         INT,
    approver_id    INT,
    line_no        VARCHAR(100), --- L1 , L2, L3
	status         VARCHAR(2),
	mod_no		INT,
	created_date     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by		VARCHAR(255),
	last_update_date date,
	last_updated_by varchar2(255),
	last_login_by varchar2(255)	
	);


CREATE TABLE tc_master (
    tc_master_id   INT AUTO_INCREMENT PRIMARY KEY,
    org_id         INT ,
    start_date     DATE ,
    end_date       DATE ,
    week_start     DATE ,
    week_end       DATE ,
	mod_no		INT,
	created_date     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by		VARCHAR(255),
	last_update_date date,
	last_updated_by varchar2(255),
	last_login_by varchar2(255)	
);

CREATE TABLE tc_timecard (
    tc_id          INT AUTO_INCREMENT PRIMARY KEY,
    tc_master_id   INT ,
    org_id         INT ,
    emp_id         INT ,
    proj_id        INT ,
    task_id        INT ,
    day1     INT,
    day2     INT,
    day3     INT,
    day4     INT,
    day5     INT,
    day6     INT,
    day7     INT,
    scheduled INT,
    reported  INT,1
    submitted INT,
    status VARCHAR(2), -- > S Submitt, s submitt, A APPROVED, R REJECTED,hold
	remarks TEXT,
    approver_id      INT,
    current_approver INT,
    final_approver   INT,
	mod_no		INT,
	created_date     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by		VARCHAR(255),
	last_update_date date,
	last_updated_by varchar2(255),
	last_login_by varchar2(255)	,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE tc_leaves (
    leave_id        INT AUTO_INCREMENT PRIMARY KEY,
    emp_id          INT ,
    org_id          INT ,
    leave_type_id   INT ,
    start_date      DATE ,
    end_date        DATE ,
    status          VARCHAR(2), -- A--> Approved , D --> DRAFT , 'R' --> Rejected ,S --> Submitted 
	mod_no		INT,
	created_date     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by		VARCHAR(255),
	last_update_date date,
	last_updated_by varchar2(255),
	last_login_by varchar2(255)	,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tc_holidays (
    hol_id           INT AUTO_INCREMENT PRIMARY KEY,
	hol_no			INT,
    org_id         INT ,
    hol_name         VARCHAR(255) ,
    hol_code         VARCHAR(100),
    start_date     DATE ,
    end_date       DATE ,
	mod_no		INT,
	created_date     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by		VARCHAR(255),
	last_update_date date,
	last_updated_by varchar2(255),
	last_login_by varchar2(255)	
);

CREATE TABLE tc_leave_apply (
    apply_id        INT AUTO_INCREMENT PRIMARY KEY,
    emp_id          INT ,
    org_id          INT ,
    leave_type_id   INT ,
    start_date      DATE ,
    end_date        DATE ,
    total_days      INT,
    reason          TEXT,
	status			VARCHAR(2),
	   -- D Draft but not submitted
       -- S submitted -- Waiting for approval
       -- A approved  -- Approved by approver
       -- R rejected  -- Rejected by approver

    submitted_date  DATETIME,
    approved_date   DATETIME,
    rejected_date   DATETIME,
    approver_id     INT,            -- Who approved/rejected
    current_approver INT,           -- For hierarchy flow
    final_approver   INT,           -- Last approver
	mod_no		INT,
	created_date     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by		VARCHAR(255),
	last_update_date date,
	last_updated_by varchar2(255),
	last_login_by varchar2(255)	
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE tc_approval_history (
    approval_id        INT AUTO_INCREMENT PRIMARY KEY,  -- Unique ID
    tc_id              INT NOT NULL,                    -- Timesheet record ID
    approver_id        INT NOT NULL,                    -- Employee approving/rejecting
    action_taken       VARCHAR(20) NOT NULL,            -- APPROVED / REJECTED / SAVED
    remarks            TEXT,                             -- Comments
    action_date        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sla_due_date       TIMESTAMP NULL,                  -- SLA deadline for approval
    status             VARCHAR(2) DEFAULT 'A',          -- A → Active, I → Inactive
    mod_no		   INT,
	created_by         VARCHAR(255),
    last_update_date   TIMESTAMP NULL,
    last_updated_by    VARCHAR(255)
);

CREATE TABLE tc_activity_log (
    log_id            INT AUTO_INCREMENT PRIMARY KEY,   -- Unique log ID
    emp_id            INT NOT NULL,                     -- Employee performing action
    module_name       VARCHAR(100) NOT NULL,           -- Module (timecard, projects, leaves, etc.)
    action            VARCHAR(255) NOT NULL,           -- Action performed (CREATE/UPDATE/DELETE/APPROVE)
    reference_id      INT NULL,                         -- ID of record affected
    action_date       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status            VARCHAR(2) DEFAULT 'A',           -- A → Active, I → Inactive
    mod_no		   INT,
	remarks           TEXT,
    created_by        VARCHAR(255),
    last_update_date  TIMESTAMP NULL,
    last_updated_by   VARCHAR(255)
);

-- this table is used for alerts 
CREATE TABLE tc_org_modules_settings (
    setting_id        INT AUTO_INCREMENT PRIMARY KEY,  -- Unique ID
    org_id            INT NOT NULL,                    -- Organization
    module_name       VARCHAR(100) NOT NULL,           -- Module (timecard, projects, leaves, payroll etc.)
    enabled_flag      VARCHAR(2) DEFAULT 'Y',          -- Y → Enabled, N → Disabled
    sla_days          INT DEFAULT 0,                   -- SLA in days for this module (e.g., approval, submission)
    mod_no		   INT,
	created_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by        VARCHAR(255),
    last_update_date  TIMESTAMP NULL,
    last_updated_by   VARCHAR(255)
);

-- tc_org_modules_settings is a configuration table that allows the application to behave differently for different organizations or sectors.

CREATE TABLE tc_notifications (
    notification_id     INT AUTO_INCREMENT PRIMARY KEY,  -- Unique notification ID
    emp_id              INT NOT NULL,                    -- Recipient employee
    module_name         VARCHAR(100) NOT NULL,           -- Related module (timecard, approval, leave, etc.)
    reference_id        INT NULL,                         -- Related record (timesheet id, leave id, etc.)
    message             VARCHAR(500) NOT NULL,           -- Notification message
    read_flag           VARCHAR(2) DEFAULT 'N',          -- N → Unread, Y → Read
    priority            VARCHAR(10) DEFAULT 'Normal',    -- Low, Normal, High
    sent_date           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status              VARCHAR(2) DEFAULT 'A',          -- A → Active, I → Inactive
    mod_no		   INT,
	created_by          VARCHAR(255),
    last_update_date    TIMESTAMP NULL,
    last_updated_by     VARCHAR(255)
);


CREATE TABLE tc_notification_settings (
    setting_id         INT AUTO_INCREMENT PRIMARY KEY,   -- Unique ID
    org_id             INT NOT NULL,                     -- Organization
    emp_id             INT NULL,                         -- Employee (if null, default for org)
    module_name        VARCHAR(100) NOT NULL,            -- Module name
    mod_no		   INT,
	notify_email       VARCHAR(2) DEFAULT 'Y',           -- Y → send email, N → do not send
    notify_push        VARCHAR(2) DEFAULT 'Y',           -- Y → send push, N → do not send
    notify_sms         VARCHAR(2) DEFAULT 'N',           -- Y → send SMS
    created_date       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by         VARCHAR(255),
    last_update_date   TIMESTAMP NULL,
    last_updated_by    VARCHAR(255)
);

--- History TABLESPACE  (AUDIT TABLE)
CREATE TABLE tc_employee_history (
    history_id        INT AUTO_INCREMENT PRIMARY KEY,  -- Unique ID
    emp_id            INT NOT NULL,                    -- Employee being modified
    modified_by       INT NOT NULL,                    -- Employee/admin who made the change
    mod_no		   INT,
	modification_type VARCHAR(50) NOT NULL,           -- UPDATE / CREATE / DELETE
    modified_field    VARCHAR(100) NULL,              -- Field that was modified
    old_value         VARCHAR(500) NULL,              -- Previous value
    new_value         VARCHAR(500) NULL,              -- New value
    modification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remarks           TEXT,
    status            VARCHAR(2) DEFAULT 'A'          -- A → Active, I → Inactive
);
