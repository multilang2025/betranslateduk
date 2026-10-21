import re, json, sys, urllib.request, urllib.error, concurrent.futures as cf, html
UA={'User-Agent':'Mozilla/5.0 (compatible; BTUKAudit/1.0)'}
def get(u,t=25):
    try:
        r=urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=t)
        return r.status,r.read().decode('utf8','ignore'),r.geturl()
    except urllib.error.HTTPError as e: return e.code,'',u
    except Exception as e: return 0,str(e),u
base='https://www.betranslated.co.uk/'
urls=[]
for sm in ['post','page','local']:
    s,b,_=get(base+sm+'-sitemap.xml')
    urls+= [(sm,u) for u in re.findall(r'<loc>([^<]+)</loc>',b)]
print('sitemap urls',len(urls),file=sys.stderr)
def a(x):
    sm,u=x
    s,b,fu=get(u)
    d={'type':sm,'url':u,'status':s,'final':fu if fu!=u else ''}
    if s==200:
        m=re.search(r'<title[^>]*>(.*?)</title>',b,re.S); d['title']=html.unescape(m.group(1).strip()) if m else ''
        m=re.search(r'<meta[^>]+name=["\']description["\'][^>]*content=["\']([^"\']*)',b,re.I); d['desc']=html.unescape(m.group(1).strip()) if m else ''
        d['h1']=len(re.findall(r'<h1[\s>]',b,re.I))
        m=re.search(r'<link[^>]+rel=["\']canonical["\'][^>]*href=["\']([^"\']*)',b,re.I); d['canon']=m.group(1) if m else ''
        d['robots']=(re.search(r'<meta[^>]+name=["\']robots["\'][^>]*content=["\']([^"\']*)',b,re.I) or [None,''])[1]
        imgs=re.findall(r'<img\b[^>]*>',b,re.I)
        d['img_noalt']=sum(1 for i in imgs if not re.search(r'alt=["\'][^"\']+["\']',i,re.I))
        d['ld']=sorted(set(re.findall(r'"@type"\s*:\s*"([A-Za-z]+)"',b)))
        d['words']=len(re.sub(r'<[^>]+>',' ',re.sub(r'<(script|style)[\s\S]*?</\1>','',b)).split())
        d['hreflang']=len(re.findall(r'hreflang=',b))
        d['us']=len(re.findall(r'\b(optimi[zs]e|localiz|organiz|color\b|favor\b|center\b)',b,re.I))
        d['dash']=len(re.findall('[\u2013\u2014]',re.sub(r'<(script|style|head)[\s\S]*?</\1>','',b)))
    return d
with cf.ThreadPoolExecutor(12) as ex: res=list(ex.map(a,urls))
json.dump(res,open('crawl.json','w'))
print('done',len(res))
