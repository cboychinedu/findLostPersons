// helper component to render each video item 
const RenderVideos = ({ data, index }) => (
    <div
        key={data._id || index} 
        className="mb-4 p-3 border border-gray-200 rounded-lg shadow-sm"
    > 
        <h3 className="text-md font-medium text-gray-800"> 
            Predicted Label: <span className="font-bold text-blue-600">{data.predictedLabel || 'N/A'} </span>
        </h3>

        {/* The video is rendered here */}
        {data.videoUrl && (
            <video 
                src={data.videoUrl}
                key={data._id || index}
                controls
                className="w-full h-full object-contain"
            >
                Your browser cannot load the video 
            </video>
        )}

        <p className="text-sm text-gray-600"> 
            <b> Probability: </b> <span className="font-mono">{data.proba ? `${(data.proba * 100).toFixed(2)}%` : 'N/A'}</span>
        </p>

    </div>
)


// Exporting the component 
export default RenderVideos; 


// predictedLabel
// : 
// "chinedu: 62.94%"
// proba
// : 
// 0.6294027318094219
