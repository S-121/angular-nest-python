import pandas as pd
import requests
import json
import string
import nltk
# nltk.download('punkt')
from stop_words import get_stop_words
# from google.colab import files
from collections import Counter
from json import loads
import time
from multiprocessing.dummy import Pool as ThreadPool


all_data = []
def get_data(link):
  headers = {'User-agent':'Mozilla/5.0'}
  response = requests.get(link, headers=headers)
  all_data.append(json.loads(response.content.decode('utf-8')))


start_time = time.time()
#language code and keywords
lang_code="en"#@param {type:"string"}
keyword1="dog food" #@param {type:"string"}
keyword2="cat food" #@param {type:"string"}
keyword3="puppy food" #@param {type:"string"}
keyword4="bird food" #@param {type:"string"}
keyword5="animal food" #@param {type:"string"}

# lang_code, keyword1, keyword2, keyword3, keyword4, keyword5 = "en", "dog food", "cat food", "puppy food", "bird food", "animal food"

#generate keyword list
keywords=[keyword1,keyword2,keyword3,keyword4,keyword5]
keywordlist = list(filter(None, keywords))
keywordlist

#Make a list of letters to use for Google Suggest
letterlist=[]
letterlist=letterlist+list(string.ascii_lowercase)

#Google Suggest for each combination of keyword and letter
keywordsuggestions=[]
URL = []
for keyword in keywordlist:
  for letter in letterlist:
    URL.append("http://suggestqueries.google.com/complete/search?client=firefox&hl="+str(lang_code)+"&q="+keyword+" "+letter)

# Make the Pool of workers
pool = ThreadPool(100)
# Open the urls in their own threads
# and return the results
pool.map(get_data, URL)

# close the pool and wait for the work to finish
pool.close()
pool.join()

for keyword in keywordlist:
  for words in all_data:
    keywordsuggest=[keyword]
    for word in words[1]:
      if(word!=keyword):
        keywordsuggest.append(word)
    keywordsuggestions.append(keywordsuggest)

#crearte a dataframe from this list
keywordsuggestions_df = pd.DataFrame(keywordsuggestions)

#Rename columns of dataframe
columnnames=["Keyword","Letter"]
for i in range(1,len(keywordsuggestions_df.columns)-1):
  columnnames.append("Suggestion"+str(i))
keywordsuggestions_df.columns=columnnames

#Make a list of all suggestions
allkeywords = keywordlist
for i in range(1,len(keywordsuggestions_df.columns)-1):
  suggestlist = keywordsuggestions_df["Suggestion"+str(i)].values.tolist()
  for suggestion in suggestlist:
    allkeywords.append(suggestion)

new_allkeywords = []
for allkeyword in allkeywords:
    if allkeyword not in new_allkeywords:
        new_allkeywords.append(allkeyword)

my_data = {
    'country': 'us',
    'currency': 'USD',
    'dataSource': 'gkp',
    'kw[]': new_allkeywords
}
my_headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer fd7d5ee55e3f6fee6f55'
}
response = requests.post('https://api.keywordseverywhere.com/v1/get_keyword_data', data=my_data, headers=my_headers)
if response.status_code == 200:
    print('success\n\n', response.content.decode('utf-8'))
else:
    print("An error occurred\n\n", response.content.decode('utf-8'))

# #exclude stopwords and seed keywords from this list
# stop_words=get_stop_words(lang_code)
# wordlist=[]
# seed_words=[]
# for keyword in keywords:
#   for seed_word in nltk.word_tokenize(str(keyword).lower()):
#     if(len(seed_word)>0):
#       seed_words.append(seed_word)
# for keyword in new_allkeywords:
#   words = nltk.word_tokenize(str(keyword).lower()) 
#   #word tokenizer
#   for word in words:
#     if(word not in stop_words and word not in seed_words and len(word)>1):
#       wordlist.append(word)

# #find the most common words in the suggestions
# most_common_words= [word for word, word_count in Counter(wordlist).most_common(200)]

# #assign each suggestion to a common keyword
# clusters=[]
# for common_word in most_common_words:
#   for keyword in new_allkeywords:
#     if(common_word in str(keyword)):
#       clusters.append([keyword,common_word])
# clusterdf = pd.DataFrame(clusters,columns=['Keyword', 'Cluster'])

# #create dataframe wiht clusters en suggestions
# # clusterdf.to_csv("keywords_clustered.csv")
# # files.download("keywords_clustered.csv")
# # clusterdf