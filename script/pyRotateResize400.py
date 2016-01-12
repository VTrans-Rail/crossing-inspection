import os
import sys
from PIL import Image

def resize(folder, fileName):
    filePath = os.path.join(folder, fileName)
    im = Image.open(filePath)
    size = 400, 400
    im.thumbnail(size, Image.ANTIALIAS)
    outPath = os.path.splitext(filePath)[0]
    print(outPath)
    im.save(outPath+"_400.jpg")
    os.remove(filePath) #remove file after thumbnail created


def bulkResize(imageFolder):
    imgExts = ["png", "bmp", "jpg"]
    for path, dirs, files in os.walk(imageFolder):
        for fileName in files:
            ext = fileName[-3:].lower()
            if ext not in imgExts:
                continue

            resize(path, fileName)

if __name__ == "__main__":
    imageFolder="C://Users//jfarmer//Documents//GitHub//crossing-inspection//script//CrossingPhotosbyID400" # first arg is path to image folder
    bulkResize(imageFolder)

# Inspirations:
# http://stackoverflow.com/questions/273946/how-do-i-resize-an-image-using-pil-and-maintain-its-aspect-ratio
# http://stackoverflow.com/questions/1048658/resize-images-in-directory
