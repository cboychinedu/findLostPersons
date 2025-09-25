// Helper component to render each image item
const RenderImages = ({ data, index }) => (
    <div 
        key={data._id || index} 
        className="mb-4 p-3 border border-gray-200 rounded-lg shadow-sm"
    >
        <h3 className="text-md font-medium text-gray-800">
            Predicted: <span className="font-bold text-blue-600">{data.predictedLabel || 'N/A'}</span>
        </h3>
        
        {/* The image is rendered here, handling the base64 URL */}
        {data.imageUrl && (
            <img 
                src={data.imageUrl} 
                alt={`Analyzed image ${index + 1}`} 
                className="w-full max-h-64 object-contain my-2 border border-gray-300"
            />
        )}
        
        <p className="text-sm text-gray-600">
            <b> Probability: </b> <span className="font-mono">{data.proba ? `${(data.proba * 100).toFixed(2)}%` : 'N/A'}</span>
        </p>
    </div>
);

// Exporting the component 
export default RenderImages; 