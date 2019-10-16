//don't send a request immediately, wait until the user is done typing their note
export default function debounce(a,b,c){
  var d,e;
  return function(){
    function h(){
      d=null;
      c||(e=a.apply(f,g));
    }
    var f=this,g=arguments;
    return (clearTimeout(d),d=setTimeout(h,b),c&&!d&&(e=a.apply(f,g)),e)
  }
}

//don't show html tags; just see plain text
export function removeHTMLTags (str) {
  return str.replace(/<[^>]*>?/gm, '');
};