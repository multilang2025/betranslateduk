import re,json,html,urllib.request,concurrent.futures as cf,collections,sys
H={'User-Agent':'Mozilla/5.0'}
B='https://www.betranslated.co.uk'
pages=[x['url'] for x in json.load(open('crawl.json')) if x['status']==200 and x['url'].endswith('/')]
def body(b):
    m=re.search(r'<div class="et-l et-l--body">([\s\S]*?)<div class="et-l et-l--footer">',b)
    if m: return m.group(1)
    m=re.search(r'<article[\s\S]*?</article>',b)
    return m.group(0) if m else b
def txt(h): return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',re.sub(r'<(script|style|svg|noscript)[\s\S]*?</\1>','',h)))).strip()
SMALL={'a','an','the','and','or','but','of','in','on','at','to','for','with','by','from','as','vs','is','are','be','your','you','how','what','why','do','does','can'}
US=re.compile(r'\b(\w*iz(?:e|es|ed|ing|ation|ations)|color\w*|favor\w*|center(?:s|ed)?|organiz\w*|analyz\w*|behavior\w*|neighbor\w*|defense|catalog(?:ue)?|traveler\w*|judgment|labor|program(?!me)\b)\b',re.I)
OKUS={'size','sizes','sized','prize','seize','resize','maize','sizing','citizen','capsize','organize'}
def one(u):
    try: b=urllib.request.urlopen(urllib.request.Request(u,headers=H),timeout=60).read().decode('utf8','ignore')
    except Exception: return None
    bd=body(b);t=txt(bd);d={'url':u}
    hs=[(lvl,txt(h)) for lvl,h in re.findall(r'<h([1-6])[^>]*>([\s\S]*?)</h\1>',bd,re.I)]
    d['dash']=len(re.findall('[\u2013\u2014]',t))
    d['banned']=[p for p in ['break language barriers','breaking language barriers','break down language barriers','the importance of','this guide','Twitter','drum'] if re.search(re.escape(p),t,re.I)]
    d['by_ing']=len(re.findall(r'(?<![\w,])By \w+ing\b',t))
    d['numhead']=[h for l,h in hs if l!='1' and re.match(r'^\d+[\.\)]\s|^\d+\s',h)]
    tc=[]
    for l,h in hs:
        if l in '23456':
            w=[x for x in re.findall(r"[A-Za-z][A-Za-z'&-]*",h)]
            if len(w)>=3:
                caps=sum(1 for x in w[1:] if x[0].isupper() and x.lower() not in SMALL)
                if caps>=max(2,0.6*len(w[1:])): tc.append(h)
    d['titlecase']=tc
    d['us']=[w for w in US.findall(t) if w.lower() not in OKUS and not w.lower().endswith(('size','sizes','sized'))]
    d['i_first']=len(re.findall(r"\bI(?:'m|'ve|'ll)?\b(?! love| am a)",re.sub(r'\bI\.T\.|\bI T\b','',t)))
    d['html_bad']=len(re.findall(r'<hr\b|<section\b',bd,re.I))
    yrs=[(m.group(0),t[max(0,m.start()-45):m.end()+35]) for m in re.finditer(r'\b(20(?:1\d|2[0-6]))\b',t)]
    d['years']=yrs[:12]
    d['rel']=len(re.findall(r'\b(this year|last year|next year|currently|at the moment|recently|nowadays|these days|to date)\b',t,re.I))
    d['words']=len(t.split())
    return d
with cf.ThreadPoolExecutor(12) as ex: R=[r for r in ex.map(one,pages) if r]
json.dump(R,open('style.json','w'))
print('done',len(R))
