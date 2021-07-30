# import module
import pandas as pd

# Read excel file
# and store into a DataFrame
df1 = pd.read_excel('2021-06-23.xlsx',engine='openpyxl')
df2 = pd.read_excel('2021-06-24.xlsx',engine='openpyxl')
df3 = pd.read_excel('2021-06-25.xlsx',engine='openpyxl')
df4 = pd.read_excel('2021-06-26.xlsx',engine='openpyxl')
df5 = pd.read_excel('2021-06-27.xlsx',engine='openpyxl')
df6 = pd.read_excel('2021-06-28.xlsx',engine='openpyxl')
df7 = pd.read_excel('2021-06-29.xlsx',engine='openpyxl')
df8 = pd.read_excel('2021-06-30.xlsx',engine='openpyxl')
# df9 = pd.read_excel('2020-10-25.xlsx',engine='openpyxl')
# df10 = pd.read_excel('2020-11-25.xlsx',engine='openpyxl')
# df11 = pd.read_excel('2020-12-25.xlsx',engine='openpyxl')
# df12 = pd.read_excel('2021-01-25.xlsx',engine='openpyxl')
# df13 = pd.read_excel('2021-02-25.xlsx',engine='openpyxl')
# df14 = pd.read_excel('2021-03-25.xlsx',engine='openpyxl')
# df15 = pd.read_excel('2021-04-25.xlsx',engine='openpyxl')

# concat both DataFrame into a single DataFrame
df = pd.concat([df1, df2, df3, df4, df5, df6, df7, df8,])

# Export Dataframe into Excel file
df.to_excel('final_output.xlsx', index=False)