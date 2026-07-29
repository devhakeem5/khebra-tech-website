const button=document.getElementById('menuButton'),nav=document.getElementById('mainNav');
button?.addEventListener('click',()=>{const open=nav.classList.toggle('open');button.setAttribute('aria-expanded',open)});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');button.setAttribute('aria-expanded','false')}));
