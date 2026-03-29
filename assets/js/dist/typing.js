function b(a){const{selector:T,speed:x=35,startDelay:C=300,paragraphDelay:E=200,showCursor:h=!0}=a,m=document.querySelector(T);if(!m)return;const f=Array.from(m.querySelectorAll("p"));if(f.length===0)return;const n=[];if(f.forEach(t=>{n.push({el:t,text:t.textContent||"",html:t.innerHTML}),t.innerHTML="",t.style.minHeight="1.5em"}),h){const t=document.createElement("style");t.textContent=`
      .typing-cursor::after {
        content: '█';
        animation: blink 1s step-end infinite;
        margin-left: 1px;
      }
      @keyframes blink {
        50% { opacity: 0; }
      }
    `,document.head.appendChild(t)}getComputedStyle(f[0]).font;let i=0,s=0;function g(){if(i>=n.length){n[n.length-1].el.classList.remove("typing-cursor");return}const t=n[i],{el:e,html:o}=t;s===0&&i>0&&n[i-1].el.classList.remove("typing-cursor"),s===0&&e.classList.add("typing-cursor"),s++;const c=t.text,p=c.slice(0,s);e.innerHTML=M(o,p),h&&e.classList.add("typing-cursor"),s>=c.length?(e.innerHTML=o,i++,s=0,i<n.length?window.setTimeout(g,E):e.classList.remove("typing-cursor")):window.setTimeout(g,x)}function M(t,e){if(!t.includes("<a"))return e;const o=document.createElement("div");o.innerHTML=t;let c=0;const p=e.length;function y(l){var L;if(l.nodeType===Node.TEXT_NODE){const u=l.textContent||"",r=p-c;return r<=0?(l.textContent="",!1):r<u.length?(l.textContent=u.slice(0,r),c+=r,!1):(c+=u.length,!0)}else if(l.nodeType===Node.ELEMENT_NODE){const u=Array.from(l.childNodes);for(const r of u)if(!y(r)){let d=r.nextSibling;for(;d;){const N=d.nextSibling;(L=d.parentNode)==null||L.removeChild(d),d=N}return!1}return!0}return!0}return y(o),o.innerHTML}setTimeout(g,C)}document.addEventListener("DOMContentLoaded",()=>{const a=document.querySelector("[data-typing-effect]");a&&b({selector:"[data-typing-effect]",speed:parseInt(a.getAttribute("data-typing-speed")||"35"),startDelay:parseInt(a.getAttribute("data-typing-delay")||"300")})});
