import arcpy
from arcpy import da
import os

inTable = arcpy.GetParameterAsText(0)

with arcpy.da.UpdateCursor(inTable, ['DATA']) as cursor:
    for row in cursor:
        data = open(r"C:\Users\jfarmer\Documents\ArcGIS\BackupCrossingInspectionData\Sign_Inspection_Images\ATT10318_Photo1.jpg", "rb").read()
        row.setValue('DATA', data)
        cursor.updateRow(row)
        data.close()
