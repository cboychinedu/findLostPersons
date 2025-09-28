// Importing the necessary modules 
import { ChevronRight } from 'lucide-react';

// Reusable component for an individual Service Card
const ServiceCard = ({ icon: Icon, title, description, color, detail }) => (
    <div 
        className="bg-white p-6 rounded-2xl shadow-xl transition-transform duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col border-t-4 border-gray-100"
        style={{ borderColor: color.replace('bg', 'border') }} // Dynamically set the card border color
    >
        {/* Icon Container */}
        <div className={`p-3 rounded-full inline-block ${color} text-white mb-4 shadow-md`}>
            <Icon size={28} />
        </div>
        
        {/* Title and Description */}
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        
        <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        
        {/* Detail Link/Information */}
        <div className="mt-auto pt-4 border-t border-gray-100">
            <span className="text-sm font-medium flex items-center text-indigo-600">
                {detail}
                <ChevronRight size={16} className="ml-1" />
            </span>
        </div>
    </div>
);

// Exporting the service card 
export default ServiceCard; 