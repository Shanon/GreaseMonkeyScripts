// ==UserScript==
// @name           BacklogShortcut
// @namespace      backlog_shortcut
// @include        https://shanonpj.backlog.jp/*
// ==/UserScript==

(function(){
    var addEvent = function( element, eventName, handler ){
        if( element.addEventListener ){
            element.addEventListener( eventName, handler, true );
        }
        else {
            element.attachEvent( "on" + eventName ,handler );
        }
    };

    function SaveShortcut() {
        var url = window.location.href;
        var name = window.prompt("ショートカット名を入力してください。");
        if( name.length ) {
            var max_num = GM_getValue("shortcut_num", 0);
            var next_num = max_num + 1;
            GM_setValue("href_" + next_num, url );
            GM_setValue("name_" + next_num, name );
            GM_setValue("shortcut_num", next_num );
            document.location.reload();
        }
    };
    function LoadShortcuts() {
        var list = new Array;
        for( var i = 0; i < GM_getValue("shortcut_num", 0); i ++ ) {
            list[i] = { href: GM_getValue("href_" + ( i + 1 )),
                        name: GM_getValue("name_" + ( i + 1 )) };
        }
        return list;
    };
    function DeleteShortcut( num ) {
        GM_log( 'num = ' + num );
        var max_num = GM_getValue('shortcut_num', 0);
        GM_log( 'max_num = ' + max_num );
        if( num <= max_num ) {
            for( var i = num; i < max_num; i ++ ) {
                var next = parseInt( i ) + 1;
                var href = GM_getValue('href_' + next );
                var name = GM_getValue('name_' + next );
                GM_setValue('href_' + i, href );
                GM_setValue('name_' + i, name );
            }
            GM_deleteValue('href_' + max_num );
            GM_deleteValue('name_' + max_num );
            GM_setValue('shortcut_num', ( max_num - 1 ) );
            document.location.reload();
        }
    }
    function CloseDeleteWnd() {
        var divP = document.getElementById('DelShortcutWndParent');
        if( divP ) {
            while( divP.firstChild ) {
                divP.removeChild( divP.firstChild );
            }
            divP.style.visibility='hidden';
        }
    }
    function DeleteShortcutWnd( ) {
        var divP = document.getElementById('DelShortcutWndParent');
        if( divP ) {
            while( divP.firstChild ) {
                divP.removeChild( divP.firstChild );
            }
        }
        else {
            divP = document.createElement('div');
            divP.id = 'DelShortcutWndParent';
            divP.style.width="400px";
            divP.style.height="100px";
            divP.style.position="absolute";
            divP.style.left="350px";
            divP.style.top="200px";
            divP.style.backgroundColor="#006600";
            divP.style.zIndex="98";
            divP.style.visibility='hidden';
        }
        var divH = document.createElement('div');
        divH.id = 'DelShortcutWndHead';
        divH.style.backgroundColor="#003300";
        divH.style.height="15px";
        divH.style.width="390px";
        divH.style.margin="2px";
        divH.style.padding="3px";
        divH.style.zIndex="99";
        
        divH.innerHTML = '<span style="font-size: small; color: #FFFFFF;">■ショートカット削除</span>';
        
        divP.appendChild( divH );
        
        var divC = document.createElement('div');
        divC.id = 'DelShortcutWndChild';
        divC.style.backgroundColor="#FFFFFF";
        divC.style.height="67px";
        divC.style.width="390px";
        divC.style.margin="2px";
        divC.style.padding="3px";
        divC.style.zIndex="99";
    
        divC.innerHTML = '<span style="font-size: small;">削除するショートカットを選択し、[ 削除 ]を押してください。</span><br /><hr />';
        
        var form = document.createElement('form');
        form.id  = 'form1';
        form.name = 'form1';
        
        var delList = document.createElement('select');
        delList.id = 'dellist';
        delList.name = 'dellist';
        var max_num = GM_getValue('shortcut_num', 0);
        for( var i = 1; i <= max_num; i ++ ) {
            var opt = document.createElement('option');
            opt.appendChild( document.createTextNode( GM_getValue('name_' + i, 'undefined' ) ) );
            opt.value = i;
            delList.appendChild( opt );
        }
        form.appendChild( delList );
        
        var delBtn = document.createElement('input');
        delBtn.type = 'button';
        delBtn.name = 'shortcut_del_exec';
        delBtn.value = ' 削除 ';
        delBtn.addEventListener( 'click', function() { 
            DeleteShortcut( document.getElementById('dellist').options[document.getElementById('dellist').selectedIndex].value );
        }, false );
        
        form.appendChild( delBtn );
        
        var cancelBtn = document.createElement('input');
        cancelBtn.type = 'button';
        cancelBtn.name = 'shortcut_del_cancel';
        cancelBtn.value = ' キャンセル ';
        cancelBtn.addEventListener( 'click', function() { CloseDeleteWnd(); }, false );
        form.appendChild( cancelBtn );
        
        divC.appendChild( form );
        divP.appendChild( divC );
        divP.style.visibility='visible';
        document.body.appendChild( divP );
    }
    addEvent( window, "load", function() {
        var navi = document.getElementById('naviLeft');
        if( navi ) {
            var shortcuts = LoadShortcuts();
            for( var i = 0; i < shortcuts.length; i ++ ) {
                var shortcut = document.createElement('a');
                shortcut.href = shortcuts[i].href;
                var shortcut_label = document.createElement('span');
                shortcut_label.innerHTML = shortcuts[i].name;
                shortcut.appendChild( shortcut_label );
                navi.appendChild( shortcut );
            }
            var addBtn = document.createElement('input');
            addBtn.type = 'button';
            addBtn.name = 'shortcut_add_btn';
            addBtn.value = ' 登録 ';
            addBtn.addEventListener( 'click', function() { SaveShortcut(); }, false );
            
            navi.appendChild( addBtn );
            
            var delBtn = document.createElement('input');
            delBtn.type = 'button';
            delBtn.name = 'shortcut_del_btn';
            delBtn.value = ' 削除 ';
            delBtn.addEventListener( 'click', function() { DeleteShortcutWnd(); }, false );
            
            navi.appendChild( delBtn );
        }
    
    } );
})();
