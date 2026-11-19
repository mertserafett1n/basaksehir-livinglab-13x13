'use strict';
document.documentElement.classList.add('js');

// Titles and project questions are based on the official 13 problem subjects page.
// https://basaksehirlivinglab.com/13-x-13-problem-konu-basliklari
const PROBLEMS_TR = [
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
const PROBLEMS_EN = [
  {number:1, title:'Disaster-Resilient Cities and Emergency Management', question:'What solution could strengthen preparedness before disasters, enable a rapid and coordinated response during them, and support recovery afterward?'},
  {number:2, title:'Smart Mobility, Accessibility and Urban Order', question:'How can we reduce travel times, improve safety, and create accessible, orderly and sustainable urban mobility for everyone?'},
  {number:3, title:'Climate Adaptation and Environmental Sustainability', question:'What solution could reduce the environmental, economic and social impacts of climate change, protect nature and make living spaces more resilient?'},
  {number:4, title:'Future Experiences in Culture, Art and Tourism', question:'How can an innovative solution strengthen local identity by showcasing cultural heritage and artistic production while providing accessible and sustainable experiences?'},
  {number:5, title:'Recycling and Waste Management', question:'What system could reduce waste generation, make separation easier and turn waste into a reusable resource?'},
  {number:6, title:'Sustainable Food Systems and Smart Agriculture', question:'What solution could make the journey of food from production to the consumer safer, more efficient, traceable and sustainable?'},
  {number:7, title:'Health, Sports and Well-Being', question:'What solution could support physical, mental and social well-being and strengthen healthy living habits?'},
  {number:8, title:'Water Management, Energy Efficiency and Renewable Energy', question:'What solution could reduce water and energy use, detect losses early and expand the use of renewable energy?'},
  {number:9, title:'Education, Youth, Skills and Employment', question:'What solution could help young people discover their strengths, gain relevant skills and move from education into employment?'},
  {number:10, title:'Science, Advanced Technologies and Space Applications', question:'How can scientific knowledge and advanced technologies deliver an innovative, practical solution to a social, environmental or industrial challenge?'},
  {number:11, title:'Social Innovation and Community Life', question:'What social solution could strengthen solidarity, reduce unequal opportunities and create inclusive places to live?'},
  {number:12, title:'Digital Transformation, Artificial Intelligence and Cybersecurity', question:'What solution could use AI and digital technologies to make services faster, safer, more accessible and more efficient?'},
  {number:13, title:'Financial Technologies and the Innovative Economy', question:'What solution could make financial transactions safer, more accessible and more efficient while improving economic decisions for individuals and businesses?'}
];
const isEnglish=document.documentElement.lang==='en';
const PROBLEMS=isEnglish?PROBLEMS_EN:PROBLEMS_TR;
const UI=isEnglish?{
  noResults:'No challenge areas match your search.',
  details:'view details',
  questionTag:'VIEW PROJECT QUESTION',
  results:'results',
  areas:'areas',
  menuOpen:'Open menu',
  menuClose:'Close menu'
}:{
  noResults:'Aradığınız ifadeye uygun problem alanı bulunamadı.',
  details:'detayları aç',
  questionTag:'PROJE SORUSUNU GÖR',
  results:'sonuç',
  areas:'alan',
  menuOpen:'Menüyü aç',
  menuClose:'Menüyü kapat'
};
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
const numberFormat=new Intl.NumberFormat(isEnglish?'en-US':'tr-TR');
const normalize=s=>s.toLocaleLowerCase(isEnglish?'en':'tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');

// Download the FAQ and footer PDFs as files instead of opening the PDF viewer.
$$('.faq-downloads a[download],.footer-links a[download]').forEach(link=>{
  link.addEventListener('click',async event=>{
    event.preventDefault();
    try{
      const response=await fetch(link.href);
      if(!response.ok)throw new Error('PDF unavailable');
      const objectURL=URL.createObjectURL(await response.blob());
      const download=document.createElement('a');
      download.href=objectURL;
      download.download=link.download;
      download.hidden=true;
      document.body.appendChild(download);
      download.click();
      download.remove();
      setTimeout(()=>URL.revokeObjectURL(objectURL),60000);
    }catch{
      // The native download link also works when fetch is unavailable (e.g. file://).
      const fallback=document.createElement('a');
      fallback.href=link.href;
      fallback.download=link.download;
      fallback.hidden=true;
      document.body.appendChild(fallback);
      fallback.click();
      fallback.remove();
    }
  });
});

// Problem discovery, search and an accessible native dialog.
const grid=$('#problemGrid');
const problemSearch=$('#problemSearch');
const resultCount=$('#resultCount');
const modal=$('#problemDialog');
let dialogTrigger=null;
function renderProblems(){
  const term=normalize(problemSearch.value.trim());
  const source=term?PROBLEMS.filter(p=>normalize(`${p.title} ${p.question}`).includes(term)):PROBLEMS;
  grid.classList.toggle('route-layout',!term);
  grid.innerHTML='';
  if(!source.length){
    const empty=document.createElement('p');empty.className='empty-results';empty.textContent=UI.noResults;grid.appendChild(empty);
  }
  for(const p of source){
    const btn=document.createElement('button');
    btn.type='button';btn.className='problem-card';btn.dataset.number=String(p.number);
    btn.setAttribute('aria-label',`${p.number}. ${isEnglish?'challenge':'problem'}: ${p.title} — ${UI.details}`);
    const num=document.createElement('span');num.className='problem-number';num.textContent=String(p.number);
    const title=document.createElement('h3');title.textContent=p.title;
    const bottom=document.createElement('span');bottom.className='problem-bottom';
    const tag=document.createElement('span');tag.textContent=UI.questionTag;
    const arrow=document.createElement('span');arrow.className='card-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');
    bottom.append(tag,arrow);btn.append(num,title,bottom);
    btn.addEventListener('click',()=>openProblem(p,btn));grid.appendChild(btn);
  }
  resultCount.textContent=term?`${source.length} ${UI.results}`:`${PROBLEMS.length} ${UI.areas}`;
}
function openProblem(problem,trigger){
  dialogTrigger=trigger;
  $('#dialogNumber').textContent=`${isEnglish?'CHALLENGE':'PROBLEM'} / ${String(problem.number).padStart(2,'0')}`;
  $('#dialogTitle').textContent=problem.title;
  $('#dialogQuestion').textContent=problem.question;
  if(typeof modal.showModal==='function'){
    modal.showModal();document.body.classList.add('dialog-open');
  }else{
    // Graceful fallback for older browsers.
    window.open(isEnglish?'assets/13x13-challenge-topics-en.pdf':'assets/13x13-problem-alanlari.pdf','_blank','noopener,noreferrer');
  }
}
problemSearch.addEventListener('input',renderProblems);
$('#dialogClose').addEventListener('click',()=>modal.close());
modal.addEventListener('click',e=>{if(e.target===modal)modal.close();});
modal.addEventListener('close',()=>{document.body.classList.remove('dialog-open');dialogTrigger?.focus();});
renderProblems();

// Prize-category tabs: published 2026/2027 competition rules.
const awardButtons=$$('#awardTabs [role="tab"]');
const awardSteps=$$('#awardPanel .award-step');
const maxAward=Math.max(...Object.values(AWARDS).flat());
function setAward(category){
  const amounts=AWARDS[category];if(!amounts)return;
  const current=awardButtons.find(b=>b.dataset.category===category);
  awardButtons.forEach(b=>{const selected=b===current;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;});
  awardSteps.forEach(step=>{
    const rank=Number(step.dataset.rank);
    const amount=amounts[rank];
    const institutionHeight=160+Math.round(AWARDS.kurumlar[rank]/maxAward*260);
    const previousHeight=160+Math.round(amount/maxAward*260);
    step.style.setProperty('--bar-height',`${Math.round((institutionHeight+previousHeight)/2)}px`);
    step.querySelector('.award-amount').innerHTML=`${numberFormat.format(amount)} <small>TL</small>`;
  });
  $('#awardPanel').setAttribute('aria-labelledby',current.id);
}
setAward('kurumlar');
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
function closeNav(){menuBtn.setAttribute('aria-expanded','false');menuBtn.setAttribute('aria-label',UI.menuOpen);nav.classList.remove('is-open');}
menuBtn.addEventListener('click',()=>{const open=menuBtn.getAttribute('aria-expanded')!=='true';menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?UI.menuClose:UI.menuOpen);nav.classList.toggle('is-open',open);});
$$('#mainNav a').forEach(a=>a.addEventListener('click',closeNav));
$$('.lang-switch a').forEach(a=>a.addEventListener('click',()=>{a.href=a.getAttribute('href').split('#')[0]+window.location.hash;}));
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
