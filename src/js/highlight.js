/**
 * jquery.textarea-highlighter.js - jQuery plugin for highlighting text in textarea.
 * @version v0.6.8
 * @link https://github.com/marexandre/jquery.textarea-highlighter.js
 * @author alexandre.kirillov@gmail.com
 * @license MIT license. http://opensource.org/licenses/MIT
 */
var marexandre;!function(e){"use strict";var t=function(){function e(){}return e.prototype.orderBy=function(e,t){return e.sort(function(e,i){return parseInt(e[t],10)-parseInt(i[t],10)})},e.prototype.removeOverlapingIndecies=function(e){for(var t,i,n=[],r=0,a=e.length;a>r;r++){t=e[r];for(var o=r+1;a>o;o++)i=e[o],this.isOverlap(t,i)&&n.push(o)}return e.slice(0).filter(function(e,t){return-1!==n.indexOf(t)?!1:!0})},e.prototype.removeOverlapingIndeciesByPriority=function(e){e=e||[],e=this.orderBy(e,"priority");for(var t,i,n=[],r=0,a=e.length;a>r;r++){t=e[r];for(var o=r+1;a>o;o++)if(i=e[o],this.isOverlap(t,i)){if(t.priority<i.priority){n.push(r);break}if(t.priority===i.priority){if(!(t.end>i.end||t.start<i.start)){n.push(r);break}n.push(o)}else n.push(o)}}return e.slice(0).filter(function(e,t){return-1!==n.indexOf(t)?!1:!0})},e.prototype.isOverlap=function(e,t){return e.start<t.end&&t.start<e.end},e.prototype.flattenIndeciesList=function(e){for(var t,i,n=[],r=0,a=e.length;a>r;r++){t=e[r].type;for(var o=0,s=e[r].indecies.length;s>o;o++)i=e[r].indecies[o],n.push({start:i.start,end:i.end,type:t})}return n},e.prototype.cleanupOnWordBoundary=function(e,t,i){i=i||!0;for(var n,r,a,o,s=[],h=0,g=t.length;g>h;h++)n=t[h],r=e.slice(n.start,n.end),o=n.start-1<0?0:n.start-1,a=e.slice(o,n.end+1),i&&this.isWrappedByASCII(r)&&!this.checkWordBoundary(r,a)&&s.push(h);return t.slice(0).filter(function(e,t){return-1!==s.indexOf(t)?!1:!0})},e.prototype.makeTokenized=function(e,t){for(var i,n=[],r=0,a=0,o=0,s=t.length;s>o;o++)i=t[o],a=i.start,a>r&&n.push({value:e.slice(r,a),type:"text"}),n.push({value:e.slice(a,i.end),type:i.type}),r=i.end;return r<e.length&&n.push({value:e.slice(r,e.length),type:"text"}),n},e.prototype.checkWordBoundary=function(e,t){return new RegExp("\\b"+this.escapeRegExp(e)+"\\b").test(t)},e.prototype.isWrappedByASCII=function(e){return/^\w.*\w$|^\w+$/.test(e)},e.prototype.escapeHTML=function(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")},e.prototype.escapeRegExp=function(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},e.prototype.sanitizeBreakLines=function(e){return e.replace(/\r\n/g,"\n").replace(/\r/g,"\n")},e.prototype.getUniqueArray=function(e){return e.filter(function(e,t,i){return""===e?!1:i.indexOf(e)===t})},e.prototype.createHTML=function(e){for(var t=[],i=0,n=e.length;n>i;i++)"text"===e[i].type?t.push(e[i].value):t.push(this.getTextInSpan(e[i].type,e[i].value));return t.join("")},e.prototype.getTextInSpan=function(e,t){return'<span class="'+e+'">'+t+"</span>"},e.prototype.isRegExp=function(e){return e instanceof RegExp},e.prototype.browser=function(){var e=navigator.userAgent,t=/(msie|trident)/i.test(e),i=/chrome/i.test(e),n=/firefox/i.test(e),r=/safari/i.test(e)&&!i,a=/iphone/i.test(e);return t?{msie:!0}:i?{chrome:!0}:n?{firefox:!0}:a?{iphone:!0}:r?{safari:!0}:{msie:!1,chrome:!1,firefox:!1,safari:!1,iphone:!1}},e}();e.Helper=t}(marexandre||(marexandre={}));var marexandre;!function(e){"use strict";var t=function(){function e(e){this.list={children:{}},this.addFromArray(e||[])}return e.prototype.addFromArray=function(e){for(var t=this,i=0,n=e.length;n>i;i++)t.add(e[i])},e.prototype.add=function(e){for(var t=this,i=t.list,n=0,r=e.length;r>n;n++){var a=e[n];null==i.children[a]&&(i.children[a]={children:{},value:a,is_end:n===r-1}),i=i.children[a]}},e.prototype.hasWord=function(e){for(var t=this,i=t.list.children,n=!1,r=0,a=e.length;a>r;r++){var o=e[r],s=i.hasOwnProperty(o.toString());if(!s)break;if(i[o].is_end&&r===a-1){n=!0;break}i=i[o].children}return n},e.prototype.getIndecies=function(e){for(var t=this,i=[],n="",r=t.list,a=-1,o=-1,s=0,h=e.length;h>s;s++){n=e.slice(s);for(var g=0,p=n.length;p>g;g++){var l=n[g],d=r.children.hasOwnProperty(l.toString());if(!d)break;if(r=r.children[l],a=s,!n[g+1]){if(r.is_end){o=a+g;break}break}var c=r.children.hasOwnProperty(n[g+1].toString());if(r.is_end&&!c){o=a+g;break}}-1!==a&&-1!==o&&(i.push({start:a,end:o+1}),s=o),a=-1,o=-1,r=t.list}return i},e}();e.Trie=t}(marexandre||(marexandre={}));var marexandre;!function(e,t,i,n){"use strict";var r="textareaHighlighter",a=new marexandre.Helper,o=function(t,n){this.$element=t,this.element=this.$element[0],this.settings=e.extend({},o.DEFAULTS,this.$element.data(),n),this.$wrapDiv=e(i.createElement("div")).addClass("textarea-highlighter-wrap"),this.$backgroundDiv=e(i.createElement("div")).addClass("background-div "+this.$element.attr("class")),this.$autoSize=e('<pre><div class="autosize"></div></pre>').addClass(this.$element.attr("class")).hide(),this.$autoSizeElement=this.$autoSize.find(".autosize"),this.init()};o.DEFAULTS={wordBase:!0,caseSensitive:!0,matches:[],maxlength:-1,maxlengthWarning:"",maxlengthElement:null,isAutoExpand:!0,typingDelay:30,debug:!1},o.prototype.init=function(){for(var e=this,t=this.$element,i=this.settings,n=this.$wrapDiv,r=this.$backgroundDiv,o=0,s=i.matches.length;s>o;o++)i.matches[o].match instanceof RegExp||(i.matches[o].match=a.getUniqueArray(i.matches[o].match));e.updateStyle(),t.wrap(n).before(r),i.isAutoExpand&&t.after(e.$autoSize),e.updateHeight(),e.bindEvents(),e.highlight()},o.prototype.bindEvents=function(){var e=this,t=this.$element;if(t.data("highlighterTimerId",-1).on("scroll.textarea.highlighter",function(){e.$backgroundDiv.scrollTop(t.scrollTop())}),"onpropertychange"in e.element){var i=(new Date).getTime(),n=0,r=Math.abs;t.on("input.textarea.highlighter keyup.textarea.highlighter",function(t){n=r(i-(new Date).getTime()),n>10&&(e.change(t),i=(new Date).getTime())}),t.on("keydown.textarea.highlighter",function(t){n=r(i-(new Date).getTime()),8===t.which&&(10>n||n>250)&&(e.change(t),i=(new Date).getTime())})}else t.on("input.textarea.highlighter",function(t){e.change(t)})},o.prototype.change=function(e){var t=this;if(/(37|38|39|40)/.test(e.keyCode))return!0;t.updateHeight(),-1!==t.$element.data("highlighterTimerId")&&(clearTimeout(t.$element.data("highlighterTimerId")),t.$element.data("highlighterTimerId",-1));var i=setTimeout(function(){t.highlight()},t.settings.typingDelay);t.$element.data("highlighterTimerId",i)},o.prototype.highlight=function(){var e=this,t=e.$element.val(),i=e.settings,n="",r="";0<i.maxlength?(i.maxlength<t.length&&(n=t.slice(i.maxlength,i.maxlength+t.length-1),n=a.escapeHTML(n),n=a.getTextInSpan(i.maxlengthWarning,n)),e.updateCharLimitElement(t),r=t.slice(0,i.maxlength)):r=t,r=a.escapeHTML(r),r=e.getHighlightedContent(r),e.$backgroundDiv.html(r+n),e.updateHeight(),e.$element.trigger("textarea.highlighter.highlight")},o.prototype.getHighlightedContent=function(e){for(var t,i,n=this,r=n.settings.matches,o=[],s=[],h=0,g=r.length;g>h;h++){t=r[h],t._trie||(t._trie=new marexandre.Trie,a.isRegExp(t.match)||(s=t.match,n.addMatchesToTrie(t._trie,s))),a.isRegExp(t.match)&&(s=a.getUniqueArray(e.match(t.match)||[]),n.addMatchesToTrie(t._trie,s));var p=n.settings.caseSensitive?e:e.toLowerCase();i=t._trie.getIndecies(p),i=a.removeOverlapingIndecies(i),o.push({indecies:i,type:t.matchClass})}var l=a.flattenIndeciesList(o);return l=a.orderBy(l,"start"),l=a.removeOverlapingIndecies(l),l=a.cleanupOnWordBoundary(e,l,n.settings.wordBase),a.createHTML(a.makeTokenized(e,l))},o.prototype.addMatchesToTrie=function(e,t){for(var i=this,n=0,r=t.length;r>n;n++){var o=i.settings.caseSensitive?t[n]:t[n].toLowerCase();e.add(a.escapeHTML(o))}},o.prototype.updateCharLimitElement=function(e){var t=this,i=t.settings;if(null!==i.maxlengthElement){var n=i.maxlength-e.length;0>n?i.maxlengthElement.hasClass(i.maxlengthWarning)||i.maxlengthElement.addClass(i.maxlengthWarning):i.maxlengthElement.hasClass(i.maxlengthWarning)&&i.maxlengthElement.removeClass(i.maxlengthWarning),i.maxlengthElement.text(n)}},o.prototype.updateMatches=function(e){var t=this;t.settings.matches=e,t.highlight()},o.prototype.updateStyle=function(){var e=this,t=this.$element,i=this.settings,n={paddingTop:parseInt(t.css("padding-top"),10),paddingRight:parseInt(t.css("padding-right"),10),paddingBottom:parseInt(t.css("padding-bottom"),10),paddingLeft:parseInt(t.css("padding-left"),10)};a.browser().iphone&&(n.paddingRight+=3,n.paddingLeft+=3),this.$wrapDiv.css({position:"relative"}),this.$backgroundDiv.css({position:"absolute",height:"100%","font-family":"inherit",color:i.debug?"#f00":"transparent","padding-top":n.paddingTop,"padding-right":n.paddingRight,"padding-bottom":n.paddingBottom,"padding-left":n.paddingLeft}),e.cloneCSSToTarget(e.$backgroundDiv),i.isAutoExpand&&(e.$autoSize.css({top:0,left:0,"font-family":"inherit",position:"absolute","padding-top":n.paddingTop,"padding-right":n.paddingRight,"padding-bottom":n.paddingBottom,"padding-left":n.paddingLeft}),e.cloneCSSToTarget(e.$autoSize)),t.css({color:i.debug?"rgba(0,0,0,0.5)":"inherit",position:"relative",background:"none"})},o.prototype.updateHeight=function(){var e=this;if(e.settings.isAutoExpand){e.$autoSizeElement.html(a.escapeHTML(a.sanitizeBreakLines(e.$element.val()))+" ");var t=e.$autoSize.height();a.browser().firefox&&(t+=1),e.$element.height()!==t&&(e.$element.height(t),e.$backgroundDiv.height(t))}},o.prototype.cloneCSSToTarget=function(t){var i=this.$element,n=["lineHeight","textDecoration","letterSpacing","fontSize","fontStyle","fontWeight","textTransform","textAlign","direction","wordSpacing","fontSizeAdjust","wordWrap","word-break","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth","boxSizing","webkitBoxSizing","mozBoxSizing","msBoxSizing"],r=null;e.each(n,function(e,n){r=i.css(n),t.css(n)!==r&&t.css(n,r)})},o.prototype.destroy=function(){e.data(this.element,"plugin_"+r,!1),this.$backgroundDiv.remove(),this.$autoSize.remove(),this.$element.data("highlighterTimerId",-1).off("scroll.textarea.highlighter").off("input.textarea.highlighter").off("keyup.textarea.highlighter").off("propertychange.textarea.highlighter").attr("style","").unwrap()},o.prototype.debugModeOn=function(){this.settings.debug=!0,this.$backgroundDiv.css({color:"#f00"}),this.$element.css({color:"rgba(0,0,0,0.5)"})},o.prototype.debugModeOff=function(){this.settings.debug=!1,this.$backgroundDiv.css({color:"transparent"}),this.$element.css({color:"inherit"})},e.fn.textareaHighlighter=function(t){var i=arguments;return this.each(function(){var n=e(this),a=n.data(r),s="object"==typeof t&&t;if(t&&(a||"string"!=typeof t)&&(a||(a=new o(n,s),n.data(r,a)),"string"==typeof t)){if(!a[t])throw"Unknown method: "+t;a[t].apply(a,Array.prototype.slice.call(i,1))}})}}(jQuery,window,document);