import re,sys,urllib.request,random,html,concurrent.futures as cf
H={'User-Agent':'Mozilla/5.0'};B='https://www.betranslated.co.uk'
def chk(p):
    b=urllib.request.urlopen(urllib.request.Request(B+'/'+p+'?v=%d'%random.randint(1,10**6),headers=H),timeout=60).read().decode('utf8','ignore')
    m=re.search(r'<div class="et-l et-l--body">([\s\S]*?)<div class="et-l et-l--footer">',b);bd=m.group(1) if m else b
    return p,len(re.findall(r'<h[1-6][^>]*&gt;|&lt;/?h[1-6]|&lt;/?(?:strong|a)\b',bd)),len(re.findall(r'\[/?et_pb_',b)),len(re.findall(r'<h[2-6][^>]*>[\s\S]*?</h[2-6]>',bd))
with cf.ThreadPoolExecutor(8) as ex:
    for p,dam,leak,n in ex.map(chk,sys.argv[1:]): print(('OK  ' if not dam and not leak else 'BAD ')+p,'damaged',dam,'leaks',leak,'headings',n)
