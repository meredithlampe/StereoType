jQuery(document).ready(function($) {
    
    /* Backend Scripts */
    if($('#jeweltheme_start_date').length){
        $(function(){
            var pickerOpts = {
                dateFormat: "yy-mm-dd"
            };	
            jQuery("#jeweltheme_start_date").datepicker(pickerOpts);
            jQuery("#jeweltheme_end_date").datepicker(pickerOpts);
        });

    }

    /* Frontend Scripts */
    if($('#announcements').length){    
        if($.cookie('jeweltheme_announcement_active') == 'false') {
            $("#announcements").hide();
        };
        $("#close").click(function() {
            $("#announcements").slideUp("normal");
            $.cookie('jeweltheme_announcement_active', 'false', { expires: 2, path: '/'});
            return false;
        });
        $("body").prepend($("#announcements"));
        $('#announcements .sap_message').cycle('fade');
    }
});