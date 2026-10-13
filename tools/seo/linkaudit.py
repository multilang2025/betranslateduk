import re,json,sys,urllib.request,urllib.error,urllib.parse,html,collections,concurrent.futures as cf,ssl,time
UA={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36','Accept':'text/html,*/*'}
ctx=ssl.create_default_context()
B='https://www.betranslated.co.uk'
def fetch(u,t=40):
    try:
        r=urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=t,context=ctx);return r.status,r.read().decode('utf8','ignore')
    except urllib.error.HTTPError as e: return e.code,''
    except Exception as e: return 0,str(e)
urls=[]
for sm in ['post','page','local']:
    s,b=fetch(f'{B}/{sm}-sitemap.xml'); urls+=[u for u in re.findall(r'<loc>([^<]+)</loc>',b) if u.endswith('/')]
print('pages',len(urls),file=sys.stderr)
def extract(u):
    s,b=fetch(u)
    if s!=200: return u,s,[],[]
    a=[];im=[]
    for m in re.finditer(r'<a\b[^>]*?href=["\']([^"\']+)["\'][^>]*>([\s\S]*?)</a>',b,re.I):
        h=html.unescape(m.group(1)).strip();txt=re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>','',m.group(2)))).strip()[:60]
        if re.match(r'(mailto:|tel:|javascript:|#|sms:|whatsapp:|https?://wa\.me)',h,re.I): continue
        a.append((urllib.parse.urljoin(u,h).split('#')[0],txt))
    for m in re.finditer(r'<img\b[^>]*?\bsrc=["\']([^"\']+)["\']',b,re.I):
        h=html.unescape(m.group(1)).strip()
        if h.startswith('data:'): continue
        im.append(urllib.parse.urljoin(u,h))
    return u,200,a,im
with cf.ThreadPoolExecutor(12) as ex: P=list(ex.map(extract,urls))
alinks=collections.defaultdict(set); imgs=collections.defaultdict(set)
for u,s,a,im in P:
    for h,t in a: alinks[h].add((u,t))
    for h in im: imgs[h].add(u)
print('unique links',len(alinks),'imgs',len(imgs),file=sys.stderr)
def check(h):
    t0=time.time();last=None
    for meth in ('HEAD','GET'):
        try:
            class NoR(urllib.request.HTTPRedirectHandler):
                def redirect_request(self,*a,**k): return None
            op=urllib.request.build_opener(NoR,urllib.request.HTTPSHandler(context=ctx))
            req=urllib.request.Request(h,headers=UA,method=meth)
            try:
                r=op.open(req,timeout=25);code=r.status;loc=''
            except urllib.error.HTTPError as e:
                code=e.code;loc=e.headers.get('Location','')
            if code in (405,501) and meth=='HEAD': continue
            return h,code,loc
        except Exception as e: last=str(e)[:60]
    return h,0,last
targets=list(alinks)+[i for i in imgs if i not in alinks]
with cf.ThreadPoolExecutor(16) as ex: R=list(ex.map(check,targets))
json.dump({'pages':[(u,s) for u,s,_,_ in P],'links':{h:sorted(map(list,v)) for h,v in alinks.items()},'imgs':{h:sorted(v) for h,v in imgs.items()},'res':R},open('linkaudit.json','w'))
print('done',len(R))
