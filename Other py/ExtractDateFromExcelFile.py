
import pandas as pd
df = pd.read_excel('full_date.xlsx',engine='openpyxl')
# df["date"] == '2020-02-25'

# df[df["date"] == '2020-02-25']

# df[df['date'] >= ('2020-06-05')]
# df.loc[(df["continent"] == "Asia") & (df["date"] == '2020-02-25')]
# df[df["date"] == '2020-06-05']
df_date = (df.loc[(df["date"] == '2021-01-01') & (df["continent"] != ""), ["iso_code",	"continent",	"location",	"date",	"total_cases",	"new_cases","new_cases_smoothed","total_deaths","new_deaths","new_deaths_smoothed",	"total_cases_per_million",	"new_cases_per_million",	"new_cases_smoothed_per_million",	"total_deaths_per_million",	"new_deaths_per_million",	"new_deaths_smoothed_per_million",	"reproduction_rate",	"icu_patients",	"icu_patients_per_million",	"hosp_patients",	"hosp_patients_per_million",	"weekly_icu_admissions",	"weekly_icu_admissions_per_million",	"weekly_hosp_admissions",	"weekly_hosp_admissions_per_million",	"new_tests",	"total_tests",	"total_tests_per_thousand",	"new_tests_per_thousand",	"new_tests_smoothed",	"new_tests_smoothed_per_thousand",	"positive_rate",	"tests_per_case",	"tests_units",	"total_vaccinations",	"people_vaccinated",	"people_fully_vaccinated",	"new_vaccinations",	"new_vaccinations_smoothed",	"total_vaccinations_per_hundred",	"people_vaccinated_per_hundred",	"people_fully_vaccinated_per_hundred",	"new_vaccinations_smoothed_per_million",	"stringency_index",	"population",	"population_density",	"median_age",	"aged_65_older",	"aged_70_older",	"gdp_per_capita",	"extreme_poverty",	"cardiovasc_death_rate",	"diabetes_prevalence",	"female_smokers",	"male_smokers",	"life_expectancy",	"human_development_index"]])
# sorting date with sort_value() function

# create excel writer object
writer = pd.ExcelWriter('WoorkBook.xlsx')
# write dataframe to excel
df_date.to_excel(writer)
# save the excel
writer.save()

print('DataFrame is written successfully to Excel File.')
