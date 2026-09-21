// Keeps the close control independent from page/header stacking contexts.
(function(){
  function init(){
    var source=document.querySelector('.site-header .nav-toggle');
    if(!source)return;
    var proxy=null;

    function mount(){
      if(proxy&&proxy.isConnected)return;
      proxy=document.createElement('button');
      proxy.type='button';
      proxy.className='exif-close-proxy';
      proxy.setAttribute('aria-label','Close menu');
      proxy.innerHTML='<span></span><span></span><span></span>';
      proxy.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        source.click();
      });
      document.body.appendChild(proxy);
    }

    function unmount(){
      if(proxy&&proxy.isConnected)proxy.remove();
      proxy=null;
    }

    function sync(){
      if(document.body.classList.contains('nav-open'))mount();
      else unmount();
    }

    new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
    sync();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
