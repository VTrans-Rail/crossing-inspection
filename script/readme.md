These scripts allow you to extract attached photos from a feature class, and resize them to make thumbnails.

Process:
* [Resize crossing photos (640px)](https://github.com/VTrans-Rail/crossing-inspection/blob/gh-pages/script/pyRotateResize.py)
  * Needs a master directory of crossing photos by DOT number like this: \\aotfs02v\vtrans$\PPID\Rail\GIS\Engineering\Crossings\Inspection\2015\CrossingPhotosbyID
* [Resize crossing photos (400px)](https://github.com/VTrans-Rail/crossing-inspection/blob/gh-pages/script/pyRotateResize400.py)
  * Needs a master directory of crossing photos by DOT number like this: \\aotfs02v\vtrans$\PPID\Rail\GIS\Engineering\Crossings\Inspection\2015\CrossingPhotosbyID
* [Export and process sign photos](https://github.com/VTrans-Rail/crossing-inspection/blob/gh-pages/script/ExportSignAttachResizeRotate.py)
  * Works directly against attachments 

Outputs:
* [Crossing photo thumbnails (640px)](https://github.com/VTrans-Rail/crossing-inspection/tree/gh-pages/thumb/CrossingPhotosbyID)
* [Crossing photo thumbnails (400px)](https://github.com/VTrans-Rail/crossing-inspection/tree/gh-pages/thumb/CrossingPhotosbyID400)
* [Sign photo thumbnails (533px)](https://github.com/VTrans-Rail/crossing-inspection/tree/gh-pages/thumb/SignPhotos)

