'use strict';
document.documentElement.classList.add('js');

// Titles and project questions are based on the official 13 problem subjects page.
// https://basaksehirlivinglab.com/13-x-13-problem-konu-basliklari
const PROBLEMS = [
  {number:1, title:'Afetlere Dayanıklı Kentler ve Acil Durum Yönetimi', question:'Afet öncesi hazırlığı güçlendiren, afet sırasında hızlı ve koordineli müdahale sağlayan, afet sonrasındaki iyileşme sürecini kolaylaştıran nasıl bir çözüm geliştirilebilir?'},
  {number:2, title:'Akıllı Ulaşım, Erişilebilirlik ve Kent Düzeni', question:'Ulaşım sürelerini azaltan, güvenliği artıran ve herkes için erişilebilir, düzenli ve sürdürülebilir kent içi hareketlilik nasıl sağlanabilir?'},
  {number:3, title:'İklim Değişikliğine Uyum ve Çevresel Sürdürülebilirlik', question:'İklim değişikliğinin çevresel, ekonomik ve toplumsal etkilerini azaltacak, doğayı koruyacak ve yaşam alanlarını daha dayanıklı hâle getirecek nasıl bir çözüm geliştirilebilir?'},
  {number:4, title:'Geleceğin Kültür, Sanat ve Turizm Deneyimleri', question:'Kültürel mirası ve sanatsal üretimi görünür kılarak yerel kimliği güçlendiren, erişilebilir ve sürdürülebilir deneyimler sunan yenilikçi bir çözüm nasıl geliştirilebilir?'},
  {number:5, title:'Geri Dönüşüm ve Atık Yönetimi', question:'Atık oluşumunu azaltan, ayrıştırmayı kolaylaştıran ve atıkları yeniden kullanılabilir bir kaynağa dönüştüren nasıl bir sistem geliştirilebilir?'},
  {number:6, title:'Sürdürülebilir Gıda Sistemleri ve Akıllı Tarım', question:'Gıdanın üretimden tüketiciye ulaşmasına kadar geçen süreci daha güvenli, verimli, izlenebilir ve sürdürülebilir hâle getirecek nasıl bir çözüm geliştirilebilir?'},
  {number:7, title:'Sağlık, Spor ve İyi Yaşam-Oluş', question:'Bireylerin fiziksel, zihinsel ve sosyal iyilik hâlini destekleyen, sağlıklı yaşam alışkanlıklarını güçlendiren nasıl bir çözüm geliştirilebilir?'},
  {number:8, title:'Su Yönetimi, Enerji Verimliliği ve Yenilenebilir Enerji', question:'Su ve enerji tüketimini azaltan, kayıpları erken tespit eden ve yenilenebilir enerji kullanımını yaygınlaştıran nasıl bir çözüm geliştirilebilir?'},
  {number:9, title:'Eğitim, Gençlik, Beceri Gelişimi ve İstihdam', question:'Gençlerin yeteneklerini keşfetmesini, güncel beceriler kazanmasını ve eğitimden istihdama geçişini kolaylaştıracak nasıl bir çözüm geliştirilebilir?'},
  {number:10, title:'Bilim, İleri Teknolojiler ve Uzay Uygulamaları', question:'Bilimsel bilgi ve ileri teknolojiler kullanılarak toplumsal, çevresel veya endüstriyel bir soruna nasıl yenilikçi ve uygulanabilir bir çözüm geliştirilebilir?'},
  {number:11, title:'Sosyal İnovasyon ve Toplumsal Yaşam', question:'Toplumsal dayanışmayı güçlendiren, fırsat eşitsizliklerini azaltan ve kapsayıcı yaşam alanları oluşturan nasıl bir sosyal çözüm geliştirilebilir?'},
  {number:12, title:'Dijital Dönüşüm, Yapay Zekâ ve Siber Güvenlik', question:'Yapay zekâ ve dijital teknolojiler kullanılarak hizmetleri daha hızlı, güvenli, erişilebilir ve verimli hâle getirecek nasıl bir çözüm geliştirilebilir?'},
  {number:13, title:'Finansal Teknolojiler ve Yenilikçi Ekonomi', question:'Finansal işlemleri daha güvenli, erişilebilir ve verimli hâle getiren; bireylerin ve işletmelerin ekonomik kararlarını iyileştiren nasıl bir çözüm geliştirilebilir?'}
];
const OFFICIAL_APPLY = 'https://bllkulucka.basaksehirlivinglab.org/e/basaksehir-living-lab-13-13-inovasyon-yarismasi-basvurusu';
const AWARDS={
  gencler:[150000,100000,50000],
  arastirmacilar:[210000,120000,70000],
  kurumlar:[270000,140000,90000],
  startuplar:[240000,130000,80000],
  genel:[180000,110000,60000]
};
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const numberTR=new Intl.NumberFormat('tr-TR');
const normalize=s=>s.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');

// Problem discovery, search and an accessible native dialog.
const grid=$('#problemGrid');
const problemSearch=$('#problemSearch');
const resultCount=$('#resultCount');
const showAllWrap=$('#showAllWrap');
const showAllBtn=$('#showAllProblems');
const modal=$('#problemDialog');
const featured=[2,5,4,1,12,10];
let showAll=false;
let dialogTrigger=null;
function renderProblems(){
  const term=normalize(problemSearch.value.trim());
  const source=term?PROBLEMS.filter(p=>normalize(`${p.title} ${p.question}`).includes(term)):(showAll?PROBLEMS:featured.map(n=>PROBLEMS.find(p=>p.number===n)));
  grid.innerHTML='';
  if(!source.length){
    const empty=document.createElement('p');empty.className='empty-results';empty.textContent='Aradığınız ifadeye uygun problem alanı bulunamadı.';grid.appendChild(empty);
  }
  for(const p of source){
    const btn=document.createElement('button');
    btn.type='button';btn.className='problem-card';btn.dataset.number=String(p.number);
    btn.setAttribute('aria-label',`${p.number}. problem: ${p.title} — detayları aç`);
    const num=document.createElement('span');num.className='problem-number';num.textContent=String(p.number).padStart(2,'0');
    const title=document.createElement('h3');title.textContent=p.title;
    const bottom=document.createElement('span');bottom.className='problem-bottom';
    const tag=document.createElement('span');tag.textContent='PROJE SORUSUNU GÖR';
    const arrow=document.createElement('span');arrow.className='card-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');
    bottom.append(tag,arrow);btn.append(num,title,bottom);
    btn.addEventListener('click',()=>openProblem(p,btn));grid.appendChild(btn);
  }
  resultCount.textContent=term?`${source.length} sonuç`:`${PROBLEMS.length} alan`;
  showAllWrap.hidden=Boolean(term);
  showAllBtn.textContent=showAll?'Öne çıkan alanları göster  ↗':'Tüm 13 alanı göster  ↘';
}
function openProblem(problem,trigger){
  dialogTrigger=trigger;
  $('#dialogNumber').textContent=`PROBLEM / ${String(problem.number).padStart(2,'0')}`;
  $('#dialogTitle').textContent=problem.title;
  $('#dialogQuestion').textContent=problem.question;
  if(typeof modal.showModal==='function'){
    modal.showModal();document.body.classList.add('dialog-open');
  }else{
    // Graceful fallback for older browsers.
    window.open('https://basaksehirlivinglab.com/13-x-13-problem-konu-basliklari','_blank','noopener,noreferrer');
  }
}
problemSearch.addEventListener('input',renderProblems);
showAllBtn.addEventListener('click',()=>{showAll=!showAll;renderProblems();if(!showAll)grid.scrollIntoView({block:'start',behavior:'smooth'});});
$('#dialogClose').addEventListener('click',()=>modal.close());
modal.addEventListener('click',e=>{if(e.target===modal)modal.close();});
modal.addEventListener('close',()=>{document.body.classList.remove('dialog-open');dialogTrigger?.focus();});
renderProblems();

// Prize-category tabs: the published 2026/2027 şartname figures.
const awardButtons=$$('#awardTabs [role="tab"]');
function setAward(category){
  const amounts=AWARDS[category];if(!amounts)return;
  const current=awardButtons.find(b=>b.dataset.category===category);
  awardButtons.forEach(b=>{const selected=b===current;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;});
  $('#awardFirst').innerHTML=`${numberTR.format(amounts[0])} <small>TL</small>`;
  $('#awardSecond').innerHTML=`${numberTR.format(amounts[1])} <small>TL</small>`;
  $('#awardThird').innerHTML=`${numberTR.format(amounts[2])} <small>TL</small>`;
  $('#awardPanel').setAttribute('aria-labelledby',current.id);
}
awardButtons.forEach((b,index)=>{
  b.addEventListener('click',()=>setAward(b.dataset.category));
  b.addEventListener('keydown',e=>{
    let next;
    if(e.key==='ArrowRight')next=(index+1)%awardButtons.length;
    if(e.key==='ArrowLeft')next=(index-1+awardButtons.length)%awardButtons.length;
    if(e.key==='Home')next=0;if(e.key==='End')next=awardButtons.length-1;
    if(next!==undefined){e.preventDefault();const n=awardButtons[next];setAward(n.dataset.category);n.focus();n.scrollIntoView({block:'nearest',inline:'nearest'});}
  });
});

// Mobile navigation.
const menuBtn=$('#menuToggle');const nav=$('#mainNav');
function closeNav(){menuBtn.setAttribute('aria-expanded','false');menuBtn.setAttribute('aria-label','Menüyü aç');nav.classList.remove('is-open');}
menuBtn.addEventListener('click',()=>{const open=menuBtn.getAttribute('aria-expanded')!=='true';menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'Menüyü kapat':'Menüyü aç');nav.classList.toggle('is-open',open);});
$$('#mainNav a').forEach(a=>a.addEventListener('click',closeNav));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav();});
document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!menuBtn.contains(e.target))closeNav();});

// Reveal-on-scroll, with a reduced-motion fallback.
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver'in window&&!reduced.matches){
  const revealer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('is-visible');revealer.unobserve(entry.target);}}},{threshold:.1,rootMargin:'0px 0px -20px 0px'});
  $$('.reveal').forEach(el=>revealer.observe(el));
}else $$('.reveal').forEach(el=>el.classList.add('is-visible'));

// The opening X stays on its transparent center as the page scrolls past it.
const openingX=$('#openingX');
const openingStage=openingX.parentElement;
const hero=$('#anasayfa');
const intro=$('#introScene');
const mark=$('#introMark');
const about=$('#hakkinda');
const header=$('#siteHeader');
const progress=$('#scrollProgress');

const clamp=(value)=>Math.max(0,Math.min(1,value));
const smooth=(value)=>value*value*(3-2*value);
let scheduled=false;
let fadeEnd=1;
let zoomEnd=1;
let maxZoom=1;
let clipStart=0;

function renderFrame(){
  scheduled=false;
  const y=window.scrollY;
  const maximum=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
  progress.style.width=`${clamp(y/maximum)*100}%`;
  header.classList.toggle('scrolled',y>22);
  document.documentElement.classList.toggle('intro-past',y >= (reduced.matches ? hero.offsetHeight - 76 : fadeEnd * .60));

  if(reduced.matches){
    intro.style.removeProperty('--intro-cue');
    intro.style.removeProperty('--intro-fade');
    mark.style.removeProperty('--intro-separation');
    openingX.style.opacity='0';
    openingX.style.removeProperty('--intro-zoom');
    openingStage.style.removeProperty('--opening-clip');
    return;
  }

  const phase=clamp(y/zoomEnd);
  const split=smooth(clamp(y/31));
  openingStage.style.setProperty('--opening-clip',`${Math.max(0,y-clipStart)}px`);
  intro.style.setProperty('--intro-fade',1-clamp(y/fadeEnd));
  intro.style.setProperty('--intro-cue',1-smooth(clamp((y-44)/105)));
  mark.style.setProperty('--intro-separation',split);
  openingX.style.opacity=String(split*(1-phase));
  openingX.style.setProperty('--intro-zoom',phase===1 ? 1 : maxZoom**phase);
}

function onScroll(){
  if(!scheduled){
    scheduled=true;
    requestAnimationFrame(renderFrame);
  }
}

function rebuild(){
  const box=mark.getBoundingClientRect();
  const scene=intro.getBoundingClientRect();
  const viewportHeight=window.innerHeight;
  clipStart=hero.offsetHeight-viewportHeight;
  zoomEnd=Math.max(1,about.offsetTop-viewportHeight*.52);
  fadeEnd=Math.max(1,Math.min(box.bottom-scene.top,zoomEnd));

  // Register the separate PNG over the X in the opening logo, then anchor its cutout.
  const fittedWidth=box.width*(915/2048);
  const fittedHeight=box.height*(674/682);
  const fittedLeft=box.left+box.width*(636/2048);
  const fittedTop=box.top-scene.top-box.height*(2/682);
  const style=getComputedStyle(openingX);
  const apertureX=parseFloat(style.getPropertyValue('--aperture-x'))/100;
  const apertureY=parseFloat(style.getPropertyValue('--aperture-y'))/100;
  openingX.style.width=`${fittedWidth}px`;
  openingX.style.height=`${fittedHeight}px`;
  openingX.style.left=`${fittedLeft+fittedWidth*apertureX}px`;
  openingX.style.top=`${fittedTop+fittedHeight*apertureY}px`;
  maxZoom=Math.max(10,viewportHeight/Math.max(1,fittedHeight)*4);
  onScroll();
}

window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',rebuild,{passive:true});
window.addEventListener('load',rebuild);
reduced.addEventListener('change',rebuild);
rebuild();

// Keep current navigation section highlighted, excluding external CTA.
if('IntersectionObserver'in window){
  const links=$$('#mainNav a[href^="#"]');
  const obs=new IntersectionObserver(entries=>{
    for(const entry of entries){if(!entry.isIntersecting)continue;
      links.forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id));
    }
  },{rootMargin:'-28% 0px -62% 0px',threshold:0});
  $$('main section[id]').forEach(sec=>obs.observe(sec));
}
