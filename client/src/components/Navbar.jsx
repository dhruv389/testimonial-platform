import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Testimonial Platform
          </Link>
          
          <div className="flex space-x-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Submit
            </Link>
            <Link 
              to="/wall" 
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Wall
            </Link>
            <Link 
              to="/dashboard" 
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;