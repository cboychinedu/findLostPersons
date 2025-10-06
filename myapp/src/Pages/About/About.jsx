// Importing the necessary modules 
import { Fragment } from 'react';
import Footer from "@components/Footer/Footer";
import RootNavbar from '@components/Navbar/RootNavbar';
import DashboardNavbar from '@components/Navbar/DashboardNavbar';
import { 
    Users, MessageSquare, 
    Shield, Lightbulb } 
from 'lucide-react';

// Getting the user token 
const tokenValue = localStorage.getItem("xAuthToken") || null;


// Setting the pillar card 
const PillarCard = ({ title, description, icon: Icon, color }) => (
    <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-md transition-shadow hover:shadow-lg">
        <Icon size={32} className={`mx-auto mb-3 ${color}`} />
        <h3 className="font-bold text-xl mb-1 text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
    </div>
);

// Defining the about page 
const AboutPage = () => {
    return (
        <Fragment> 
            {/* Adding the navbar  */}
            {tokenValue ? <DashboardNavbar styles={{marginTop: "-130px"}}/> : <RootNavbar />}

            {/* Adding the container */}
            <div className="mt-[100px]"> 
                <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-2xl pt-[2em] mt-[130px]">
                    {/* Back button removed to make it isolated */}

                    <header className="text-center mb-10">
                        <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
                            Our Mission
                        </h1>
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                            Leveraging technology and community spirit to accelerate the search for missing persons and provide critical support to families.
                        </p>
                    </header>

                    <div className="mb-10 p-6 bg-indigo-50 rounded-xl">
                        <h2 className="text-3xl font-bold text-indigo-800 mb-4 flex items-center">
                            <Lightbulb size={28} className="mr-3"/> Who We Are
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We are a non-profit initiative founded on the belief that timely, coordinated information is the most powerful tool in missing persons cases. Our platform replaces fragmented communication with a centralized, secure system for reporting, sharing, and coordinating search efforts globally.
                        </p>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Core Values</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                        <PillarCard 
                            title="Compassion" 
                            description="We approach every case with empathy, offering non-judgmental support to all users." 
                            icon={Users} 
                            color="text-indigo-600" 
                        />
                        <PillarCard 
                            title="Integrity" 
                            description="We ensure data security, privacy, and strive for accurate, verifiable information." 
                            icon={Shield} 
                            color="text-green-600" 
                        />
                        <PillarCard 
                            title="Collaboration" 
                            description="Our goal is to facilitate seamless teamwork between families, public, and law enforcement." 
                            icon={MessageSquare} 
                            color="text-red-600" 
                        />
                    </div>
                    
                    <hr className="my-10 border-gray-100" />

                    <div className="text-center p-4">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Join the Effort</h3>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Whether you are filing a report, sharing a sighting, or volunteering your time, you are an essential part of our network. Together, we can make a difference.
                        </p>
                    </div>
                </div>
            </div>

            {/* Adding the footer  */}
            <Footer /> 
        </Fragment>
    );
};

// Exporting the about page 
export default AboutPage; 