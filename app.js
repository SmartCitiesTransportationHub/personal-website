(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const page = document.body.dataset.page;
  const text = value => typeof value === 'string' ? value.trim() : '';
  const list = value => Array.isArray(value) ? value : [];
  const el = (tag, cls, value) => {const node = document.createElement(tag); if(cls)node.className=cls; if(value!==undefined)node.textContent=String(value); return node;};
  const append = (node,...children) => {node.append(...children.filter(Boolean));return node;};
  function url(value,local=true) {
    const raw=text(value);if(!raw)return '';
    if(/^https?:\/\//i.test(raw)){try{const parsed=new URL(raw);if(parsed.username||parsed.password)return '';return parsed.href;}catch{return '';}}
    if(local && /^(assets|files|demos)\/[A-Za-z0-9_./%\-]+(?:[?#][^\s<>]*)?$/.test(raw) && !raw.split(/[?#]/)[0].includes('..'))return raw;
    return '';
  }
  function link(href,label,cls='text-link'){if(!href)return null;const a=el('a',cls,label);a.href=href;if(/^https?:\/\//.test(href)){a.target='_blank';a.rel='noopener noreferrer';}return a;}
  function image(src,alt,cls='',eager=false){const img=el('img',cls);img.src=url(src)||'assets/project-placeholder.svg';img.alt=text(alt);if(!eager)img.loading='lazy';img.addEventListener('error',()=>{const replacement=el('div','image-unavailable','Image unavailable');replacement.setAttribute('role','img');replacement.setAttribute('aria-label',text(alt)||'Image unavailable');img.replaceWith(replacement);},{once:true});return img;}
  function gallery(items){const grid=el('div','gallery');list(items).forEach(item=>{if(!url(item.src))return;const fig=append(el('figure'),image(item.src,item.alt||item.caption));if(text(item.caption))fig.append(el('figcaption','',item.caption));grid.append(fig);});return grid;}
  function tags(items){const box=el('div','project-tags');list(items).filter(item=>text(item)).forEach(item=>box.append(el('span','tag',item)));return box;}
  const data=window.PORTFOLIO;
  if(!data || data.version!==1 || !data.profile || !Array.isArray(data.publications)){
    $('#main').replaceChildren(el('p','error-message','Website content could not be loaded. Check the syntax and required fields in content.js.'));return;
  }
  const profile=data.profile,name=text(profile.name)||'Personal website';
  const titles={profile:'Profile',software:'Software & Products',industry:'Industry Projects',academic:'Academic Projects',publications:'Publications'};
  document.title=(titles[page]||'Portfolio')+' · '+name;
  document.querySelector('meta[name=description]').content=text(page==='profile'?profile.introduction:data.pages?.[page]?.introduction);
  document.querySelectorAll('[data-person-name]').forEach(node=>node.textContent=name);
  document.querySelectorAll('[data-initials]').forEach(node=>node.textContent=text(profile.initials)||name.split(/\s+/).map(part=>part[0]).slice(0,2).join(''));
  $('#footer-year').textContent=String(new Date().getFullYear());
  const orcid=text(profile.orcid).replace(/^https?:\/\/orcid\.org\//,'');
  const orcidLink=/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(orcid)?'https://orcid.org/'+orcid:'';
  if(orcidLink)$('#footer-links').append(link(orcidLink,'ORCID ↗',''));
  if(text(profile.email)&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))$('#footer-links').append(link('mailto:'+profile.email,'Email ↗',''));
  list(profile.links).slice(0,5).forEach(item=>$('#footer-links').append(...[link(url(item.url,false),item.label+' ↗','')].filter(Boolean)));
  const nav=$('#navigation'),menu=$('#menu-toggle');
  function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='Menu +';}
  menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(expanded));menu.textContent=expanded?'Close −':'Menu +';nav.classList.toggle('open',expanded);});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
  matchMedia('(min-width:901px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
  const main=$('#main');
  function renderProfile(){
    const hero=el('section','profile-hero');hero.setAttribute('aria-labelledby','profile-name');
    const introduction=el('div'),heading=el('h1','hero-name');heading.id='profile-name';
    const names=name.split(/\s+/);heading.append(document.createTextNode(names.slice(0,-1).join(' ')||name));if(names.length>1)heading.append(el('br'),document.createTextNode(names.at(-1)));
    append(introduction,el('p','eyebrow','RESEARCH / SOFTWARE / PROJECTS'),heading,el('p','hero-role',[text(profile.role),text(profile.affiliation)].filter(Boolean).join(' · ')),el('p','hero-intro',profile.introduction));
    const buttons=el('div','hero-links');buttons.append(link('academic.html','Explore my work ↗','button'));if(orcidLink)buttons.append(link(orcidLink,'ORCID ↗'));if(url(profile.cv))buttons.append(link(url(profile.cv),'Download CV ↓'));introduction.append(buttons);
    const portrait=el('div','portrait-panel'),portraitTop=el('div','portrait-top');
    append(portraitTop,el('span','mono','A PERSONAL RESEARCH PORTFOLIO'),el('span','mono','PROFILE / 01'));
    const frame=append(el('div','portrait-frame'),image(profile.photo,profile.photoAlt||name,'',true));
    const label=el('div','portrait-label'),labelCopy=append(el('div'),el('p','',name),el('p','mono',[text(profile.role),text(profile.location)].filter(Boolean).join(' / ')));
    append(label,labelCopy,el('span','portrait-mark','↗'));append(portrait,portraitTop,frame,label);append(hero,introduction,portrait);main.append(hero);
    const orbit=el('div','profile-orbit');['Cities & urban systems','Transportation & mobility','Energy & transitions'].forEach(s=>orbit.append(el('span','',s)));main.append(orbit);
    const about=el('section','section'),aboutGrid=el('div','section-intro');about.id='about';
    append(aboutGrid,append(el('div'),el('p','eyebrow','ABOUT / A CONTINUING EXPLORATION'),el('h2','','Connecting ideas,\nacross disciplines.')));
    aboutGrid.querySelector('h2').style.whiteSpace='pre-line';const biography=append(el('div'),el('p','prose',profile.biography));const interests=tags(profile.interests);interests.className='interests';biography.append(interests);
    const contact=el('div','contact-block');if(orcidLink)contact.append(link(orcidLink,'ORCID '+orcid+' ↗'));if(profile.email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))contact.append(link('mailto:'+profile.email,'Get in touch ↗'));biography.append(contact);aboutGrid.append(biography);about.append(aboutGrid);main.append(about);
    if(list(profile.experience).length){const section=el('section','section');append(section,el('p','eyebrow','BACKGROUND'),el('h2','','Experience & education'));const timeline=el('div','timeline');profile.experience.forEach(item=>timeline.append(append(el('article','timeline-row'),el('p','mono',item.period),append(el('div'),el('h3','',item.title),el('p','',item.organization),el('p','prose',item.description)))));section.append(timeline);main.append(section);}
    const explore=el('section','section');const header=append(el('div','section-header'),append(el('div'),el('p','eyebrow','EXPLORE / FOUR CONNECTED DIRECTIONS'),el('h2','','A closer look at the work.')),el('p','','From practical software to published research, each collection opens a different part of the story.'));explore.append(header);
    const paths=el('div','path-grid');[
      ['01','Software & products','Tools, interfaces and ideas you can use.','software.html'],
      ['02','Industry projects','Applied work and interactive demonstrations.','industry.html'],
      ['03','Academic projects','Research questions, methods and prototypes.','academic.html'],
      ['04','Publications','Papers, figures and the findings behind them.','publications.html']
    ].forEach(([no,title,description,href])=>{const a=el('a','path-card');a.href=href;append(a,el('span','mono',no+' / COLLECTION'),el('h3','',title),el('p','',description),el('span','arrow','↗'));paths.append(a);});explore.append(paths);
    if(url(profile.background)){const banner=append(el('div','image-banner'),image(profile.background,profile.backgroundAlt),el('h2','',profile.headline),el('p','caption',profile.backgroundCaption));explore.append(banner);}main.append(explore);
    if(list(profile.gallery).length){const section=append(el('section','section'),el('p','eyebrow','IN PICTURES'),el('h2','','Notes from the journey.'));const photos=gallery(profile.gallery);photos.style.marginTop='30px';section.append(photos);main.append(section);}
  }
  function pageHero(){const details=data.pages?.[page]||{};const hero=el('section','page-hero');append(hero,append(el('div'),el('p','eyebrow',details.eyebrow||titles[page]),el('h1','',details.title||titles[page])),el('p','',details.introduction||''));main.append(hero);}
  function search(placeholder,label){const wrapper=el('label','search-box');wrapper.append(el('span','','⌕'),el('span','sr-only',label));const input=el('input');input.type='search';input.placeholder=placeholder;input.setAttribute('aria-label',label);wrapper.append(input);return {wrapper,input};}
  function normalizeProject(project,example){return {...project,example:!!example,id:text(project.id),title:text(project.title),tags:list(project.tags),gallery:list(project.gallery),downloads:list(project.downloads)};}
  function renderProjects(){
    pageHero();const records=[...list(data[page]).map(p=>normalizeProject(p,p.example)),...list(data.examples?.[page]).map(p=>normalizeProject(p,true))];
    const unique=new Set();records.forEach(p=>{if(!/^[a-z0-9][a-z0-9-]*$/.test(p.id)||unique.has(p.id)||!p.title)throw Error('Each project needs a title and a unique id using lowercase letters, numbers and hyphens.');unique.add(p.id);});
    const toolbar=el('div','toolbar'),tabs=el('div','filter-tabs');tabs.setAttribute('aria-label','Filter project collection');let filter='all';const filterButtons=[];
    [['all','All work'],['projects','Projects'],['examples','Interactive examples']].forEach(([id,label])=>{const button=el('button','',label);button.type='button';button.setAttribute('aria-pressed',String(id==='all'));button.addEventListener('click',()=>{filter=id;filterButtons.forEach(item=>item.button.setAttribute('aria-pressed',String(item.id===id)));draw();});tabs.append(button);filterButtons.push({id,button});});
    const query=search('Search titles or topics…','Search projects');append(toolbar,tabs,query.wrapper);main.append(toolbar);
    const section=el('section','collection'),count=el('p','results-count'),grid=el('div','project-grid');count.setAttribute('role','status');append(section,count,grid);main.append(section);
    const exampleNote=el('p','examples-note','Interactive examples are working website templates with illustrative data. They are separate from personal projects and do not represent commissioned work or published research results.');section.append(exampleNote);
    function draw(){const term=query.input.value.trim().toLowerCase();const shown=records.filter(p=>(filter==='all'||(filter==='examples'?p.example:!p.example))&&[p.title,p.summary,p.description,...p.tags].join(' ').toLowerCase().includes(term));grid.replaceChildren();count.textContent=shown.length+' '+(shown.length===1?'item':'items');exampleNote.hidden=!shown.some(p=>p.example);
      if(!shown.length){grid.append(append(el('div','empty-state'),el('h2','',term?'No matching projects.':'This collection is taking shape.'),el('p','',term?'Try another title or topic.':filter==='projects'?'Project details will be added here. You can explore a working template under Interactive examples.':'New work will appear in this collection.')));return;}
      shown.forEach(p=>{const card=el('article','project-card');const cover=url(p.cover)?image(p.cover,p.title+' project preview','project-cover'):el('div','project-cover placeholder','↗');card.append(cover);const body=el('div','project-content');append(body,append(el('div','card-top'),el('span','pill'+(p.example?' example':''),p.example?'DEMO TEMPLATE':text(p.status)||'PROJECT'),el('span','mono',p.year||'')),el('h2','',p.title),el('p','',p.summary),tags(p.tags));const actions=el('div','card-actions');if(url(p.demoUrl)){const open=el('button','button','Open demo ↗');open.type='button';open.addEventListener('click',()=>{if(location.protocol==='file:'){window.open(url(p.demoUrl),'_blank','noopener,noreferrer');}else{showProject(p,true);}});actions.append(open);}const read=el('button','text-link','Project details ↗');read.type='button';read.addEventListener('click',()=>showProject(p,false));actions.append(read);body.append(actions);card.append(body);grid.append(card);});
    }
    query.input.addEventListener('input',draw);draw();
    function openFromHash(){if(!location.hash.startsWith('#project='))return;let id;try{id=decodeURIComponent(location.hash.slice(9));}catch{return;}const project=records.find(p=>p.id===id);if(project)showProject(project,false,false);}
    window.addEventListener('hashchange',openFromHash);openFromHash();
  }
  const dialog=$('#project-dialog');let lastFocus=null;
  function showProject(project,startDemo,updateHash=true){
    if(!dialog.open)lastFocus=document.activeElement;
    $('#dialog-kicker').textContent=project.example?'INTERACTIVE EXAMPLE / WEBSITE TEMPLATE':'PROJECT / '+(project.year||'');
    const body=$('#dialog-body');body.replaceChildren();const title=el('h2','',project.title);title.id='dialog-title';append(body,title,el('p','dialog-description',project.description||project.summary));
    if(project.example)body.append(el('p','examples-note','Example only. Values and scenarios are illustrative; this is not a claim of a completed personal, industry or academic project.'));
    const meta=el('div','project-meta');if(text(project.role))meta.append(el('span','','Role / '+project.role));if(text(project.status))meta.append(el('span','','Status / '+project.status));body.append(meta,tags(project.tags));
    const actions=el('div','dialog-actions'),demoUrl=url(project.demoUrl),canEmbed=project.embedDemo===true&&location.protocol!=='file:';let launched=false;
    const demoArea=el('div');
    function launch(){if(launched||!demoUrl)return;launched=true;if(canEmbed){const frame=el('iframe','demo-frame');frame.title=project.title+' interactive demonstration';frame.setAttribute('sandbox','allow-scripts allow-forms allow-popups allow-downloads');frame.setAttribute('referrerpolicy','no-referrer');frame.src=demoUrl;demoArea.append(frame);const note=el('p','demo-note','If the embedded demo does not load, ');const separate=link(demoUrl,'open it in a new tab.','');separate.target='_blank';separate.rel='noopener noreferrer';note.append(separate);demoArea.append(note);}else{demoArea.append(el('p','demo-note','Use “Open in new tab” to explore this demonstration.'));}if(launchButton)launchButton.hidden=true;}
    let launchButton=null;
    if(demoUrl){if(canEmbed){launchButton=el('button','button','Launch interactive demo ↗');launchButton.type='button';launchButton.addEventListener('click',launch);actions.append(launchButton);}const separate=link(demoUrl,'Open in new tab ↗','button light');separate.target='_blank';separate.rel='noopener noreferrer';actions.append(separate);}
    [link(url(project.codeUrl,false),'Source code ↗','button light'),link(url(project.websiteUrl,false),'Project website ↗','button light')].filter(Boolean).forEach(a=>actions.append(a));
    project.downloads.forEach(file=>{const a=link(url(file.url),text(file.label)||'Download ↓','button light');if(a)actions.append(a);});append(body,actions,demoArea);if(project.gallery.length)body.append(gallery(project.gallery));
    if(updateHash){try{history.replaceState(null,'','#project='+encodeURIComponent(project.id));}catch{}}
    if(!dialog.open){dialog.showModal();document.body.style.overflow='hidden';}dialog.scrollTop=0;if(startDemo)launch();
  }
  function closeDialog(){dialog.close();}
  $('#dialog-close').addEventListener('click',closeDialog);dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog();});dialog.addEventListener('close',()=>{$('#dialog-body').replaceChildren();document.body.style.overflow='';if(location.hash.startsWith('#project=')){try{history.replaceState(null,'',location.pathname+location.search);}catch{}}lastFocus?.focus();});
  function citation(p){return text(p.authors)+'. ('+p.year+'). '+text(p.title)+'. '+text(p.venue)+(p.volume?', '+p.volume:'')+(p.article?', '+p.article:'')+'.'+(text(p.doi)?' https://doi.org/'+p.doi:'');}
  function bibValue(value){const escapes={'\\':'\\textbackslash{}','{':'\\{','}':'\\}','&':'\\&','%':'\\%','#':'\\#','_':'\\_'};return String(value??'').replace(/[\\{}&%#_]/g,match=>escapes[match]).replace(/\r?\n/g,' ');}
  function bibtex(p,index=0){const key=text(p.id).replace(/[^a-zA-Z0-9_-]/g,'')||'publication'+index;const authors=text(p.authors).split(/,\s*/).join(' and ');const kind=['article','inproceedings','book','misc'].includes(p.bibtexType)?p.bibtexType:'article';const fields={title:p.title,author:authors,year:p.year,[kind==='inproceedings'?'booktitle':kind==='book'?'publisher':kind==='misc'?'howpublished':'journal']:p.venue,volume:p.volume,pages:p.article,doi:p.doi,url:p.url};return '@'+kind+'{'+key+',\n'+Object.entries(fields).filter(([,v])=>v!==undefined&&String(v).trim()).map(([k,v])=>'  '+k+' = {'+(k==='doi'||k==='url'?String(v).replace(/[{}\r\n]/g,''):bibValue(v))+'}').join(',\n')+'\n}\n';}
  function download(content,filename,type){const blob=new Blob([content],{type}),address=URL.createObjectURL(blob),a=el('a');a.href=address;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(address),1500);}
  async function copy(value){try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);return;}}catch{}const field=el('textarea');field.value=value;field.style.cssText='position:fixed;left:-10000px;top:0';document.body.append(field);field.focus();field.select();const copied=document.execCommand('copy');field.remove();if(!copied)throw Error('Copy unavailable.');}
  function renderPublications(){
    pageHero();const records=list(data.publications).slice().sort((a,b)=>Number(b.year)-Number(a.year)||text(a.title).localeCompare(text(b.title)));
    const toolbar=el('div','toolbar publication-toolbar'),filters=el('div','publication-filters');const query=search('Search papers or authors…','Search publications');
    function selectFilter(label,values){const select=el('select');select.setAttribute('aria-label',label);const option=el('option','',label);option.value='';select.append(option);values.forEach(value=>{const op=el('option','',value);op.value=String(value);select.append(op);});return select;}
    const year=selectFilter('All years',[...new Set(records.map(p=>p.year))].sort((a,b)=>b-a)),type=selectFilter('All types',[...new Set(records.map(p=>text(p.type)||'Publication'))]);append(filters,year,type);const exportButton=el('button','button light','Export BibTeX ↓');exportButton.type='button';exportButton.disabled=!records.length;exportButton.addEventListener('click',()=>download(records.map(bibtex).join('\n'),'publications.bib','application/x-bibtex;charset=utf-8'));append(toolbar,query.wrapper,filters,exportButton);main.append(toolbar);
    const section=el('section','collection'),count=el('p','results-count'),papers=el('div','publication-list');count.setAttribute('role','status');append(section,count,papers);main.append(section);
    function draw(){const term=query.input.value.trim().toLowerCase();const shown=records.filter(p=>(!year.value||String(p.year)===year.value)&&(!type.value||(text(p.type)||'Publication')===type.value)&&[p.title,p.authors,p.venue,p.abstract,p.body,p.doi].join(' ').toLowerCase().includes(term));papers.replaceChildren();count.textContent=shown.length+' '+(shown.length===1?'publication':'publications');if(!shown.length){papers.append(append(el('div','empty-state'),el('h2','','No publications to display.'),el('p','',records.length?'Try a different search or clear the filters.':'New publications will appear here.')));return;}
      shown.forEach((p,index)=>{const article=el('article','publication'),body=el('div');article.append(el('div','publication-year',p.year||''));append(body,el('span','pill',text(p.type)||'Publication'),el('h2','',p.title),el('p','publication-authors',p.authors),el('p','publication-venue',[p.venue,p.volume?'Volume '+p.volume:'',p.article?'Article '+p.article:''].filter(Boolean).join(' · ')));
        const links=el('div','publication-links');const doi=text(p.doi).replace(/^https?:\/\/doi\.org\//,'');if(/^10\.\d{4,9}\/\S+$/.test(doi))links.append(link('https://doi.org/'+doi,'DOI ↗',''));[link(url(p.url,false),'Publication page ↗',''),link(url(p.pdf),'Full text ↗','')].filter(Boolean).forEach(a=>links.append(a));
        const copyButton=el('button','','Copy citation'),feedback=el('p','citation-feedback');copyButton.type='button';feedback.setAttribute('role','status');copyButton.addEventListener('click',async()=>{try{await copy(citation(p));feedback.textContent='Citation copied.';copyButton.focus();}catch{feedback.textContent=citation(p);feedback.style.userSelect='all';}});const bib=el('button','','BibTeX ↓');bib.type='button';bib.addEventListener('click',()=>download(bibtex(p,index),(text(p.id)||'publication')+'.bib','application/x-bibtex;charset=utf-8'));append(links,copyButton,bib);append(body,links,feedback);
        [['abstract','Read abstract'],['body','Research details']].forEach(([field,title])=>{if(text(p[field]))body.append(append(el('details'),el('summary','',title),el('p','',p[field])));});if(list(p.images).length)body.append(gallery(p.images));article.append(body);papers.append(article);
      });
    }
    query.input.addEventListener('input',draw);year.addEventListener('change',draw);type.addEventListener('change',draw);draw();
  }
  try{if(page==='profile')renderProfile();else if(page==='publications')renderPublications();else renderProjects();}
  catch(error){main.replaceChildren(el('p','error-message','Content could not be displayed. Check content.js: '+error.message));}
})();
