import { Component, Input, SimpleChanges } from '@angular/core';

import { IDEAExtBrowserService } from '../extBrowser.service';
import { IDEATranslationsService } from '../translations/translations.service';

/**
 * === How to use this component ===
 *   1. Place `<idea-downloader [download]="download"></idea-downloader>`
 *    in the bottom of a page or component template, outside the `ion-content tag`.
 *   2. Create a new attribute in the component `public download: IDEADownloaderURL;`.
 *   3. Each time we want to download a file, istantiate the attribute `this.download = new IDEADownloaderURL(url)`.
 */

/**
 * Helper class to trigger a download.
 */
export class IDEADownloaderURL {
  public url: string;
  public target: string;

  constructor(url: string, target?: string) {
    this.url = url;
    this.target = target || '_blank';
  }
}

@Component({
  selector: 'idea-downloader',
  templateUrl: 'downloader.component.html',
  styleUrls: ['downloader.component.scss']
})
export class IDEADownloaderComponent {
  /**
   * The vertical position of the Fab.
   */
  @Input() public vertical: string;
  /**
   * The horizontal position of the Fab.
   */
  @Input() public horizontal: string;
  /**
   * The deteail to the file to download. When the URL it's set, the download button appear.
   */
  @Input() public download: IDEADownloaderURL;
  /**
   * The number of seconds after which the button should disappear. 0 = don't hide.
   */
  @Input() public hideAfterSeconds: number;
  /**
   * If set, try to open the url when it's set.
   */
  @Input() public autoOpenLink: boolean;
  /**
   * The icon of the download button.
   */
  @Input() public icon: string;
  /**
   * The color of the download button.
   */
  @Input() public color: string;
  /**
   * The size of the download button.
   */
  @Input() public size: string;

  constructor(public t: IDEATranslationsService, public extBrowser: IDEAExtBrowserService) {
    this.vertical = 'bottom';
    this.horizontal = 'start';
    this.download = null;
    this.hideAfterSeconds = 10;
    this.autoOpenLink = true;
    this.icon = 'download-outline';
    this.color = 'primary';
    this.size = undefined;
  }

  public ngOnChanges(changes: SimpleChanges) {
    // when a new link is passed to the component, set the behaviour
    if (changes['download'].currentValue) {
      // auto-hide the button after the number of seconds specified
      if (this.hideAfterSeconds) setTimeout(() => (this.download.url = null), this.hideAfterSeconds * 1000);
      // auto-open the link, if specified; note: in some Browsers it just won't work, so the physical button is needed
      if (this.autoOpenLink) this.extBrowser.openLink(this.download.url);
    }
  }
}
