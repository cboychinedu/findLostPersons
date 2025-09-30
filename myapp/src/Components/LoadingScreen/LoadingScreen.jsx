// Component for the loading screen
const LoadingScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white transition-opacity duration-500">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-4 text-xl font-semibold">Loading Dashboard...</p>
    </div>
);


// export the component
export default LoadingScreen;
