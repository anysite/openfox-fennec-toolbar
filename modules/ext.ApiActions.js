fabApi = {};

/**
 * JavaScript for FennecToolbar API Actions
 */
(function (mw, $) {

    var api = new mw.Api();
    var params = "";

    /**
    * Callback function in case api fail.
    */
    mw.openConfirm = function(title, yesLabel, noLabel, callback){ 
        var messageDialog = new OO.ui.MessageDialog(),
            windowManager = new OO.ui.WindowManager();
        $( 'body' ).append( windowManager.$element );

        windowManager.addWindows( [ messageDialog ] );
        windowManager.openWindow( messageDialog, {
          title: title,
          actions: [
            {
              action: 'accept',
              label: yesLabel,
              flags: 'primary'
            }, {
              action: 'decline',
              label: noLabel,
              flags: 'primary'
            }
          ]
        }).closed.done(function(data){
            callback('accept' === data.action)
        });
    }
    var failFunc = function (code, result) {
        if (code === "http") {
            mw.log("HTTP error: " + result.textStatus); // result.xhr contains the jqXHR object
        } else if (code === "ok-but-empty") {
            mw.log("Got an empty response from the server");
        } else {
            mw.log("API error: " + code);
        }
    };
    
    /**
     * API Check Is Selected Title Is Vaild.
     */
    var checkIsTitleVaild = function (title, callbackFunc) {
        
        api.get({
            formatversion: 2,
            action: 'query',
            prop: 'pageprops',
            titles: title
        }).done(callbackFunc).fail(failFunc);  
    };

    /**
     * API load wiki text and categories from template page.
     */
    var loadTemplatePageWikiTextAndCategories = function (pageTitle, callbackFunc) {

        api.get({
            formatversion: 2,
            action: 'parse',
            prop: 'categories|wikitext',
            page: pageTitle,
            utf8: true
        }).done(callbackFunc).fail(failFunc);
    };
    
    /**
     * API load wiki text and categories from template page.
     */
    var loadSelectedTemplateCategories = function (templateTitle, callbackFunc) {
        api.get( {
            formatversion: 2,
            action: 'parse',
            prop: 'categories',
            page: templateTitle,
            utf8: true
        } ).done(callbackFunc).fail(failFunc);
    };

    /**
     * API load wiki text and categories from template page.
     */
    var loadCategoriesData = function(callbackFunc) {
        api.get({
            formatversion: 2,
            action: 'query',
            prop: 'categories',
            aclimit: 5000,
            list: 'allcategories'
        }).done(callbackFunc).fail(failFunc);
    };
    
    /**
     * API check current user info.
     */
    var checkUserInfo = function(callbackFunc) {       
        api.get({
            formatversion: 2,
            action: 'query',
            meta: 'userinfo',
            uiprop: 'rights'
        }).done(callbackFunc).fail(failFunc);
    };
    
    /**
     * API create new page with context.
     */
    var editOrCreateNewPageWithContext = function(pageTitle, content, isNewPage) {
        var textMessage = mw.msg("create-page-redirect-to-edit");
        var titleMessage = mw.msg("edited-successfully");

        if(isNewPage) {
            titleMessage = mw.msg("created-successfully");
        }
        
        api.postWithEditToken($.extend({
            action: 'edit',
            title: pageTitle,
            text: content,
            formatversion: '2',
            contentformat: 'text/x-wiki',
            contentmodel: 'wikitext',
            // Protect against errors and conflicts
            assert: mw.user.isAnon() ? undefined : 'user',
            createonly: false
        }, params)).done(function () {
            
            if (isNewPage){                
                swal( {
                    title: titleMessage,
                    text: textMessage,
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: mw.msg("modal-continue-to-page"),
                    cancelButtonText: mw.msg("modal-close-button"),
                    buttonsStyling: true
                } ).then(function () {
                    window.location.href = wgScript + "?title=" + pageTitle + "&veaction=edit";                
                }, function (dismiss) {
                    // dismiss can be 'cancel', 'overlay',
                    // 'close', and 'timer'                
                    window.location.reload(true);
                } );
            } else {
                $.simplyToast(titleMessage, 'success'); 

                setTimeout(function(){
                    window.location.href = "/" + pageTitle;
                    window.location.reload(true);
                }, 1500);
            }
        }).fail(failFunc);  
    };
    
    /**
     * API Move / Rename page.
     */
    var renamePage = function(pageTitle, oldTitle, dontLeaveCopy, callbackFunc) {
        // console.error("dsdsd", dontLeaveCopy);
        // return;
        if(dontLeaveCopy && 'function' == typeof dontLeaveCopy){
            callbackFunc = dontLeaveCopy;
            dontLeaveCopy= false;
        }
        api.postWithEditToken($.extend({
            action: 'move',
            from: oldTitle,
            to: pageTitle,
            noredirect: dontLeaveCopy,
            formatversion: '2',
            // Protect against errors and conflicts
            assert: mw.user.isAnon() ? undefined : 'user'
        }, params)).done(callbackFunc).fail(failFunc);        
    };

	/**
     * API load all flies data.
     */
    var loadAllImageData = function(callbackFunc, apiContinue="") {
        /*
		/w/api.php?action=query&format=json&prop=imageinfo&generator=allimages&utf8=1&iiprop=url&iiurlwidth=100&gaimime=image/bmp|image/gif|image/jpeg|image/png|image/svg+xml|image/tiff|image/vnd.djvu|image/vnd.microsoft.icon|image/webp|image/x-icon|image/x-ms-bmp&gailimit=5000
		
        "image/bmp|image/gif|image/jpeg|image/png|image/svg+xml|image/tiff|image/vnd.djvu|image/vnd.microsoft.icon|image/webp|image/x-icon|image/x-ms-bmp"
        */
        var apiConfig = {
            formatversion: 2,
            action: 'query',
            ailimit: 5000,
            list: 'allimages',
            utf8: true,
            aisort: 'timestamp',
            aidir: 'descending',
            aiprop: 'url|comment|timestamp|user'
        };
        if(apiContinue) {
            apiConfig["aicontinue"] = apiContinue.aicontinue;
        }
        api.get(apiConfig).done(callbackFunc).fail(failFunc);
    };
	
    /**
     * API load all flies data.
     */
    var loadAllFilesData = function(callbackFunc, apiContinue="") {
        /*
/w/api.php?action=query&format=json&prop=imageinfo|fileusage&generator=allimages&utf8=1&iiprop=timestamp|user|url|comment|mime&fuprop=title&fushow=!redirect&fulimit=500&gailimit=5000
        */
        var apiConfig = {
            formatversion: 2,
            action: 'query',
			prop: 'imageinfo|fileusage',
			generator: 'allimages',
            gailimit: 5000,
			fulimit: 5000,
            utf8: true,
			fuprop: 'title',
            iiprop: 'url|comment|timestamp|user'
        };
        if(apiContinue) {
            apiConfig["fucontinue"] = apiContinue.fucontinue;
        }

        api.get(apiConfig).done(callbackFunc).fail(failFunc);
    };
    
    /**
     * API reload pages use purges.
     */
    var reloadPurge = function( formatedTitles, callbackFunc, failFunc ) {
        api.post({
            formatversion: 2,
            action: 'purge',
            titles: formatedTitles,            
            forcelinkupdate: true,
            utf8: true
        }).done(callbackFunc).fail(failFunc);
    };

    /**
     * We cant do it by API, so we will use iframe.
     */
    var reloadPurgeByIframe = function( callbackFunc ) {
        var purgeUrl = location.origin + mw.config.get('wgScriptPath') + '/index.php?title=' + mw.config.get('wgPageName') + '&action=purge';
            iFrame = $('<iframe>').css({height: '1px', width:'1px', position:'absolute', top : '-1000px'}).attr('src', purgeUrl);
        
        iFrame.on('load', function(){
                var bodyIframe = $(this.contentWindow.document.body);
                iFrame.off('load').on('load', function(){
                    //check if we got back to page
                    var success = !this.contentWindow.document.search;
                    callbackFunc( success );
                    iFrame.remove();
                                    
                });
                //trigger form
                //console.log(bodyIframe.find('#mw-content-text .oo-ui-buttonElement-button'))
                bodyIframe.find('#mw-content-text .oo-ui-buttonElement-button').trigger('click');
            });
            $('body').append(iFrame)
            
    };
    
    /**
     * API delete page.
     */
    var deletePage = function( pageTitle, reason ) {
        var modalMsg = '[' + pageTitle + ']' + mw.msg("modal-delete-message"),
            paramstoSend = {
                action: 'delete',
                title: pageTitle,
                formatversion: '2',
                // Protect against errors and conflicts
                assert: mw.user.isAnon() ? undefined : 'user'
            };
        if( reason ){
            paramstoSend.reason = reason;
        }
        api.postWithEditToken($.extend(paramstoSend, params)).done(function () {
            
            reloadPurge(pageTitle, function () {                    
                window.location.reload(true);                
                swal(
                    mw.msg("modal-delete-title"),
                    modalMsg
                );
            });

        }).fail(failFunc);
    };
    
    /**
     * API load page wiki text .
     */
    var loadPageWikiText = function ( pageTitle, callbackFunc ) {
        api.get({
            formatversion: 2,
            action: 'parse',
            prop: 'wikitext',
            page: pageTitle,
            utf8: true
        }).done(callbackFunc).fail(failFunc);
    };

    fabApi.loadPage = function(pageTitle, callbackFunc) {
        //console.log('fabApi.loadPage', pageTitle)
        api.get({
            formatversion: 2,
            action: 'parse',
            prop: 'wikitext',
            page: pageTitle,
            utf8: true
        }).done(callbackFunc).fail(failFunc);
    }
    /////////////////////////////////////////////////////////////////////
    
    window.ApiRenamePage = renamePage;
    window.ApiCheckIsTitleVaild = checkIsTitleVaild;
    window.ApiLoadAllCategories = loadCategoriesData;
    window.ApiLoadTemplateCategories = loadSelectedTemplateCategories;
    window.ApiLoadTemplateWikiTextAndCategories = loadTemplatePageWikiTextAndCategories;
    window.ApiCheckUserInfo = checkUserInfo;
    window.ApiEditOrCreateNewPage = editOrCreateNewPageWithContext;
    window.ApiLoadAllFilesData = loadAllFilesData;
    window.ApiReloadPurge = reloadPurge;
    window.ApiReloadPurgeByIframe = reloadPurgeByIframe;
    window.ApiDeletePage = deletePage;
    window.ApiLoadPageWikiText = loadPageWikiText;
    window.ApiFixTitle = function(title){
        if( -1 == title.indexOf(':')){
            var prefix = mw.config.get('wgCanonicalNamespace');
            if(prefix){
                prefix += ':';
            }
            title = prefix + title;
        }
        return title;
    }

}(mediaWiki, jQuery));
