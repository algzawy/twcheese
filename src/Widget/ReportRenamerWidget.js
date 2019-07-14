import { AbstractWidget } from '/twcheese/src/Widget/AbstractWidget.js';
import { ImageSrc } from '/twcheese/conf/ImageSrc.js';
import { escapeHtml } from '/twcheese/src/Util/UI.js';
import { userConfig } from '/twcheese/src/Util/Config.js';


class ReportRenamerWidget extends AbstractWidget {

    /**
     * @param {ReportRenamer} renamer 
     * @param {BattleReport} report      
     */
    constructor(renamer, report) {
        super();
        this.renamer = renamer;
        this.report = report;

        this.initStructure();
        this.watchSelf();
    }

    initStructure() {
        this.$el = $(this.createHtml().trim());
        this.$note = this.$el.find('#twcheese_note');
        this.$renameButton = this.$el.find('button');
        this.$autoRename = this.$el.find('#twcheese_auto_rename');
        this.$namePreview = this.$el.find('#twcheese_rename_preview');
        this.$availableChars = this.$el.find('#twcheese_availableCharacters');
    }

    createHtml() {
        let renamer = this.renamer;
        let name = renamer.createName(this.report, '');

        return `
            <div id="twcheese_renamer" align="center">
                <span align="center"><h2>Renamer</h2></span>
                note <input id="twcheese_note" type="text"/>
                <button>rename</button>
                <input id="twcheese_auto_rename" type="checkbox" />auto rename
                <img id="twcheese_autoRenameInfo" src="${ImageSrc.info}" width="13" height="13" title="automatically rename reports when the BRE is used" />
                <br/> characters available: <span id="twcheese_availableCharacters">${renamer.availableChars(name)}</span>
                <br/><b>Preview: </b><span id="twcheese_rename_preview">${escapeHtml(name)}</span>
            </div>
        `;
    }

    watchSelf() {
        let renamer = this.renamer;

        this.$note.on('input', () => {
            let name = renamer.createName(report, this.$note.val());
            this.$namePreview.text(name);
            this.$availableChars.text(renamer.availableChars(name));
        });

        this.$renameButton.on('click', () => {
            this.renameReport(this.$note.val());
        });

        this.$autoRename.on('click', function() {
            userConfig.set('ReportToolsWidget.autoRename', this.checked);
        });
    }

    /**
     * @param {string} note
     */
    async renameReport(note) {
        let report = this.report;
        let name = await this.renamer.rename(report, note);

        $('.quickedit[data-id="' + report.reportId + '"]')
            .find('.quickedit-label').html(name);
    }

}


export { ReportRenamerWidget };