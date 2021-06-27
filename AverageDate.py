 from datetime import datetime

date_rng = pd.date_range(start='1/1/2018', end='3/05/2018', freq='W')
df = pd.DataFrame(date_rng, columns=['date'])
df['Sentiment']=np.random.randint(0,100,size=(len(date_rng)))