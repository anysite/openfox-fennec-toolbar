/**
 * JavaScript for FennecToolbar Menu
 */
(function (mw, $) {
   
    mw.fennecToolbar = {
        getCreateUrlByFormTitle : function(titleOfPageType, titleOfCreatedPage, callback){
            var entry = null,
                allEntries = mw.config.get('wgFennecToolbarNamespacesAndTemplates');
            for(var i = 0; i < allEntries.length; i++){
                var loopEntry = allEntries[ i ];
                if( loopEntry.title === titleOfPageType){
                    entry = loopEntry;
                }
            }
            if(!entry){
                callback ( null );
            }
            else{
                mw.fennecToolbar.getCreateUrl(titleOfCreatedPage, entry.form, entry.namespace, callback);
            }
        },
        getCreateUrl : function(titleOfCreatedPage, form, namespace, callback){
            
            var allData = {},
                toolbarHook = new mw.hook( 'FennecToolbar' );

            allData.formName = form;
            allData.namespace = namespace;
            allData.wgServer = location.hostname;
            if( !/http/.test(allData.wgServer) ){
                allData.wgServer = location.protocol + '//' + allData.wgServer + (location.port  ? ':' + location.port : '');
              }
                 //mw.config.get( 'wgServer' ) could be localhost:8000 for example
                 //mw.config.get( 'wgServer' ),
            allData.wgPagePath = mw.config.get( 'wgArticlePath' ).replace('$1', ''),
            allData.pageName = (allData.namespace ? allData.namespace + ':' : '') + titleOfCreatedPage;
            mw.fennecToolbar.calcPath( allData );  
            
            allData.fullUrl = mw.fennecToolbar.getFullUrl(allData);//wgServer + wgPagePath + linkPath;
            toolbarHook.fire( allData );
            setTimeout(function(){
                callback( allData );
            },200);
        },
        calcPath: function(allData){
            if(allData.formName){
                allData.linkPath = ["Special:FormEdit",allData.formName,allData.pageName].join('/')
            }
            else{
                allData.linkPath =allData.pageName;
                allData.query = ['veaction=edit'];
            }
        },
        getFullUrl: function(allData){
            var url = allData.wgServer + allData.wgPagePath + allData.linkPath;
            if(allData.query && allData.query.length){
                url += '?' + allData.query.join('&')
            }
            return url;
        }
    };

   if(!window.fennecInited){
        window.fennecInited = true;
   }
   else{
       console.log('loaded twice!');
       return;
   }
   var getKey = function (array, value) {
        for (var key in array) {
            val = array[key];
            if (key == value) {
                return val;
                break;
            }
        }
        return -999;
    };

    var isVisualEditorNotActiveted = function () {

        if (window.location.href.indexOf("veaction") === -1) {
            return true;
        } else {
            return false;
        }
    };

    function loadFennecToolbar() {
        var editTitle = {};

        /////////////////////////////////////////////////////////////////////////
        // $("").on("click", "", function (e) {

        //     e.preventDefault();
        //     if (isVisualEditorNotActiveted()) {

        //         var dialog = bootbox.dialog({
        //             title: 'צור פריט',
        //             message:
        //             "<form name=\"createbox\"  id=\"form_crate_item\" action=\"action_link\" method=\"get\" class=\"\" >" +
        //             " "+
        //             "" +
        //             "" +
        //             "<input size=\"30\"  id=\"formInput_Item\" placeholder=\"הכנס את שם הפריט\" autofocus=\"\" class=\"formInput input-item-name zero-padding  pull-right col-xl-7\" name=\"page_name\"> "+
        //             "" +
        //             "<select class=\"form-control col-xl-4 zero-padding \" id=\"newItemForm\">\"<option disabled selected value> -- בחר סוג פריט -- </option>+\"</select>" +
        //             "" +""+
        //             "<input id=\"form_id\" type=\"hidden\" value=\"\" name=\"form\">" +
        //             "<input id=\"namespace_id\" type=\"hidden\" value=\"\" name=\"namespace\">" +
        //             "" +
        //             ""+"<span id='error_item' class='pull-left'> </span>" +
        //             "<input type=\"submit\" id=\"input_button_1\" class=\"forminput_button float-right \"  value=\"יצירת פריט\"> " +
        //             "</form>" +
        //             "" +
        //             " "+
        //             "" +
        //             "<script>" +
        //             "var option =\"\";" +
        //             "for (i=0 ; i< wgFennecToolbarNamespacesAndTemplates.length; i++){" +
        //             "option += '<option value=\"' + wgFennecToolbarNamespacesAndTemplates[i]['namespace'] + '#' + wgFennecToolbarNamespacesAndTemplates[i]['form'] + '\">' + wgFennecToolbarNamespacesAndTemplates[i]['title'] + '</option>';" +
        //             "}" +
        //             "$(\"#newItemForm\").append(option);" +
        //             "$(document).on(\"change\", \"#newItemForm\", function(){"
        //             +
        //             "$('#namespace_id').val(this.value.split('#')[0]);"+
        //             " $('#form_id').val(this.value.split('#')[1]);" +
        //             "});" +

        //             "</script>" ,
        //             buttons: {
        //                 cancel: {
        //                     label: mw.msg("modal-cancel-button") + ' <i class="fa fa-times"></i>'
        //                 }
        //             },
        //         });

        //         $( "#form_crate_item" ).submit(function( event ) {
        //             $("#newItemForm").css({"border" : "1px solid #ccc"});
        //             if ( $('#namespace_id').val()  === "" ) {
        //                 $( "#error_item" ).text("נא למלא את כל שדות  ").show();
        //                 $("#newItemForm").css({"border" : "1px solid red"});

        //                 return false;
        //             }
        //             if ( $( "#formInput_Item" ).val() === "" ) {
        //                 $( "#error_item" ).text("נא למלא את כל שדות  ").show();
        //                 $("#formInput_Item").css({"border" : "1px solid red"});
        //                 return false;
        //             }
        //             var  wgServer = mw.config.get( 'wgServer' );
        //             var  wgPagePath = mw.config.get( 'wgArticlePath' ).replace('$1', '');
        //             var action_link = wgServer+wgPagePath+"%D7%9E%D7%99%D7%95%D7%97%D7%93:%D7%AA%D7%97%D7%99%D7%9C%D7%AA_%D7%98%D7%95%D7%A4%D7%A1";
        //             $('#form_crate_item').attr('action', action_link)
        //             return true;
        //             event.preventDefault();
        //         });
        //     }
        // });

        /////////////////////////////////////////////////////////////////////

        $(document).on("blur", "#md-fab-menu", function (e) {
            e.preventDefault();

            if (isVisualEditorNotActiveted()) {
                $('#md-fab-menu').attr('data-mfb-state', 'close');
            }
        });

        ////////////////////////////////////////////////////////////////////
        $(document).on("click", "#create_toggle,#create_toggle2", function (e) {
            e.preventDefault();
            if (isVisualEditorNotActiveted()) {
                var $html = $('<div>'),
                    $form  = $('<form>').attr({
                        name:"createbox",
                        id:"form-create-item",
                        action:"action_link",
                        method:"get",
                    }),
                    $name = $('<input>').attr({
                        size:"30",
                        id:"formInput_Item",
                        placeholder:mw.msg('spni-insert-item-name'),
                        class : "formInput input-item-name float-right col-sm-12 col-md-7",
                        name:"page_name",
                        type:"text"
                    }),
                    $type = $('<select>').attr({
                        id:"newItemForm",
                        name:"newItemForm",
                        class : "form-control col-md-4 col-sm-12",
                    }),
                    $form_input = $('<input>').attr({
                        id:"form_id",
                        name:"form",
                        type:"hidden"
                    }),
                    $namespace = $('<input>').attr({
                        id:"namespace_id",
                        name:"namespace",
                        type:"hidden"
                    });
                $
                $form.append($type)
                    .append($name)
                    .append($form_input)
                    .append($namespace)
                    .append("<span id='error_item' class='pull-left'> </span>");
                //$type.append('<option disabled selected value> -- ' + mw.msg("modal-choose-item-type") + ' -- </option>')   
                var allNamespacesAndTemplates = mw.config.get('wgFennecToolbarNamespacesAndTemplates');
                for (i=0 ; i< allNamespacesAndTemplates.length; i++){
                    var item = allNamespacesAndTemplates[i];
                    $type.append('<option value="' + item.namespace + '#' + item.form + '">' + item.title + '</option>');                
                }
                $type.bind("change",function(){
                    $namespace.val(this.value.split('#')[0]);
                    $form_input.val(this.value.split('#')[1]);
                });
                var dialog = bootbox.dialog({
                    title: mw.msg("modal-create-button"),
                    message:$form,
                    buttons: {
                        cancel: {
                            label: mw.msg("modal-cancel-button") + ' <i class="fa fa-times"></i>'
                        },
                        // ,
                        save: {
                            label: mw.msg("modal-create-button"),
                            className: "create-new-item-submit",
                            callback: function(){
                                $form.submit();
                            }
                            
                        }
                        
                    }
                });
                
                $form.submit(function( event ) {
                    var select = $( "#newItemForm" ),
                        option = select.find('option[value="' + select.val() + '"]').get(0),
                        textChosen = option ? option.innerText : ''; 
                    mw.fennecToolbar.getCreateUrlByFormTitle(textChosen,$name.val(), function( allData ){
                        //console.log(allData,"allData");
                        location.href = allData.fullUrl;
                    });
                    return false;
                });
            }

        });

        /////////////////////////////////////////////////////////////////////////

        $(document).on("click", "#f-purge", function (e) {
            //$.simplyToast(mw.msg("fennec-toolbar-purge-start"), 'success'); 
            var pageName = mw.config.get('wgPageName'),
                failed = function(){
                    $.simplyToast(mw.msg("fennec-toolbar-purge-error"), 'error'); 
                }
            ApiReloadPurge( pageName, function(success){
                //console.log(success, 'success')
                if( success ){
                    $.simplyToast(mw.msg("fennec-toolbar-purge-success"), 'success'); 
                    location.reload();
                }
                else{
                    failed();
                }
            }, failed);
            return false;

        });
        $(document).on("click", "#ve_edit_toggle", function (e) {
            e.preventDefault();

            if (isVisualEditorNotActiveted()) {
                // pageName also include the namespace.
                var pageName = mw.config.get('wgPageName');

                var veLinkTarget =
                    wgScript + "?title=" + pageName + "&veaction=edit";
                window.location = veLinkTarget;
                //$('#md-fab-menu .mfb-component__button--main').css('background-color', '#7d7c7c');
                //$('#md-fab-menu .mfb-component__button--main').css('cursor','not-allowed');
            }
        });

        /////////////////////////////////////////////////////////////////////////

        $(document).on("click", "#rename_item", function (e) {
            e.preventDefault();
            ApiCheckUserInfo(function (res) {
                var currentUserInfoList = res.query.userinfo.rights;
                var isCurrentUserCanDelete = _.contains(currentUserInfoList, "delete");

                // Check if the current page is special page.
                // Or user is not currently editing a page using VisualEditor
                console.log(currentUserInfoList,'currentUserInfoList');
                if (!$('body').hasClass("ns-special") && isVisualEditorNotActiveted()) {
                    var pageTitle = mw.config.get('wgTitle');
                    // pageName also include the namespace.
                    var pageName = mw.config.get('wgPageName');
                    var pageNamespaceId = mw.config.get('wgNamespaceNumber');
                    var pageCategories = mw.config.get('wgCategories');

                    editTitle = {
                        title: pageTitle,
                        namespaceId: pageNamespaceId,
                        isEdit: true,
                        selectedCategories: pageCategories,
                        pageName: pageName //,
                        // isUserCanDelete: isCurrentUserCanDelete
                    };

	                loadEditPageNameModal(editTitle);
                }
            });
        });


        $(document).on("click", "#menu-btn-tags", function (e) {
            e.preventDefault();
            ApiCheckUserInfo(function (res) {
                var currentUserInfoList = res.query.userinfo.rights;
                var isCurrentUserCanDelete = _.contains(currentUserInfoList, "delete");

                // Check if the current page is special page.
                // Or user is not currently editing a page using VisualEditor
                if (!$('body').hasClass("ns-special") && isVisualEditorNotActiveted()) {
                    var pageTitle = mw.config.get('wgTitle');
                    // pageName also include the namespace.
                    var pageName = mw.config.get('wgPageName');
                    var pageNamespaceId = mw.config.get('wgNamespaceNumber');
                    var pageCategories = mw.config.get('wgCategories');

                    editTitle = {
                        title: pageTitle,
                        namespaceId: pageNamespaceId,
                        isEdit: true,
                        selectedCategories: pageCategories,
                        pageName: pageName //,
                        // isUserCanDelete: isCurrentUserCanDelete
                    };

	                LoadCreateOrEditCategoriesModal(editTitle);
                }
            });
        });

        /////////////////////////////////////////////////////////////////////////


        /////////////////////////////////////////////////////////////////////////

    }
    ;

    $(function () {

        var buttonsMenuData = {
            "menu-id": "md-fab-menu",
            "menu-location": "bl", // bottom-left
            "menu-toggle-event": "click",
            "main-button": [
                {
                    "href": "#",
                    "bg-color": isVisualEditorNotActiveted() ? "#d23f31" : "#7d7c7c",
                    "label": mw.msg('create-toggle-popup'),
                    "resting-id": "menu_toggle",
                    "resting-class-icon": "material-icons",
                    "resting-icon": "menu",
                    "active-id": "create_toggle",
                    "active-class-icon": "material-icons",
                    "active-icon": "add"
                }
            ],
            "menu-items": [
                {
                    "id": "quick_edit_toggle",
                    "href": "#",
                    "label": mw.msg("quick-edit-toggle-popup"),
                    "bg-color": "#4CAF50",
                    "class-icon": "material-icons",
                    "icon": "style"
                },
                {
                    "id": "files_toggle",
                    "href": "#",
                    "label": mw.msg("files-toggle-popup"),
                    "bg-color": "#ffa726",
                    "class-icon": "material-icons",
                    "icon": "perm_media"
                },
                {
                    "id": "ve_edit_toggle",
                    "href": "#",
                    "label": mw.msg("edit-toggle-popup"),
                    "bg-color": "#2196F3",
                    "class-icon": "material-icons",
                    "icon": "mode_edit"
                }
            ]
        };

        MaterialAddFAB("", "");
        
        loadFennecToolbar();
    });

}(mediaWiki, jQuery));