
import spacy
from spacy import displacy
import requests

#spacy.cli.download("en_core_web_trf")

nlp = spacy.load("en_core_web_sm") # en español también es_core_news_sm o md

texto = ""

with open('./ her-2013.txt') as f:
    lines = f.readlines()
    texto = texto+" "+lines

doc = nlp(texto)

sustantivos = []
verbos = []
adjetivos = []
adverbios = []

for token in doc:
  if token.tag_ == "NOUN__Gender=Masc|Number=Sing":
    sustantivos.append(token.text.upper())
  elif token.tag_ == "ADJ__Gender=Masc|Number=Sing":
    adjetivos.append(token.text.upper())
  elif token.pos_ == "ADV":
    adverbios.append(token.text.upper())

print("var sustantivos =", list(set(sustantivos)))
print("var adverbios =", list(set(adverbios)))
print("var adjetivos =", list(set(adjetivos)))

