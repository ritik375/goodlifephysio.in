import { FaUserMd, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { resolveImage } from '../services/api';

const DoctorCard = ({ doctor }) => (
  <div className="card overflow-hidden group hover:shadow-lift transition-shadow duration-300">
    <div className="aspect-[4/5] bg-primary-light overflow-hidden flex items-center justify-center">
      {doctor.photo ? (
        <img
          src={resolveImage(doctor.photo)}
          alt={doctor.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <FaUserMd size={64} className="text-primary/40" />
      )}
    </div>
    <div className="p-6">
      <h3 className="font-display text-lg font-semibold">{doctor.name}</h3>
      <p className="text-accent-dark text-sm font-medium mt-0.5">{doctor.designation}</p>
      <p className="text-slate text-sm mt-2">{doctor.specialization}</p>
      <p className="font-mono text-xs text-slate-light mt-3">{doctor.experience_years}+ years experience</p>
      {doctor.bio && <p className="text-sm text-slate mt-3 leading-relaxed line-clamp-3">{doctor.bio}</p>}
      {(doctor.email || doctor.phone) && (
        <div className="flex flex-col gap-1.5 mt-4 pt-4 border-t border-line text-xs text-slate">
          {doctor.email && (
            <span className="flex items-center gap-2"><FaEnvelope size={11} /> {doctor.email}</span>
          )}
          {doctor.phone && (
            <span className="flex items-center gap-2"><FaPhoneAlt size={11} /> {doctor.phone}</span>
          )}
        </div>
      )}
    </div>
  </div>
);

export default DoctorCard;
