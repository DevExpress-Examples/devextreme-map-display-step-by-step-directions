window.E4801 = window.E4801 || {};

$(function() {
    // Uncomment the line below to disable platform-specific look and feel and to use the Generic theme for all devices
    // DevExpress.devices.current({ platform: "generic" });
    // To customize the Generic theme, use the DevExtreme Theme Builder (http://js.devexpress.com/ThemeBuilder)
    // For details on how to use themes and the Theme Builder, refer to the http://js.devexpress.com/Documentation/Guide/#themes article

    $(document).on("deviceready", function () {
        navigator.splashscreen.hide();
        if(window.devextremeaddon) {
            window.devextremeaddon.setup();
        }
        $(document).on("backbutton", function () {
            DevExpress.processHardwareBackButton();
        });
    });

    function onNavigatingBack(e) {
        if (e.isHardwareButton && !E4801.app.canBack()) {
            e.cancel = true;
            exitApp();
        }
    }

    function exitApp() {
        switch (DevExpress.devices.real().platform) {
            case "android":
                navigator.app.exitApp();
                break;
            case "win":
                MSApp.terminateApp('');
                break;
        }
    }

    E4801.app = new DevExpress.framework.html.HtmlApplication({
        namespace: E4801,
        layoutSet: DevExpress.framework.html.layoutSets[E4801.config.layoutSet],
        navigation: E4801.config.navigation,
        commandMapping: E4801.config.commandMapping
    });
    E4801.app.router.register(":view/:id", { view: "home", id: undefined });
    E4801.app.on("navigatingBack", onNavigatingBack);
    E4801.app.navigate();
});
