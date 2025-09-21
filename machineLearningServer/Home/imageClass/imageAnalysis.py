# importing the necessary modules
import os
import tensorflow as tf
import numpy as np
import cv2
from random import randint

# Setting the path to the model
modelPath = os.path.join("Home", "savedModel")

# Defining a class
class ImageModelClass:
    def __init__(self, image):
        # load the model
        self.model = tf.saved_model.load(modelPath)
        self.image = image

    def processImage(self):
        # Load the image
        image = cv2.imread(self.image)

        # Convert the image to a NumPy array
        image = np.array(image)

        # Convert the image into an input tensor (blob)
        inputTensor = tf.convert_to_tensor(np.expand_dims(image, 0), dtype=tf.uint8) 
        
        # Return the processed tensor
        return (inputTensor, image)

    def performObjectDetection(self):
        # Perform object detection by calling the function and passing the result
        (inputTensor, image) = self.processImage() 

        # Getting the detection 
        detection = self.model(inputTensor)

        # Parse the detection results
        boxes = detection["detection_boxes"].numpy()
        classes = detection["detection_classes"].numpy().astype(int)
        scores = detection["detection_scores"].numpy()

        # Setting the labels
        labels = ['__background__', 'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus',
                  'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter',
                  'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra',
                  'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis',
                  'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
                  'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana',
                  'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake',
                  'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse',
                  'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator',
                  'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush']

        # Detecting the object inside the image 
        for i in range(classes.shape[1]): 
            classId = int(classes[0, i]) 
            score = scores[0, i]
            
            # Confidence level 
            if np.any(score > 0.5): 
                h, w, _ = image.shape
                ymin, xmin, ymax, xmax = boxes[0, i] 
                
                # Convert the normalized coordinates to image coordinates 
                xmin = int(xmin * w) 
                xmax = int(xmax * w) 
                ymin = int(ymin * h) 
                ymax = int(ymax * h) 
                
                # Get the class name from the labels list 
                className = labels[classId]
                randomColor = (randint(0, 256), randint(0, 256), randint(0, 256))
                
                # Draw bounding box and label the image 
                cv2.rectangle(image, (xmin, ymin), (xmax, ymax), randomColor, 2)
                label = f"{className}, {score}"
                cv2.putText(image, label, (xmin, ymin - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, randomColor, 2) 
                
        # Returning the image 
        return image 