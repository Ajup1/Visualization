
import pandas as pd
df = pd.read_excel('June-July.xlsx',engine='openpyxl')
# df["date"] == '2020-02-25'

# df[df["date"] == '2020-02-25']

# df[df['date'] >= ('2020-06-05')]
# df.loc[(df["continent"] == "Asia") & (df["date"] == '2020-02-25')]
# df[df["date"] == '2020-06-05']
df_date = (df.loc[(df["date"] == '2021-06-30') & (df["continent"] != ""), [	"location",	"date",	"total_cases",	"new_cases","total_deaths","new_deaths","total_tests",	"total_vaccinations",	"people_vaccinated",	"people_fully_vaccinated",		"population"]])
# sorting date with sort_value() function

# create excel writer object
writer = pd.ExcelWriter('WoorkBook.xlsx')
# write dataframe to excel
df_date.to_excel(writer)
# save the excel
writer.save()

print('DataFrame is written successfully to Excel File.')
