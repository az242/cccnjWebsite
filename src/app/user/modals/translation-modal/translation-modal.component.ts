import { Component, OnInit, ViewChild } from '@angular/core';
import { JsonEditorComponent, JsonEditorOptions, NgJsonEditorModule } from 'ang-jsoneditor';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'translation-modal',
  templateUrl: './translation-modal.component.html',
  styleUrls: ['./translation-modal.component.scss'],
  imports: [NgJsonEditorModule]
})
export class TranslationModalComponent implements OnInit {
  public editorOptions: JsonEditorOptions;
  public data: any;
  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;
  constructor(private db: DbService) {
    this.editorOptions = new JsonEditorOptions()
    this.editorOptions.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
    //this.options.mode = 'code'; //set only one mode

    this.data = {};
  }
  async ngOnInit(): Promise<void> {
    this.data = await this.db.getTranslations();
  }

  async save() {
    let changedData = this.editor.get();
    await this.db.saveTranslation(changedData);
  }

}
