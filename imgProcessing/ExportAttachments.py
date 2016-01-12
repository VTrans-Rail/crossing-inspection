import arcpy
from arcpy import da
import os

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
        del item
        del filenum
        del filename
        del attachment

# http://stackoverflow.com/questions/273192/in-python-check-if-a-directory-exists-and-create-it-if-necessary
# create unique ID for features http://gis.stackexchange.com/questions/34605/assign-unique-id-to-each-polygon
