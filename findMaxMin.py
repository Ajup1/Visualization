import csv

mydelimeter = csv.excel()
mydelimeter.delimiter=";"
myfile = open("htdocs/Covid-19_Visualization-Month/final_output(24-06-2021).csv")
myfile.readline()
myreader=csv.reader(myfile,mydelimeter)
mywind,mydate=[],[]
minTemp, maxTemp = [],[]

for row in myreader:
  #  print(row[1],row[2])
    try:
        minTemp.append(float(row[1]))
        maxTemp.append(float(row[2]))
    except ValueError:
        print ("error","on line",row)

print ("min value element : ", min(minTemp))
print ("max value element : ", max(maxTemp))