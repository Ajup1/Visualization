import pandas as pa

df = pa.read_csv('E:/Excelfiles/abc.csv')
cSum = df['Column C'].sum()
dSum = df['Column D'].sum()
d4 = df['Column D'].iloc[3]
c4 = df['Column C'].iloc[3]
