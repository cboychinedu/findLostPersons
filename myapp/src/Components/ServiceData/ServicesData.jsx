// Importing the necessary modules 
import { Search, Map, Users, BookOpen, MessageSquare, Shield } from 'lucide-react';

// Data structure holding all the service details
const servicesData = [
    {
        icon: Search,
        title: "Missing Person Reporting & Management",
        description: "A streamlined, secure system to file detailed missing person reports. Users can update case status, upload new evidence (photos, documents), and receive immediate case ID generation for official tracking.",
        color: "bg-red-500",
        detail: "Includes automatic notification to relevant regional law enforcement databases.",
    },
    {
        icon: Map,
        title: "Geographic Sighting Mapping & Hotspots",
        description: "Interactive mapping tool allowing users to submit geo-tagged sighting reports and view high-density areas (hotspots) for ongoing searches. Filters allow visualization by time and date.",
        color: "bg-blue-500",
        detail: "Powered by open-source mapping data and community reports.",
    },
    {
        icon: Users,
        title: "Community Collaboration & Volunteer Coordination",
        description: "Connect with verified local search parties and volunteers. Features include secure group chat functionality, task assignments, and coordinated search-area allocation to maximize efficiency.",
        color: "bg-green-500",
        detail: "Tools for team leaders to manage roles and track volunteer hours.",
    },
    {
        icon: BookOpen,
        title: "Resource & Support Library",
        description: "Access a comprehensive library of resources, including mental health support contacts, legal guidance for guardians/next-of-kin, and guides on interacting with media during an active case.",
        color: "bg-yellow-500",
        detail: "Curated list of non-profit counseling and legal aid services.",
    },
    {
        icon: MessageSquare,
        title: "Anonymous Tip Submission & Verification",
        description: "A secure channel for submitting anonymous tips and leads related to active cases. All submissions are filtered through a preliminary verification process before being shared with case managers.",
        color: "bg-purple-500",
        detail: "Maintains absolute anonymity for the tipster.",
    },
    {
        icon: Shield,
        title: "Safety Education & Prevention Workshops",
        description: "Interactive modules and downloadable content focusing on personal safety, digital footprint management, and immediate response protocols in emergency situations for families and vulnerable individuals.",
        color: "bg-teal-500",
        detail: "Topics cover child safety, elderly care, and traveler precautions.",
    },
];

// Exporting the services data 
export default servicesData; 
