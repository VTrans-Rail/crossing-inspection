import arcpy
from arcpy import da
import os
import sys
from PIL import Image
from PIL.ExifTags import TAGS

inTable = arcpy.GetParameterAsText(0)
fileLocation = arcpy.GetParameterAsText(1)

with da.SearchCursor(inTable, ['DATA', 'ATT_NAME', 'ATTACHMENTID', 'DOT_Num', 'SignUID']) as cursor:
    for item in cursor:
        attachment = item[0]
        filenum = str(item[1])[0:6] + "_" + str(item[3]) + "_ATT" + str(item[2])
        filename = filenum + str(item[1])[6:10]
        if not os.path.exists(fileLocation + "/" + str(item[3]) + "-" + str(item[4])):
            os.makedirs(fileLocation + "/" + str(item[3]) + "-" + str(item[4]))
        open(fileLocation + "/" + str(item[3]) + "-" + str(item[4]) + os.sep + filename, 'wb').write(attachment.tobytes())

        #Setup for Image Editing
        filePath = fileLocation + "/" + str(item[3]) + "-" + str(item[4]) + os.sep + filename
        im = Image.open(filePath)

        # begin rotation
        # Create dict for EXIF data
        exifData = {}

        # Obtain EXIF rotation
        info = im._getexif()

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
            im = im.transpose(Image.ROTATE_180)
        elif orientation == 6:
            im = im.transpose(Image.ROTATE_270)
        elif orientation == 8:
            im = im.transpose(Image.ROTATE_90)
        # end rotation

        #begin resize
        size = 400, 400
        im.thumbnail(size, Image.ANTIALIAS)
        outPath = os.path.splitext(filePath)[0]
        print(outPath)
        im.save(outPath+"_thumb.jpg")
        os.remove(filePath)
        #end resize


        del item
        del filenum
        del filename
        del attachment

# http://stackoverflow.com/questions/273192/in-python-check-if-a-directory-exists-and-create-it-if-necessary
# create unique ID for features http://gis.stackexchange.com/questions/34605/assign-unique-id-to-each-polygon
