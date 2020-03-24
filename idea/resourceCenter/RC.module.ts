import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { IDEASelectModule } from '../select/select.module';
import { IDEADownloaderModule } from '../downloader/downloader.module';
import { IDEATranslationsModule } from '../translations/translations.module';

import { IDEARCPickerComponent } from './RCPicker.component';
import { IDEARCConfiguratorComponent } from './RCConfigurator.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, IDEATranslationsModule, IDEASelectModule, IDEADownloaderModule],
  declarations: [IDEARCPickerComponent, IDEARCConfiguratorComponent],
  entryComponents: [IDEARCPickerComponent, IDEARCConfiguratorComponent],
  exports: [IDEARCPickerComponent, IDEARCConfiguratorComponent]
})
export class IDEARCModule {}
