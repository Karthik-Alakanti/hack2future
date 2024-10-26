"""

install these before running it 
!pip install torch torchvision
!pip install git+https://github.com/facebookresearch/detectron2.git


!git clone https://github.com/facebookresearch/meshrcnn.git
%cd meshrcnn
!pip install -e .


"""





import torch
import cv2
import numpy as np
import matplotlib.pyplot as plt
import os
import sys
# parent_dir = os.path.abspath(os.path.join(os.path.dirname("hack2future/meshrcnn/meshrcnn_whole.ipynb"), '..'))
# sys.path.append(parent_dir)


from detectron2.engine import DefaultPredictor
from detectron2.config import get_cfg
from detectron2 import model_zoo
from detectron2.utils.visualizer import Visualizer
from detectron2.data import MetadataCatalog

# Load the image
image_path = "/content/hi.jpg"
image = cv2.imread(image_path)

# Configure Mask R-CNN
cfg = get_cfg()
cfg.merge_from_file(model_zoo.get_config_file("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml"))
cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = 0.5  # Set threshold for this model
cfg.MODEL.WEIGHTS = model_zoo.get_checkpoint_url("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml")
predictor = DefaultPredictor(cfg)

# Run Mask R-CNN prediction
outputs = predictor(image)

# Visualize Mask R-CNN Results
v = Visualizer(image[:, :, ::-1], MetadataCatalog.get(cfg.DATASETS.TRAIN[0]), scale=1.2)
out = v.draw_instance_predictions(outputs["instances"].to("cpu"))
plt.imshow(out.get_image()[:, :, ::-1])
plt.axis("off")
plt.show()

# Extract Mask R-CNN results for Mesh R-CNN
instances = outputs["instances"]
masks = instances.pred_masks.cpu().numpy()
boxes = instances.pred_boxes.tensor.cpu().numpy()
classes = instances.pred_classes.cpu().numpy()

# Initialize Mesh R-CNN
cfg = get_cfg()
cfg.merge_from_file(model_zoo.get_config_file("COCO-InstanceSegmentation/meshrcnn_R50_FPN.yaml"))
cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = 0.5  # Set threshold for this model
cfg.MODEL.WEIGHTS = model_zoo.get_checkpoint_url("COCO-InstanceSegmentation/meshrcnn_R50_FPN.yaml")
mesh_predictor = DefaultPredictor(cfg)

# Iterate over each detected object to generate 3D meshes
for i, (mask, box, cls) in enumerate(zip(masks, boxes, classes)):
    print(f"Processing object {i+1} (Class: {cls})")
    
    # Mask and bounding box preprocessing for Mesh R-CNN
    # Create a masked image to pass to Mesh R-CNN
    masked_image = image.copy()
    masked_image[~mask] = 0  

    # Run Mesh R-CNN prediction on the masked image
    mesh_output = mesh_predictor(masked_image)
    
    v = Visualizer(masked_image[:, :, ::-1], MetadataCatalog.get(cfg.DATASETS.TRAIN[0]), scale=1.2)
    out = v.draw_instance_predictions(mesh_output["instances"].to("cpu"))
    plt.imshow(out.get_image()[:, :, ::-1])
    plt.axis("off")
    plt.show()

print("Completed Mask R-CNN and Mesh R-CNN processing.")