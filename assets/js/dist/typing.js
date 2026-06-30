function b(i){const{selector:h,speed:x=35,startDelay:L=300,showCursor:u=!0,linksSelector:T=".links-section"}=i,o=document.querySelector(h);if(!o)return;const f=Array.from(o.querySelectorAll("p"));if(f.length===0)return;const m=f.map(e=>{const n={el:e,text:e.textContent||"",html:e.innerHTML,done:!1};return e.innerHTML="",e.style.minHeight="1.5em",n});if(u){const e=document.createElement("style");e.textContent=`
      .typing-cursor::after {
        content: '█';
        animation: blink 1s step-end infinite;
        margin-left: 1px;
      }
      @keyframes blink {
        50% { opacity: 0; }
      }
    `,document.head.appendChild(e)}const C=m.reduce((e,n)=>Math.max(e,n.text.length),0);let l=0;function g(){l++;for(const e of m)e.done||(l>=e.text.length?(e.el.innerHTML=e.html,e.el.classList.remove("typing-cursor"),e.done=!0):(e.el.innerHTML=M(e.html,e.text.slice(0,l)),u&&e.el.classList.add("typing-cursor")));if(l>=C){E();return}window.setTimeout(g,x)}function E(){o==null||o.classList.add("typing-done"),window.setTimeout(()=>{const e=document.querySelector(T);e==null||e.classList.add("links-revealed")},180)}function M(e,n){if(!e.includes("<a"))return n;const a=document.createElement("div");a.innerHTML=e;let d=0;const w=n.length;function y(r){var p;if(r.nodeType===Node.TEXT_NODE){const s=r.textContent||"",t=w-d;return t<=0?(r.textContent="",!1):t<s.length?(r.textContent=s.slice(0,t),d+=t,!1):(d+=s.length,!0)}else if(r.nodeType===Node.ELEMENT_NODE){const s=Array.from(r.childNodes);for(const t of s)if(!y(t)){let c=t.nextSibling;for(;c;){const N=c.nextSibling;(p=c.parentNode)==null||p.removeChild(c),c=N}return!1}return!0}return!0}return y(a),a.innerHTML}window.setTimeout(g,L)}document.addEventListener("DOMContentLoaded",()=>{const i=document.querySelector("[data-typing-effect]");i&&b({selector:"[data-typing-effect]",speed:parseInt(i.getAttribute("data-typing-speed")||"35"),startDelay:parseInt(i.getAttribute("data-typing-delay")||"300")})});
