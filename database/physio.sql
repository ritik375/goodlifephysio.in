-- =====================================================================
-- Physio Clinic — MySQL Database Schema
-- Create the database, all tables, and seed starter data.
-- Import with:  mysql -u root -p < database/physio.sql
-- =====================================================================

CREATE DATABASE IF NOT EXISTS physio_clinic
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE physio_clinic;

-- ---------------------------------------------------------------------
-- Table: admins
-- Stores admin panel login credentials (passwords are bcrypt hashes).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: services
-- Treatment / therapy services offered by the clinic.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  slug VARCHAR(170) NOT NULL UNIQUE,
  short_description VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(60) DEFAULT 'FaNotesMedical',
  duration_minutes INT DEFAULT 45,
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: doctors
-- Physiotherapists / practitioners profiles.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  designation VARCHAR(150) NOT NULL,
  specialization VARCHAR(200) NOT NULL,
  experience_years INT DEFAULT 0,
  bio TEXT,
  photo VARCHAR(255) DEFAULT NULL,
  email VARCHAR(150) DEFAULT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: gallery
-- Clinic photo gallery (facility, equipment, sessions).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  category VARCHAR(80) DEFAULT 'Facility',
  image VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: testimonials
-- Patient reviews / success stories.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_name VARCHAR(120) NOT NULL,
  condition_treated VARCHAR(150) DEFAULT NULL,
  rating TINYINT DEFAULT 5,
  message TEXT NOT NULL,
  photo VARCHAR(255) DEFAULT NULL,
  is_approved TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: appointments
-- Appointment requests submitted by visitors.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  service_id INT DEFAULT NULL,
  doctor_id INT DEFAULT NULL,
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(20) NOT NULL,
  message TEXT,
  status ENUM('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: clinic_info
-- Single-row table holding editable site-wide clinic details.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clinic_info (
  id INT PRIMARY KEY DEFAULT 1,
  clinic_name VARCHAR(150) NOT NULL DEFAULT 'MotionWell Physiotherapy',
  tagline VARCHAR(255) DEFAULT 'Restoring movement. Rebuilding strength.',
  about TEXT,
  address VARCHAR(255) DEFAULT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  whatsapp VARCHAR(30) DEFAULT NULL,
  email VARCHAR(150) DEFAULT NULL,
  map_embed_url TEXT,
  facebook_url VARCHAR(255) DEFAULT NULL,
  instagram_url VARCHAR(255) DEFAULT NULL,
  linkedin_url VARCHAR(255) DEFAULT NULL,
  opening_hours VARCHAR(255) DEFAULT 'Mon - Sat: 8:00 AM - 8:00 PM',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================================================
-- Seed Data
-- =====================================================================

-- Default admin login: email admin@motionwell.com / password Admin@123
-- IMPORTANT: change this password after first login in production.
INSERT INTO admins (name, email, password) VALUES
('Clinic Admin', 'admin@motionwell.com', '$2b$10$f9DIQgRZvzK3tvfIJnoTQ.mJVMC8Hvx.0.tyC3MbFjAuX1P7Y9Ar.')
ON DUPLICATE KEY UPDATE email = email;

INSERT INTO clinic_info (id, clinic_name, tagline, about, address, phone, whatsapp, email, map_embed_url, opening_hours) VALUES
(1,
 'MotionWell Physiotherapy',
 'Restoring movement. Rebuilding strength.',
 'MotionWell Physiotherapy is a dedicated musculoskeletal and sports rehabilitation clinic. Our licensed physiotherapists combine evidence-based manual therapy, guided exercise, and modern rehabilitation equipment to help every patient recover function and return to the activities they love.',
 '221 Meridian Avenue, Ranchi, Jharkhand 834001',
 '+91 98765 43210',
 '919876543210',
 'care@motionwell.example',
 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14563.0!2d85.3096!3d23.3441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDIwJzM4LjgiTiA4NcKwMTgnMzQuNiJF!5e0!3m2!1sen!2sin!4v1690000000000',
 'Mon - Sat: 8:00 AM - 8:00 PM, Sun: Closed'
)
ON DUPLICATE KEY UPDATE clinic_name = clinic_name;

INSERT INTO services (title, slug, short_description, description, icon, duration_minutes, display_order) VALUES
('Sports Injury Rehabilitation', 'sports-injury-rehabilitation', 'Get back in the game with a structured return-to-sport plan.', 'Our sports rehabilitation program is designed for athletes recovering from ligament tears, muscle strains, and joint injuries. We use functional movement screening, progressive loading, and sport-specific drills to safely restore performance and reduce re-injury risk.', 'FaRunning', 45, 1),
('Manual & Manipulative Therapy', 'manual-manipulative-therapy', 'Hands-on joint and soft tissue techniques for pain relief.', 'Skilled manual therapy including joint mobilization, myofascial release, and spinal manipulation to reduce stiffness, ease pain, and restore normal movement patterns in the spine and extremities.', 'FaHandHoldingMedical', 40, 2),
('Post-Surgical Rehabilitation', 'post-surgical-rehabilitation', 'Guided recovery protocols after orthopedic surgery.', 'Structured rehabilitation following joint replacement, ligament reconstruction, or fracture fixation, closely coordinated with your surgeon''s protocol to restore range of motion, strength, and independence.', 'FaProcedures', 50, 3),
('Neurological Physiotherapy', 'neurological-physiotherapy', 'Specialized care for stroke, spinal cord, and nerve conditions.', 'Targeted neuro-rehabilitation for patients recovering from stroke, spinal cord injury, or peripheral nerve conditions, focusing on balance, coordination, gait training, and functional independence.', 'FaBrain', 50, 4),
('Postural & Ergonomic Correction', 'postural-ergonomic-correction', 'Fix desk-related pain with posture retraining.', 'Assessment and correction of postural imbalances caused by prolonged sitting or repetitive strain, paired with ergonomic workstation guidance and a personalized corrective exercise plan.', 'FaChair', 30, 5),
('Chronic Pain Management', 'chronic-pain-management', 'Long-term strategies for persistent musculoskeletal pain.', 'A multi-modal approach combining graded exercise therapy, education, and manual techniques to manage chronic conditions such as arthritis, fibromyalgia, and long-standing back pain.', 'FaHeartbeat', 45, 6)
ON DUPLICATE KEY UPDATE title = title;

INSERT INTO doctors (name, designation, specialization, experience_years, bio, display_order) VALUES
('Dr. Ananya Sharma', 'Lead Physiotherapist, MPT (Ortho)', 'Sports Injuries & Post-Surgical Rehab', 12, 'Dr. Ananya has spent over a decade helping competitive athletes and weekend warriors recover from ACL reconstructions, rotator cuff repairs, and chronic overuse injuries. She is certified in dry needling and blood flow restriction training.', 1),
('Dr. Rohan Verma', 'Senior Physiotherapist, MPT (Neuro)', 'Neurological & Geriatric Rehabilitation', 9, 'Dr. Rohan specializes in stroke recovery and balance disorders, using task-specific training and gait analysis to help patients regain independence in daily living.', 2),
('Dr. Priya Nair', 'Physiotherapist, BPT, Dip. Manual Therapy', 'Spinal & Manual Therapy', 6, 'Dr. Priya focuses on spinal conditions and joint mobilization, blending manual techniques with corrective exercise for lasting relief from back and neck pain.', 3)
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO testimonials (patient_name, condition_treated, rating, message) VALUES
('Ramesh Gupta', 'ACL Reconstruction', 5, 'After my ACL surgery I could barely bend my knee. The team at MotionWell built a recovery plan that got me back on the football field in under six months. Genuinely life-changing care.'),
('Sunita Rao', 'Chronic Lower Back Pain', 5, 'Years of desk work had wrecked my posture and my back. The postural correction program and manual therapy sessions finally gave me lasting relief, not just a temporary fix.'),
('Vikram Singh', 'Stroke Recovery', 5, 'My father regained so much mobility after his stroke thanks to the neuro rehab team. Their patience and structured approach made all the difference in his recovery journey.')
ON DUPLICATE KEY UPDATE patient_name = patient_name;

INSERT INTO gallery (title, category, image, display_order) VALUES
('Rehabilitation Gym Floor', 'Facility', 'seed/gym-floor.jpg', 1),
('Manual Therapy Room', 'Facility', 'seed/therapy-room.jpg', 2),
('Gait Analysis Session', 'Sessions', 'seed/gait-analysis.jpg', 3),
('Hydrotherapy Pool', 'Facility', 'seed/hydrotherapy.jpg', 4)
ON DUPLICATE KEY UPDATE title = title;
