# Creates a Unique ID (string field) for each feature with leading zeros
# http://gis.stackexchange.com/questions/34605/assign-unique-id-to-each-polygon
# integer to string and vice versa http://stackoverflow.com/questions/961632/converting-integer-to-string-in-python
# add leading zeros http://www.tutorialspoint.com/python/string_zfill.htm

# insert in expression
autoIncrement()

# insert in code block
rec=0
def autoIncrement():
 	global rec
 	pStart = 1 #adjust start value, if req'd
 	pInterval = 1 #adjust interval value, if req'd
 	if (rec == 0):
  		rec = str(pStart).zfill(4)
 	else:
  		rec = str(int(rec) + pInterval).zfill(4)
 	return rec
