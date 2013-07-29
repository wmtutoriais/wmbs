/*
 * desenvolvidor por Welison Menezes
 * welisonmenezes@gmail.com
 */
(function( $ ){
    $.fn.wmbs = function(options) {
        var element  = $(this);
        var defaults = {
            'thumb_drag': false,
            'auto'      : true,
            'auto_time': 4000,
            'pause_hover': true,
            'has_info' : false,
            'info_style': false
        };
        var settings = $.extend(true, defaults, options);
        funcs.init_wmbs(element, settings);
    };
    var funcs = {
        init_wmbs: function(el, set){
            var el  = el;
            var set = set;
            funcs.style_thumb(el, set);
            funcs.style_screen(el, set);
            funcs.pagination(el, set);
            funcs.pagination_thumb(el, set);
            if( set.thumb_drag === true ) funcs.drag_move_thumb(el, set);
            funcs.get_by_link(el, set);
            funcs.default_img(el, set);
            funcs.temp_auto(el, set);
        },
        default_img: function(el, set){
            // get elementes
            var obj_thumb    = funcs.get_elements_thumb(el, set);
            var screen_box   = el.children().eq(0);
            var ul_thumb     =  el.children().eq(1).find('ul');
            var lis_thumb    = ul_thumb.find('li');
            var a_thumb      = lis_thumb.find('a').eq(0);

            // insert image default
            funcs.effects.fade(el, set, a_thumb.attr('href'), a_thumb.attr('title'), screen_box, obj_thumb);
        },
        pagination: function(el, set){
            var sel_n = new String(set.pagination.next);
            var sel_p = new String(set.pagination.prev);
            var next  = $('.'+sel_n);
            var prev  = $('.'+sel_p);

            var quant_img  = el.children().eq(1).find('ul').find('img').length;
            var cont       = 1;

            // next
            next.click(function(){
                var obj_thumb = funcs.get_elements_thumb(el, set);
                var ind       = obj_thumb.a_index;
                var ele       = obj_thumb.active.parent().width();
                var ani       = (ele * ( ind + 1 ));
                ani           = Math.round( ani );

                if( cont >= quant_img || quant_img == (obj_thumb.a_index+1) ){
                    funcs.transition(el, set, 'left', 'last', ani);
                    cont = 1;
                    return false;
                }
                funcs.transition(el, set, 'left', undefined, ani);
                cont++
                return false;
            });

            // prev
            prev.click(function(){
                var obj_thumb = funcs.get_elements_thumb(el, set);
                var ind       = obj_thumb.a_index;
                var ele       = obj_thumb.active.parent().width();
                var ani       = (ele * ( ind + 1 )) - (ele * 2);
                ani           = Math.round( ani );

                if( cont <= 1 && obj_thumb.a_index == 0 ){
                    funcs.transition(el, set, 'left', 'first', ani);
                    cont = quant_img-1;
                    return false;
                }
                funcs.transition(el, set, 'right', undefined, ani);
                cont--;
                return false;
            });
        },
        pagination_thumb: function( el, set ){
            var sel_n = new String(set.pagination_thumb.next);
            var sel_p = new String(set.pagination_thumb.prev);
            var prev  = $('.'+sel_n);
            var next  = $('.'+sel_p);

            var obj_thumb = funcs.get_elements_thumb(el, set);

            // get size img thumb
            var img_w      = obj_thumb.img_thumb.outerWidth(true);
            var total_w    = ( obj_thumb.lis_thumb.length * img_w );
            var ani        = ( set.box_thumb_size.w * img_w );
            ani            = Math.round( ani );

            prev.click(function(){
                var offset = obj_thumb.ul_thumb.position().left;
                var c_o    = ( total_w - (img_w * set.box_thumb_size.w) ) * -1;
                if( ! (offset <= c_o) ){
                    obj_thumb.ul_thumb.animate({"left": '-='+ani+'px'}, 'fast');
                }
                return false;
            });

            next.click(function(){
                var offset = obj_thumb.ul_thumb.position().left;
                var c_o    = (img_w * set.box_thumb_size.w) * -1;
                if( offset <= c_o ){
                    obj_thumb.ul_thumb.animate({"left": '+='+ani+'px'}, 'fast');
                }
                else if( offset <= 0 ){
                    obj_thumb.ul_thumb.animate({"left": '0px'}, 'fast');
                }
                return false;
            });
        },
        transition: function(el, set, direciton, posi, ani){
            var p = ( typeof posi !== 'undefined' && posi !== false ) ? posi : false;
            var a = ( typeof ani !== 'undefined' && ani !== false ) ? ani : false;

            var obj_thumb = funcs.get_elements_thumb(el, set);

            // get size img thumb
            var img_w      = obj_thumb.img_thumb.outerWidth(true);

            var total_w    = ( obj_thumb.lis_thumb.length * img_w ) - img_w;

            if( p === false ){
                if( direciton == 'left' ){
                    funcs.get_active(el, set, 'left', p);
                    obj_thumb.ul_thumb.animate({"left": '-'+a+'px'}, 'fast');
                }
                if( direciton == 'right' ){
                    funcs.get_active(el, set, 'right', p);
                    obj_thumb.ul_thumb.animate({"left": '-'+a+'px'}, 'fast');
                }
            }
            if( p == 'last' ){
                funcs.get_active(el, set, '', p);
                obj_thumb.ul_thumb.animate({"left": '0px'}, 'fast');
            }
            if( p == 'first' ){
                funcs.get_active(el, set, '', p);
                obj_thumb.ul_thumb.animate({"left": '-'+total_w+'px'}, 'fast');
            }
        },
        get_by_link: function(el, set){
            var obj_thumb = funcs.get_elements_thumb(el, set);
            obj_thumb.a_thumb.each(function(index){
                var index = index;
                var t     = $(this);
                t.click(function(){
                    var t_index = obj_thumb.a_thumb.index( $(this) );
                    obj_thumb.lis_thumb.removeClass(''+obj_thumb.active_thumb);
                    $(this).parent().addClass(''+obj_thumb.active_thumb);
                    var obj_thumb_2 = funcs.get_elements_thumb(el, set);
                    var ind         = obj_thumb_2.a_index;
                    var ele         = obj_thumb_2.active.parent().width();
                    var ani         = (ele * ( ind + 1 )) - ele;
                    ani             = Math.round( ani );
                    funcs.get_screen(el, set);
                    obj_thumb.ul_thumb.animate({"left": '-'+ani+'px'}, 'fast');
                    return false;
                });
            });
        },
        auto_thumb: function(el, set, c){
            var c = ( typeof c !== 'undefined' && c !== false ) ? c : false;

            var obj_thumb = funcs.get_elements_thumb(el, set);
            var total     = obj_thumb.lis_thumb.length;
            var ind       = obj_thumb.a_index;
            var ele       = obj_thumb.active.parent().width();
            var ani       = (ele * ( ind + 1 )) ;
            ani           = Math.round( ani );
  
            if( c === true ){
                if( (ind + 1) == total ){
                    funcs.transition(el, set, 'left', 'last', ani);
                }else{
                    funcs.transition(el, set, 'left', undefined, ani);
                }
            }
        },
        temp_auto: function(el, set){
            // auto timer
            if( set.auto === true ) {
                var t = window.setInterval(function() {
                    funcs.auto_thumb(el, set, true);
                }, set.auto_time);
                // stop in hover
                if( set.pause_hover === true ){
                    el.hover(function(){
                        window.clearTimeout(t);
                    },function(){
                        t = window.setInterval(function() {
                            funcs.auto_thumb(el, set, true);
                        }, set.auto_time);
                    });
                } 
            }
        },
        get_active: function(el, set, orientation, posi){
            p = posi;

            var obj_thumb = funcs.get_elements_thumb(el, set);

            obj_thumb.lis_thumb.removeClass(''+obj_thumb.active_thumb);

            if( p === false ){
                if( orientation == 'left' ){
                    obj_thumb.active.parent().next().addClass(''+obj_thumb.active_thumb);
                    funcs.get_screen(el, set);
                }
                if( orientation == 'right' ){
                    obj_thumb.active.parent().prev().addClass(''+obj_thumb.active_thumb);
                    funcs.get_screen(el, set);
                }
            }
            if( p == 'last' ){ 
                obj_thumb.ul_thumb.find('li').eq(0).addClass(''+obj_thumb.active_thumb);
                funcs.get_screen(el, set);
            }
            if( p == 'first' ){ 
                obj_thumb.ul_thumb.find('li').last().addClass(''+obj_thumb.active_thumb);
                funcs.get_screen(el, set);
            }
        },
        get_screen: function(el, set){
            var obj_thumb    = funcs.get_elements_thumb(el, set);
            var screen_box   = el.children().eq(0);
            var obj_thumb    = funcs.get_elements_thumb(el, set);
            funcs.effects.fade(el, set, obj_thumb.active.attr('href'), obj_thumb.active.attr('title'), screen_box, obj_thumb);
        },
        effects: {
            fade: function(el, set, src, alt, box, obj_thumb){
                $('> img', box).removeClass('wmbs_img_screen').addClass('wmbs_img_del').css({
                    'z-index':'9'
                });
                $('> div', box).fadeIn('fast');

                $('<img src="'+ src +'">').load(function() {
                    var t = $(this);
                    t.css({
                        'display':'none',
                        'position':'absolute',
                        'top':'0px',
                        'left':'0px',
                        'z-index':'10'
                    }).addClass('wmbs_img_screen').attr('alt', alt);
                    
                    box.prepend( t );

                    if( set.has_info === true ){
                       var txt = funcs.insert_txt(el, set, obj_thumb)
                        box.prepend(txt); 
                        $('.wmbs_txt').fadeIn('fast');
                    }

                    t.fadeIn('fast', function(){
                        $('.wmbs_img_del').remove();
                        $('.wmbs_txt').css({'display':'block'});
                        $('> div', box).fadeOut('fast');
                    });
                });
            }
        },
        insert_txt: function(el, set, obj_thumb){
            $('.wmbs_txt').fadeOut('fast', function(){
                $(this).remove();
            });
            var active = obj_thumb.active;
            var pai    = active.parent();
            var txt  = $('span', pai).eq(0).html();
            var e_txt = $('<span></span>')
                .attr('class', 'wmbs_txt_1 wmbs_txt')
                .html(txt)
            if( set.info_style === false ){
                e_txt.css({
                    'position':'absolute',
                    'bottom':'0px',
                    'width':'100%',
                    'display':'none',
                    'z-index':'12',
                    'background':'#000',
                    'color':'#fff',
                    'padding':'5px 0px',
                    'text-align':'center'
                }).hide();
            }else{
                e_txt.css(set.info_style).hide();
            }
            return e_txt;
        },
        drag_move_thumb : function(el, set){
            var pai       = el.children().eq(1);
            var box_t     = pai.find('ul');
            var obj_thumb = funcs.get_elements_thumb(el, set);
            var total     = obj_thumb.lis_thumb.length;
            var wid       = obj_thumb.lis_thumb.outerWidth();
            box_t.draggable({  
                scroll: false,
                axis: "x",
                iframeFix: true,
                start: function( event, ui ) {
                    box_t.find('a').unbind("click");
                    return true;
                },
                stop: function( event, ui ){
                    box_t.find('a').click(function(){
                        return false;
                    });
                    setTimeout(function() {
                        funcs.get_by_link(el, set);
                    }, 200);

                    var l = ui.position.left;
                    var i = (box_t.outerWidth() - wid) * -1;
                    var v = ( (total*wid) - wid );
                    if( (l*-1) >= v  ){
                        box_t.css({'top': 0, 'left' : i+'px'});
                    }
                    if( l > 1 ) {
                        box_t.css({'left' :'0px'}); 
                    }
                    return true;
                }
            });
        },
        get_elements_thumb: function(el, set){
            var ul_thumb     =  el.children().eq(1).find('ul');
            var lis_thumb    = ul_thumb.find('li');
            var a_thumb      = lis_thumb.find('a');
            var active_thumb = new String(set.active_thumb);
            var active       = $('.'+active_thumb+' a');
            var a_index      = a_thumb.index( active );
            var img_thumb    = el.children().eq(1).find('ul').find('img');

            var obj = {
                'ul_thumb' : ul_thumb,
                'lis_thumb': lis_thumb,
                'a_thumb': a_thumb,
                'active_thumb' : active_thumb,
                'active' : active,
                'a_index': a_index,
                'img_thumb' : img_thumb
            }

            return obj;
        },
        get_center_load: function( el , set){
            var el     = el.children().eq(0);
            var load   = $('> div', el);
            var w      = set.screen_size.w;// el.width();
            var h      = set.screen_size.h; //el.height();
            var l_w    = load.width();
            var l_h    = load.height();

            var x      = w / 2;
            var y      = h / 2;
            var l_x    = l_w / 2;
            var l_y    = l_h / 2;

            var f_x    = x - l_x;
            var f_y    = y - l_y;

            var center = {
                'x': f_x,
                'y': f_y
            }

            return center;
        },
        style_screen: function(el, set){
            var center_load = funcs.get_center_load(el, set);
            // get element
            var screen_box = el.children().eq(0);
            var load       = $('> div', screen_box);
            // styling elements
            el.css({
                'position':'relative'
            })
            screen_box.css({
                'width': set.screen_size.w+'px',
                'height': set.screen_size.h+'px',
                'margin': '0px auto',
                'overflow':'hidden',
                'position': 'relative'
            });
            load.css({
                'position': 'absolute',
                'left': center_load.x+'px',
                'top': center_load.y+'px',
                'z-index': '111'
            });
        },
        style_thumb: function(el, set){
            // get elements
            var thumb_box    = el.children().eq(1);
            var ul_thumb     = thumb_box.find('ul');
            var lis_thumb    = ul_thumb.find('li');
            var imgs_thumb   = ul_thumb.find('img');
            var img_thumb    = ul_thumb.find('img').eq(0);
            var active_thumb = new String(set.active_thumb);

            // get size img thumb
            var img_h      = img_thumb.outerHeight(true);
            var img_w      = img_thumb.outerWidth(true);

            // styling elements
            thumb_box.css({
                'overflow':'hidden',
                //'width': set.box_thumb_size.w+'px',
                'width' : (img_w * set.box_thumb_size.w) + 'px',
                'height': set.box_thumb_size.h+'px',
                'margin': '0px auto',
                'position': 'relative',
                '-moz-user-select': 'none',
                '-khtml-user-select': 'none',
                '-webkit-user-select': 'none',
                'user-select': 'none'
            });
            ul_thumb.css({
                'width': ( img_w * imgs_thumb.length )+'px',
                'height': img_h+'px',
                'position':'absolute',
                'left':'0px',
                'top':'0px'
            });
            lis_thumb.css({
                'float':'left'
            });
            lis_thumb.first().addClass(''+active_thumb);
        }
    }
})( jQuery );