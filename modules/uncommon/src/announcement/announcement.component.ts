import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { IonCard, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { Announcement, mdToHtml } from 'idea-toolbox';
import { IDEAEnvironment, IDEAStorageService, IDEATranslatePipe } from '@idea-ionic/common';

import { IDEATinCanService } from '../tinCan.service';

/**
 * Announcement card that can be set in any interface to show the alert for this project.
 */
@Component({
  selector: 'idea-announcement',
  standalone: true,
  imports: [CommonModule, IDEATranslatePipe, IonButton, IonCardContent, IonCard],
  template: `
    @if (htmlContent) {
      <ion-card class="announcementCard" [color]="color">
        <ion-card-content>
          <p class="htmlContent" [innerHTML]="htmlContent"></p>
          <p class="ion-text-right">
            <ion-button color="primary" (click)="markAsRead()">
              {{ 'COMMON.GOT_IT' | translate }}
            </ion-button>
          </p>
        </ion-card-content>
      </ion-card>
    }
  `
})
export class IDEAAnnouncementComponent implements OnInit {
  protected _env = inject(IDEAEnvironment);
  private _tc = inject(IDEATinCanService);
  private _storage = inject(IDEAStorageService);

  /**
   * The color for the announcement card.
   */
  @Input() color: string;

  announcement: Announcement;
  htmlContent: string;
  storageKey: string;

  constructor() {
    this.storageKey = (this._env.idea.project || 'app').concat('_LAST_ANNOUNCEMENT');
    this.color = 'dark';
  }
  async ngOnInit(): Promise<void> {
    // standard IDEA: the announcement is read in the Init Guard
    this.announcement = this._tc.get('idea-announcement');
    if (this.announcement && this.announcement.content) {
      const lastRead: string = await this._storage.get(this.storageKey);
      if (!lastRead || this.announcement.content !== lastRead) this.htmlContent = mdToHtml(this.announcement.content);
    }
  }

  async markAsRead(): Promise<void> {
    await this._storage.set(this.storageKey, this.announcement.content);
    this.htmlContent = null;
  }
}
