
from PIL import Image
from PIL.ExifTags import TAGS

def processImage(path=None, baseWidth=256):
    filename, extension = os.path.basename(path).split(".") # Assume 4 chars for .ext

    # Load to memory object
    img = Image.open(path)
    
    # Create dict for EXIF data
    exifData = {}

    # Obtain EXIF rotation
    info = img._getexif()
    
    # Populate EXIF dict
    for (tag, value) in info.items():
        decoded = TAGS.get(tag, tag)
        exifData[decoded] = value
    
    # Process picture orientation / rotation
    orientation = exifData["Orientation"]
    if orientation == 1:
        #im = img
        pass
    elif orientation == 3:
        img = img.transpose(Image.ROTATE_180)
    elif orientation == 6:
        img = img.transpose(Image.ROTATE_270)
    elif orientation == 8:
        img = img.transpose(Image.ROTATE_90)

    # Resize for thumbnail
    wpercent = (baseWidth / float(img.size[0]))
    hsize = int(float(img.size[1]) * float(wpercent))
    img = img.resize((baseWidth, hsize), Image.ANTIALIAS)

    target = os.path.join(os.path.dirname(path), "{0}_resize.{1}".format(filename, extension))
    
    img.save(target)