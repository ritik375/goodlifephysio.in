import {
  FaRunning, FaHandHoldingMedical, FaProcedures, FaBrain, FaChair, FaHeartbeat,
  FaNotesMedical, FaWalking, FaBone, FaDumbbell, FaSpa, FaChild,
} from 'react-icons/fa';

// Maps the icon name stored in the database (e.g. "FaRunning") to the
// actual react-icons component, so the admin can pick a service icon by
// name without the frontend needing a hardcoded switch per service.
const ICON_MAP = {
  FaRunning, FaHandHoldingMedical, FaProcedures, FaBrain, FaChair, FaHeartbeat,
  FaNotesMedical, FaWalking, FaBone, FaDumbbell, FaSpa, FaChild,
};

export const getIcon = (name) => ICON_MAP[name] || FaNotesMedical;

export const ICON_OPTIONS = Object.keys(ICON_MAP);
