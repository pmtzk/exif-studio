/* EXIF context-aware header chrome.
   Samples the actual painted surface under logo and trigger independently.
   No layout writes: only theme classes, once per animation frame at most. */
(function(){
  function init(){
    var header=document.querySelector('.site-header');
    var logoHit=header&&header.querySelector('.wrap>a:first-child');
    var toggle=header&&header.querySelector('.nav-toggle');
    if(!header||!logoHit||!toggle)return;
    var raf=0;

    function isTransparent(c){
      if(!c||c==='transparent')return true;
      var m=c.match(/rgba?\([^)]*(?:[, /])\s*([\d.]+)\s*\)$/);
      return !!(m&&+m[1]===0);
    }
    function luminance(c){
      var m=c&&c.match(/rgba?\(\s*(\d+)[, ]+(\d+)[, ]+(\d+)/);if(!m)return null;
      return .2126*(+m[1])+.7152*(+m[2])+.0722*(+m[3]);
    }
    function darkSurfaceAt(el){
      var r=el.getBoundingClientRect();
      var x=Math.max(1,Math.min(innerWidth-2,r.left+r.width/2));
      var y=Math.max(1,Math.min(innerHeight-2,r.top+r.height/2));
      var stack=document.elementsFromPoint(x,y);
      for(var i=0;i<stack.length;i++){
        var node=stack[i];
        if(header.contains(node))continue;
        /* Known visual fields are deterministic and take precedence over inherited backgrounds. */
        if(node.closest&&node.closest('.bg-deep,.production-section,.site-footer'))return true;
        if(node.closest&&node.closest('.exif-hero-bg,.exif-hero-shade,.hero-cinematic,.production-visual,.work-image'))return true;
        /* Mobile hero is full bleed; desktop hero is cream at the nav edges unless an image is actually hit. */
        if(innerWidth<860&&node.closest&&node.closest('#what-exif-does.exif-cinematic-hero'))return true;
        var cs=getComputedStyle(node),bg=cs.backgroundColor;
        if(!isTransparent(bg)){var l=luminance(bg);if(l!==null)return l<128;}
      }
      return false;
    }
    function paint(){
      raf=0;if(document.body.classList.contains('nav-open'))return;
      var ld=darkSurfaceAt(logoHit),td=darkSurfaceAt(toggle);
      header.classList.toggle('nav-logo-on-dark',ld);header.classList.toggle('nav-logo-on-light',!ld);
      header.classList.toggle('nav-toggle-on-dark',td);header.classList.toggle('nav-toggle-on-light',!td);
    }
    function request(){if(!raf)raf=requestAnimationFrame(paint);}
    request();
    addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});addEventListener('orientationchange',request,{passive:true});
    if(window.visualViewport){visualViewport.addEventListener('resize',request,{passive:true});visualViewport.addEventListener('scroll',request,{passive:true});}
    document.addEventListener('visibilitychange',function(){if(!document.hidden)request();});
    document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('.nav-toggle'))setTimeout(request,0);});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
}());
