import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import ROMArc from '../components/ROMArc';

const NotFound = () => (
  <section className="py-24">
    <div className="container-clinic max-w-lg text-center">
      <ROMArc degrees={45} className="w-48 mx-auto mb-4" showTicks={false} />
      <h1 className="font-display text-4xl font-semibold">404</h1>
      <p className="text-slate mt-3">This page moved outside its expected range of motion.</p>
      <Link to="/" className="btn-primary mt-8 inline-flex"><FaArrowLeft size={13} /> Back to Home</Link>
    </div>
  </section>
);

export default NotFound;
