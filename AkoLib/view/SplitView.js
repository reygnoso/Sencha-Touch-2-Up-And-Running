Ext.define('AkoLib.view.SplitView', {
    extend: 'Ext.Container',
    xtype: 'akosplitview',
    config: {
        masterView: null,
        detailView: null,
        screenTitle: 'Sample Split View',
        menuButtonTitle: 'Menu',
        detailToolbarButtons: null,

        itemId: 'splitView',
        layout: 'hbox',
        items: [{ 
            margin: '0 1 0 0',
            xtype: 'container',
            itemId: 'masterPanel',
            flex: 1,
            layout: 'fit',
            hideAnimation: 'slideOut',
            showAnimation: {
                type: 'slideIn',
                direction: 'right'
            }
        }, { 
            margin: '0 0 0 1',
            itemId: 'detailPanel',
            xtype: 'container',
            layout: 'fit',
            flex: 2,
            items: [{
                itemId: 'titleToolbar',
                title: '',
                xtype: 'toolbar',
                docked: 'top',
                items: [{
                    xtype: 'button',
                    itemId: 'showMenuButton',
                    hideAnimation: 'fadeOut',
                    showAnimation: 'fadeIn'
                }]
            }, {
                xtype: 'container',
                itemId: 'contentPanel',
                layout: 'fit'
            }]
        }]
    },

    // INITIALIZER 

    initialize: function(){
        this.callParent(arguments);

        var o = Ext.Viewport.getOrientation();
        this.handleOrientationChange({ orientation: o });
        Ext.Viewport.onBefore('orientationchange', 'handleOnBeforeOrientationChange', this, { buffer: 50 });
        Ext.Viewport.on('orientationchange', 'handleOrientationChange', this, { buffer: 50 });

        this.getMasterPanel().add(this.getMasterView());
        this.getContentPanel().add(this.getDetailView());
        this.setTitle(this.getScreenTitle());
        this.getShowMenuButton().setText(this.getMenuButtonTitle());
        this.getShowMenuButton().addListener('tap', function (button, e, eOpts) {
            this.getOverlayView().showBy(button, 'tl-bc');
        }, this);

        var toolbarButtons = this.getDetailToolbarButtons();
        if (toolbarButtons) {
            this.getTitleToolbar().add(toolbarButtons);
        }
    },

    // PUBLIC METHODS

    setTitle: function (title) {
        var toolbar = this.getTitleToolbar();
        toolbar.setTitle(title);
    },

    displayComponent: function (component) {
        var contentPanel = this.getContentPanel();
        contentPanel.removeAll(false, false);
        contentPanel.add(component);
        this.hideOverlayView();
    },

    // EVENT HANDLERS

    handleOnBeforeOrientationChange: function () {
        this.hideOverlayView();
    },

    handleOrientationChange: function (obj) {
        var masterPanel = this.getMasterPanel();
        var showMenuButton = this.getShowMenuButton();
        var o = obj.orientation;
        if (o === 'landscape') {
            masterPanel.show();
            showMenuButton.hide();
        }
        else if (o === 'portrait') {
            masterPanel.hide();
            showMenuButton.show();
        }
    },

    // PRIVATE METHODS

    getOverlayView: function () {
        if (!this.overlayView) {
            this.overlayView = Ext.Viewport.add({
                xtype: 'panel',
                layout: 'card',
                modal: true,
                hideOnMaskTap: true,
                width: 340,
                height: 600,
                hidden: true,
                hideAnimation: 'fadeOut',
                showAnimation: 'fadeIn'
            });
            this.overlayView.addListener('show', function () {
                this.getOverlayView().add(this.getMasterView());
            }, this);
            this.overlayView.addListener('hide', function () {
                this.getMasterPanel().add(this.getMasterView());
            }, this);
        }
        return this.overlayView;
    },

    getMasterPanel: function () {
        if (!this.masterPanel) {
            this.masterPanel = this.getComponent('masterPanel');
        }
        return this.masterPanel;
    },

    getDetailPanel: function () {
        if (!this.detailPanel) {
            this.detailPanel = this.getComponent('detailPanel');
        }
        return this.detailPanel;
    },

    getContentPanel: function () {
        if (!this.contentPanel) {
            this.contentPanel = this.getDetailPanel().getComponent('contentPanel');
        }
        return this.contentPanel;
    },

    getTitleToolbar: function () {
        if (!this.titleToolbar) {
            this.titleToolbar = this.getDetailPanel().getComponent('titleToolbar');
        }
        return this.titleToolbar;
    },

    getShowMenuButton: function () {
        if (!this.showMenuButton) {
            this.showMenuButton = this.getTitleToolbar().getComponent('showMenuButton');
        }
        return this.showMenuButton;
    },

    hideOverlayView: function () {
        this.getOverlayView().hide();
    }
});

