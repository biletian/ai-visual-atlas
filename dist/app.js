const $=s=>document.querySelector(s), esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let saved;try{saved=new Set(JSON.parse(localStorage.getItem('visual-atlas-saved')||'[]'))}catch{saved=new Set()}
let visibleLimit=18;let type='all';const cases=window.ATLAS.cases.filter(c=>c.publish_ready), colors=['#dfe6cf','#dedbd0','#e4d6c7','#cddedb','#dde0e3','#e4ddc1'];
const mediaURL=u=>/^assets\/[a-zA-Z0-9_./-]+$/.test(u||'')?u:safeURL(u);
const safeURL=u=>{try{const v=new URL(u);return v.protocol==='https:'?v.href:''}catch{return ''}};
if(window.ATLAS.repository){$('#repo').href=safeURL(window.ATLAS.repository);$('#repo').hidden=false}
for(const v of [...new Set(cases.map(c=>c.model_family||c.model))])$('#model').add(new Option(v,v));
for(const v of [...new Set(cases.map(c=>c.category))])$('#category').add(new Option(v,v));
const mediaDimensions={"sun-moon-toggle.gif":[435,386],"bunny-laughing.gif":[440,389],"hourglass-flip.gif":[379,252],"pixel-campfire.gif":[378,240],"like-heart-burst.gif":[379,246],"ink-wash-horse.gif":[380,252],"cat-by-fireplace.gif":[380,243],"four-seasons-tree.gif":[764,508],"papercut-river-boat.gif":[439,390],"magazine-panels-pop.gif":[438,387],"sourdough-steam.gif":[436,389],"bunny-sleepy.gif":[439,387],"pixel-castle-scroller.gif":[380,336],"lighthouse-night.gif":[380,247],"house-cutaway.gif":[432,395],"city-future-timelapse.gif":[439,385],"cat-waving-hello.gif":[438,390],"black-cat-punch.gif":[437,390],"cat-brand-reel.gif":[380,507],"ice-crystal-bloom.gif":[378,249],"shiba-head-tilt.gif":[439,390],"aurora-cabin.gif":[379,246],"collage-moon-cut.gif":[379,252],"vinyl-turntable.gif":[380,252],"water-spiral-orb.gif":[378,250],"watercolor-street-flipbook.gif":[438,390],"neon-open-sign.gif":[350,358],"jellyfish-glow.gif":[439,389],"cat-typing-laptop.gif":[380,242],"pixel-treasure-chest.gif":[378,252],"sneaker-colorway-flash.gif":[349,883],"lofi-study-loop.gif":[434,383],"product-light-sweep.gif":[379,252],"steaming-coffee.gif":[379,252],"pixel-slime-boss.gif":[375,240],"bouncing-dots-loader.gif":[385,266],"calendar-page-flip.gif":[378,250],"goldfish-bowl.gif":[380,243],"lantern-monkey-snow.gif":[380,241],"pixel-potion-shop.gif":[437,387],"event-title-reveal.gif":[439,388],"flower-macro-flash.gif":[380,508],"penguin-facepalm.gif":[435,389],"origami-crane-takeoff.gif":[437,379],"doodle-monster.gif":[440,386],"basketball-shot-sticker.gif":[380,251],"halftone-fox-poster.gif":[434,387],"jelly-bear-wobble.gif":[438,388],"bookshop-window-snow.gif":[435,385],"cafe-cinemagraph.gif":[439,390],"rain-on-window.gif":[378,252],"lake-ripple-dawn.gif":[380,252],"frog-heart-bubble.gif":[380,252],"cat-chef-fried-rice.gif":[323,295],"pixel-hero-slash.gif":[358,358],"notification-bell-ring.gif":[376,245],"arcade-vs-screen.gif":[376,251],"sleepy-fox-rock.gif":[432,394],"perfume-water-spin.gif":[414,414],"travel-postcard-stack.gif":[436,386],"citrus-bottle-splash.gif":[380,252],"bouncing-ball-squash.gif":[379,243],"love-burst-skill.gif":[369,239],"window-day-to-night.gif":[413,412],"signature-ink-write.gif":[414,414],"storybook-bunny-garden.gif":[431,394],"bunny-thumbs-up.gif":[438,388],"pixel-knight-run.gif":[380,508],"chat-bubbles-pop.gif":[430,397],"paper-airplane-glide.gif":[358,358],"junkyard-robot-walk.gif":[380,252],"risograph-blob-drift.gif":[379,252]};
const searchIndex=new Map(cases.map(c=>[c.id,[c.title,c.author,c.model,c.model_family,c.category,c.prompt,c.description].join(' ').toLowerCase()]));
const icon=(name,fallback='')=>window.AtlasUI?.icon(name)||fallback;
const avatar=c=>window.AtlasUI?.avatar(c)||`<span class="avatar" aria-hidden="true">${esc(c.author.replace('@','')[0].toUpperCase())}</span>`;
const videoURL=c=>mediaURL(c.image_url).replace(/\.gif$/,'.mp4');
const posterURL=c=>mediaURL(c.image_url).replace(/\.gif$/,'.webp');
const isLocal=c=>c.image_url&&c.media_authorized==='cc-by-4.0'&&c.image_url.endsWith('.gif');
let filtered=[],renderedCount=0;
function render(reset=true){
 if(reset)visibleLimit=18;
 let q=$('#search').value.trim().toLowerCase(),m=$('#model').value,cat=$('#category').value;
 filtered=cases.filter(c=>(type==='all'||type==='saved'&&saved.has(c.id)||c.type===type)&&(!m||(c.model_family||c.model)===m)&&(!cat||c.category===cat)&&(!$('#promptOnly').checked||c.prompt||c.prompt_reply_url)&&(!q||searchIndex.get(c.id).includes(q)));
 window.AtlasUI?.syncFilters();$('#count').textContent=filtered.length+' 件作品';$('#savedCount').textContent=saved.size;$('#empty').hidden=!!filtered.length;
 if(reset){pauseGrid();mediaObserver.disconnect();$('#grid').replaceChildren();renderedCount=0}
 const fragment=document.createDocumentFragment();
 for(const c of filtered.slice(renderedCount,visibleLimit)){
  const article=document.createElement('article');article.className='work';article.dataset.caseId=c.id;
  article.innerHTML=`<div class="media-wrap"><div class="model-tag">${esc(c.model_family||c.model)}</div>${isLocal(c)?`<div class="media-stage" style="aspect-ratio:${(mediaDimensions[c.image_url.split('/').pop()]||[1,1]).join('/')}"><img class="work-image" src="${esc(posterURL(c))}" alt="${esc(c.title)}" loading="lazy" decoding="async"><button class="media-play" data-play="${esc(c.id)}" aria-label="播放 ${esc(c.title)}">${icon('play','▶')}<span>播放</span></button></div>`:`<div class="tweet-shell"><button class="load-tweet" data-tweet="${esc(c.id)}">${icon('play','▶')}<span>加载 X 作品</span></button><a class="source-fallback" href="${esc(safeURL(c.source_url))}" target="_blank" rel="noopener">在 X 查看原作 ↗</a></div>`}</div><div class="card-footer">${avatar(c)}<div class="card-text"><button class="detail-link" data-open="${esc(c.id)}"><h2>${esc(c.title)}</h2></button><a href="${esc(safeURL(c.source_url))}" target="_blank" rel="noopener">${esc(c.author)}</a></div><button class="card-action" data-open="${esc(c.id)}" aria-label="查看 ${esc(c.title)} 的${c.prompt||c.prompt_reply_url?'提示词':'详情'}">${icon('arrow-up-right','↗')}</button></div>`;
  fragment.append(article);
 }
 $('#grid').append(fragment);renderedCount=Math.min(visibleLimit,filtered.length);
 $('#loadMore').hidden=filtered.length<=visibleLimit;$('#loadMore').textContent='加载更多作品（'+Math.max(0,filtered.length-visibleLimit)+'）';
}
function pauseGrid(){document.querySelectorAll('#grid video').forEach(v=>{v.pause();const b=v.parentElement.querySelector('[data-play]');if(b){b.hidden=false;b.setAttribute('aria-label','继续播放')}})}
const mediaObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting){e.target.pause();const b=e.target.parentElement.querySelector('[data-play]');if(b)b.hidden=false}}),{threshold:.05});
function playCard(id){const c=cases.find(c=>c.id===id),stage=document.querySelector(`[data-case-id="${id}"] .media-stage`);if(!stage)return;pauseGrid();let v=stage.querySelector('video');if(!v){v=document.createElement('video');v.className='work-video';v.src=videoURL(c);v.poster=posterURL(c);v.muted=true;v.loop=true;v.playsInline=true;v.controls=true;v.preload='none';stage.querySelector('img').hidden=true;stage.prepend(v);mediaObserver.observe(v)}v.play().then(()=>stage.querySelector('[data-play]').hidden=true).catch(()=>toast('请点击播放器播放'));}
let twitterPromise;
function withTimeout(promise,ms=12000){return new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('X timeout')),ms);Promise.resolve(promise).then(v=>{clearTimeout(timer);resolve(v)},e=>{clearTimeout(timer);reject(e)})})}
function ensureTwitter(){if(window.twttr?.widgets)return Promise.resolve(window.twttr);if(twitterPromise)return twitterPromise;const script=document.createElement('script');script.src='https://platform.twitter.com/widgets.js';script.async=true;twitterPromise=withTimeout(new Promise((resolve,reject)=>{script.onload=()=>window.twttr?.ready(t=>resolve(t));script.onerror=()=>reject(new Error('X unavailable'));document.head.append(script)})).catch(e=>{twitterPromise=null;script.remove();throw e});return twitterPromise}
async function loadTweet(id,target){
 const c=cases.find(c=>c.id===id),shell=target||document.querySelector('[data-case-id="'+id+'"] .tweet-shell');
 if(!c||!shell)return;const button=shell.querySelector('.load-tweet');if(!button||button.disabled)return;
 button.disabled=true;button.textContent='正在加载…';
 shell.querySelector('.tweet-host')?.remove();const host=document.createElement('div');host.className='tweet-host';shell.prepend(host);
 const status=shell.querySelector('.tweet-status');if(status)status.textContent='正在连接 X 官方作品…';
 try{const t=await ensureTwitter();if(!shell.isConnected)return;const tweetID=c.source_url.match(/status\/(\d+)/)?.[1];if(!tweetID)throw Error('Invalid post');const result=await withTimeout(t.widgets.createTweet(tweetID,host,{dnt:true,conversation:'none'}));if(!result)throw Error('Unavailable post');if(!shell.isConnected)return;button.remove();if(status)status.remove()}
 catch{host.remove();if(!shell.isConnected)return;button.disabled=false;button.textContent='重试加载 X 作品';if(status)status.textContent='X 作品暂时无法加载，请重试或打开原帖。';toast('X 暂时无法加载，可以打开原帖')}
}
function xDetail(c){return '<div class="tweet-shell detail-tweet"><p class="tweet-status" role="status">通过 X 官方嵌入查看原作</p><button class="load-tweet">加载 X 作品</button><a class="source-fallback" href="'+esc(safeURL(c.source_url))+'" target="_blank" rel="noopener">在 X 查看原作 ↗</a></div>'}
function show(id){const c=cases.find(x=>x.id===id);if(!c)return;let via=c.attribution.match(/https:\/\/\S+/)?.[0];pauseGrid();$('#detailBody').innerHTML=`<div class="detail-layout"><div class="detail-media">${isLocal(c)?`<video class="thumb-detail" src="${esc(videoURL(c))}" poster="${esc(posterURL(c))}" controls playsinline loop preload="metadata"></video>`:xDetail(c)}</div><div class="detail-info"><div class="detail-category">${esc(c.category)}</div><h2 class="detail-title">${esc(c.title)}</h2><div class="detail-author">${avatar(c)}<span>${esc(c.author)}</span></div><p class="detail-model">${esc(c.model)}</p><p>${esc(c.description)}</p>${c.prompt_reply_url?`<a class="button button--primary" target="_blank" rel="noopener" href="${esc(c.prompt_reply_url)}">查看作者提示词原文 ↗</a>`:''}<h3>提示词 ${c.prompt?(c.prompt_license?'· 原文':'· 摘录'):''}</h3>${c.prompt?`<pre>${esc(c.prompt)}</pre><button class="copy" id="copyPrompt">${icon('copy')}${c.prompt_license?'复制提示词':'复制摘录'}</button><p>${esc(c.prompt_status)}</p>`:`<p>${esc(c.prompt_status||'作者尚未公开提示词。')}</p>`}<h3>来源记录</h3><p>${esc(c.attribution)}</p><a target="_blank" rel="noopener" href="${esc(safeURL(c.source_url))}">${c.source_kind==='github'?'查看 GitHub 来源 ↗':'查看 X 原帖 ↗'}</a>${via?`<a target="_blank" rel="noopener" href="${esc(safeURL(via))}">查看发现来源 ↗</a>`:''}<h3>素材说明</h3><p>${esc(c.license)}</p><p>核查日期：${esc(c.checked_at)}。${c.source_kind==='github'?'素材按原仓库许可展示；本站将 GIF 转为 MP4 并提取静态封面以优化加载，未重绘；标题沿用原仓库中文版本。':'原帖媒体由 X 官方提供；本站未重绘或替换生成结果。'}</p></div></div>`;$('#detailBody').insertAdjacentHTML('afterbegin',`<div class="detail-actions"><button class="save" id="detailSave">${icon('bookmark')}${saved.has(c.id)?'已收藏':'收藏'}</button></div>`);$('#detailSave').onclick=()=>{saved.has(c.id)?saved.delete(c.id):saved.add(c.id);try{localStorage.setItem('visual-atlas-saved',JSON.stringify([...saved]))}catch{}$('#detailSave').innerHTML=icon('bookmark')+(saved.has(c.id)?'已收藏':'收藏');$('#savedCount').textContent=saved.size;if(type==='saved')render()};$('#detail').showModal();const xShell=$('#detailBody').querySelector('.detail-tweet');if(xShell)xShell.querySelector('.load-tweet').onclick=()=>loadTweet(c.id,xShell);if(c.prompt)$('#copyPrompt').onclick=async()=>{try{await navigator.clipboard.writeText(c.prompt);toast(c.prompt_license?'已复制提示词':'已复制提示词摘录')}catch{toast('复制失败，请长按选择文字复制')}}}
function toast(t){$('#toast').textContent=t;$('#toast').style.opacity=1;setTimeout(()=>$('#toast').style.opacity=0,2500)}
$('#grid').onclick=e=>{let b=e.target.closest('[data-play]');if(b){playCard(b.dataset.play);return}b=e.target.closest('[data-tweet]');if(b){loadTweet(b.dataset.tweet);return}b=e.target.closest('[data-open]');if(b)show(b.dataset.open);b=e.target.closest('[data-save]');if(b){saved.has(b.dataset.save)?saved.delete(b.dataset.save):saved.add(b.dataset.save);try{localStorage.setItem('visual-atlas-saved',JSON.stringify([...saved]))}catch{toast('浏览器禁止存储，收藏仅在本次浏览有效')}render()}};
$('.types').onclick=e=>{const b=e.target.closest('[data-type]');if(!b)return;type=b.dataset.type;document.querySelectorAll('[data-type]').forEach(x=>x.classList.toggle('selected',x===b));render()};
let searchTimer;$('#search').addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>render(),180)});['#model','#category','#promptOnly'].forEach(s=>$(s).addEventListener('change',()=>render()));$('#detail').addEventListener('close',()=>{$('#detailBody').querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load()});$('#detailBody').replaceChildren()});document.addEventListener('visibilitychange',()=>{if(document.hidden){pauseGrid();$('#detailBody').querySelectorAll('video').forEach(v=>v.pause())}});$('.close').onclick=()=>$('#detail').close();$('#detail').onclick=e=>{if(e.target===$('#detail'))$('#detail').close()};$('#reset').onclick=()=>{$('#search').value='';$('#model').value='';$('#category').value='';$('#promptOnly').checked=false;type='all';document.querySelectorAll('[data-type]').forEach(x=>x.classList.toggle('selected',x.dataset.type==='all'));render()};render();

$('#aboutButton').onclick=()=>{$('#detailBody').innerHTML='<h2 class="detail-title">作品属于创作者。</h2><p>这里收集有出处的 AI 图像与视频作品。点击作品，可查看原作者、模型信息与已公开的提示词。</p><p>作品使用作者明确授权的素材或 X 官方嵌入。X 媒体可能受网络限制。暂未核实的线索不公开展示；没有公开的提示词不以推测补齐。</p><p>收藏保存在你的浏览器。媒体与提示词权利归原作者，收录不代表可以自由商用。</p>';$('#detail').showModal()};

$('#totalCount').textContent=cases.length;
for(const v of [...new Set(cases.map(c=>c.model_family||c.model))]){const b=document.createElement('button');b.dataset.model=v;b.innerHTML=icon(window.AtlasUI.navIcon(v))+`<span class="nav-label">${esc(v==='ChatGPT Images 2.6'?'Images 2.6':v)}</span>`;b.onclick=()=>{$('#model').value=$('#model').value===v?'':v;render()};$('#modelLinks').append(b)}
for(const v of [...new Set(cases.map(c=>c.category))]){const b=document.createElement('button');b.dataset.category=v;b.innerHTML=icon(window.AtlasUI.navIcon(v))+`<span class="nav-label">${esc(v)}</span>`;b.onclick=()=>{$('#category').value=$('#category').value===v?'':v;render()};$('#categoryLinks').append(b)}
$('#allFilter').onclick=()=>$('#reset').click();
$('#savedShortcut').onclick=()=>document.querySelector('[data-type="saved"]').click();
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#search').focus()}});

$('#loadMore').onclick=()=>{visibleLimit+=18;render(false)};

// Optional detail deep links and continuous browsing; append after base app initialization.
(()=>{
 const baseShow=show, dialog=$('#detail');
 let currentID=null, pushedEntry=false, syncing=false, savedScroll=0;
 const idFromURL=()=>{try{return new URLSearchParams(location.hash.slice(1)).get('work')}catch{return null}};
 const urlFor=id=>`${location.pathname}${location.search}${id?'#work='+encodeURIComponent(id):''}`;
 function navigation(id){
  const list=(filtered.length?filtered:cases),index=list.findIndex(c=>c.id===id);
  const nav=document.createElement('nav');nav.className='detail-navigation';nav.setAttribute('aria-label','浏览作品');
  nav.innerHTML=`<button class="detail-prev" aria-label="上一件作品" ${index<=0?'disabled':''}>${icon('arrow-left','←')}<span>上一件</span></button><span>${index>=0?index+1:'—'} / ${list.length}</span><button class="detail-next" aria-label="下一件作品" ${index<0||index>=list.length-1?'disabled':''}><span>下一件</span>${icon('arrow-right','→')}</button>`;
  $('#detailBody').prepend(nav);
  const move=delta=>{const next=list[index+delta];if(!next)return;history.replaceState(history.state,'',urlFor(next.id));syncing=true;show(next.id);syncing=false;dialog.scrollTop=0};
  nav.querySelector('.detail-prev').onclick=()=>move(-1);nav.querySelector('.detail-next').onclick=()=>move(1);
 }
 show=function(id){
  if(!cases.some(c=>c.id===id))return;
  const wasOpen=dialog.open;
  if(!wasOpen)savedScroll=window.scrollY;
  // Pause/detach the previous detail player before changing cases.
  $('#detailBody').querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load()});
  baseShow(id);currentID=id;navigation(id);
  if(!syncing&&idFromURL()!==id){
   if(!wasOpen){history.pushState({...history.state,atlasDetail:true},'',urlFor(id));pushedEntry=true}
   else history.replaceState(history.state,'',urlFor(id));
  }
 };
 dialog.addEventListener('close',()=>{
  currentID=null;
  if(!syncing&&idFromURL()){
   if(pushedEntry){pushedEntry=false;history.back()}
   else history.replaceState(history.state,'',urlFor(null));
  }
  requestAnimationFrame(()=>window.scrollTo({top:savedScroll,behavior:'instant'}));
 });
 function sync(){
  const id=idFromURL();syncing=true;
  if(id&&cases.some(c=>c.id===id)){if(currentID!==id)show(id)}
  else if(dialog.open&&currentID){pushedEntry=false;dialog.close()}
  syncing=false;
 }
 window.addEventListener('popstate',sync);
 window.addEventListener('hashchange',sync);
 if(idFromURL())sync();
})();
