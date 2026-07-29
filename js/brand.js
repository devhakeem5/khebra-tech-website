const button=document.getElementById('menuButton'),nav=document.getElementById('mainNav');
button?.addEventListener('click',()=>{const open=nav.classList.toggle('open');button.setAttribute('aria-expanded',open)});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');button.setAttribute('aria-expanded','false')}));
const sculpture=document.querySelector('.sculpture');
if(sculpture&&matchMedia('(hover:hover)').matches){window.addEventListener('pointermove',event=>{const tilt=((event.clientX/innerWidth)-.5)*10;sculpture.style.setProperty('--object-tilt',`${tilt}deg`)},{passive:true})}
