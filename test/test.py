import sys
sys.path.append("../")
import dbconf
a = dbconf.Connect()
print(a)
