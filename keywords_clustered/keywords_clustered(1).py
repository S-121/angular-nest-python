import pandas as pd
import requests
import json
import time
import string
import nltk
# nltk.download('punkt')
from stop_words import get_stop_words
# from google.colab import files
from collections import Counter
from json import loads


#language code and keywords
lang_code="en"#@param {type:"string"}
keyword1="dog food" #@param {type:"string"}
keyword2="cat food" #@param {type:"string"}
keyword3="puppy food" #@param {type:"string"}
keyword4="bird food" #@param {type:"string"}
keyword5="animal food" #@param {type:"string"}

#generate keyword list
keywords=[keyword1,keyword2,keyword3,keyword4,keyword5]
keywordlist = list(filter(None, keywords))
keywordlist

#Make a list of letters to use for Google Suggest
letterlist=[""]
letterlist=letterlist+list(string.ascii_lowercase)

#Google Suggest for each combination of keyword and letter
keywordsuggestions=[]
for keyword in keywordlist: 
  for letter in letterlist :
    URL="http://suggestqueries.google.com/complete/search?client=firefox&hl="+str(lang_code)+"&q="+keyword+" "+letter
    headers = {'User-agent':'Mozilla/5.0'} 
    response = requests.get(URL, headers=headers) 
    result = json.loads(response.content.decode('utf-8'))
    keywordsuggest=[keyword]
    for word in result[1]:
      if(word!=keyword):
        keywordsuggest.append(word)
    keywordsuggestions.append(keywordsuggest)

print(result)
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

#exclude stopwords and seed keywords from this list
stop_words=get_stop_words(lang_code)
wordlist=[]
seed_words=[]
for keyword in keywords:
   for seed_word in nltk.word_tokenize(str(keyword).lower()):
     if(len(seed_word)>0):
       seed_words.append(seed_word)
for keyword in allkeywords:
   words = nltk.word_tokenize(str(keyword).lower()) 
   #word tokenizer
   for word in words:
     if(word not in stop_words and word not in seed_words and len(word)>1):
      wordlist.append(word)

#find the most common words in the suggestions
most_common_words= [word for word, word_count in Counter(wordlist).most_common(200)]

#assign each suggestion to a common keyword
clusters=[]
for common_word in most_common_words:
    for keyword in allkeywords:
      if(common_word in str(keyword)):
         clusters.append([keyword,common_word])
clusterdf = pd.DataFrame(clusters,columns=['Keyword', 'Cluster'])

#create dataframe wiht clusters en suggestions
clusterdf.to_csv("keywords_clustered.csv")
# files.download("keywords_clustered.csv")
clusterdf